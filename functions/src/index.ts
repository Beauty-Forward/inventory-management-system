import { initializeApp } from 'firebase-admin/app';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { SchemaType, VertexAI } from '@google-cloud/vertexai';

initializeApp();

const PRODUCT_TYPE_ENUM = [
  'shampoo', 'conditioner', 'hair_oil', 'hair_mask', 'styling_product',
  'moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner',
  'lipstick', 'lip_gloss', 'foundation', 'concealer', 'eyeshadow',
  'mascara', 'blush', 'bronzer',
  'soap', 'body_wash', 'deodorant', 'toothpaste', 'toothbrush', 'feminine_products',
  'nail_polish', 'nail_polish_remover', 'nail_tools',
  'perfume', 'body_spray', 'body_lotion',
] as const;

type ProductType = typeof PRODUCT_TYPE_ENUM[number];

// Maps free-text "categories" strings returned by UPCitemdb / OBF / OFF
// into our controlled product-type enum. Patterns are ordered most-specific
// first so compound phrases ("nail polish remover", "body lotion") match
// before their parent words ("nail polish", "body").
//
// Returns undefined when no confident match — the client treats that as
// "type still blank, ask the volunteer to pick one."
const CATEGORY_PATTERNS: Array<[RegExp, ProductType]> = [
  // Compound terms — must come before single-word variants
  [/\bnail\s*polish\s*remover/i, 'nail_polish_remover'],
  [/\bnail\s*polish/i, 'nail_polish'],
  [/\bnail\s*(tools|file|clipper|kit|art)/i, 'nail_tools'],
  [/\bbody\s*lotion/i, 'body_lotion'],
  [/\bbody\s*(spray|mist)/i, 'body_spray'],
  [/\bbody\s*wash/i, 'body_wash'],
  [/\blip\s*gloss/i, 'lip_gloss'],
  [/\beye\s*shadow/i, 'eyeshadow'],
  [/\bhair\s*oil/i, 'hair_oil'],
  [/\bhair\s*mask/i, 'hair_mask'],
  [/\b(hair\s*spray|hair\s*gel|hair\s*mousse|hair\s*styling|styling\s*(product|cream|gel))/i, 'styling_product'],
  // Skincare
  [/\b(moisturizer|moisturiser|face\s*cream|day\s*cream|night\s*cream)/i, 'moisturizer'],
  [/\b(cleanser|face\s*wash|facial\s*wash|micellar\s*water)/i, 'cleanser'],
  [/\bserum/i, 'serum'],
  [/\b(sunscreen|sunblock|sun\s*protect|spf)/i, 'sunscreen'],
  [/\btoner/i, 'toner'],
  // Makeup
  [/\blipstick/i, 'lipstick'],
  [/\bfoundation/i, 'foundation'],
  [/\bconcealer/i, 'concealer'],
  [/\bmascara/i, 'mascara'],
  [/\bblusher?\b/i, 'blush'],
  [/\bbronzer/i, 'bronzer'],
  // Hair
  [/\bshampoo/i, 'shampoo'],
  [/\bconditioner/i, 'conditioner'],
  // Body / hygiene
  [/\bsoap/i, 'soap'],
  [/\b(deodorant|antiperspirant)/i, 'deodorant'],
  [/\btoothpaste/i, 'toothpaste'],
  [/\btoothbrush/i, 'toothbrush'],
  [/\b(feminine|menstrual|sanitary\s*pad|tampon)/i, 'feminine_products'],
  // Fragrance
  [/\b(perfume|eau\s*de|cologne|fragrance)/i, 'perfume'],
];

function categoriesToProductType(categories: string): ProductType | undefined {
  if (!categories) return undefined;
  for (const [pattern, type] of CATEGORY_PATTERNS) {
    if (pattern.test(categories)) return type;
  }
  return undefined;
}

const extractionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING, description: 'Product name on the package' },
    brand: { type: SchemaType.STRING, description: 'Brand name' },
    type: { type: SchemaType.STRING, enum: PRODUCT_TYPE_ENUM as unknown as string[] },
    color: { type: SchemaType.STRING, description: 'Specific color/shade if visible' },
    colorCategory: { type: SchemaType.STRING, description: 'Broad category like warm nude, rose, cool pink' },
    keyIngredients: { type: SchemaType.STRING, description: 'Comma-separated key ingredients if visible' },
    size: { type: SchemaType.STRING, description: 'Package size, e.g. 8oz or 250ml' },
    confidence: { type: SchemaType.STRING, enum: ['high', 'medium', 'low'] },
  },
  required: ['name', 'brand', 'type', 'confidence'],
};

let _vertex: VertexAI | null = null;
function getVertex(): VertexAI {
  if (!_vertex) {
    _vertex = new VertexAI({
      project: process.env['GCLOUD_PROJECT'] || 'beauty-forward',
      location: 'us-central1',
    });
  }
  return _vertex;
}

// Multi-tier barcode lookup. Cascade order is empirical: UPCitemdb has the best
// US-retail beauty coverage in practice, so it runs first. OBF/OFF are
// crowdsourced and uneven; they backstop for international products. Gemini is
// a last resort because its accuracy is low.
//
// Each tier emits a structured log line so we can trace exactly which tier
// hit/missed/errored for a given scan. Filter in Cloud Logging by:
//   jsonPayload.fn = "lookupProductByBarcode" AND jsonPayload.barcode = "..."
export const lookupProductByBarcode = onCall(
  { region: 'us-central1' },
  async (request) => {
    const barcode =
      typeof request.data?.barcode === 'string'
        ? request.data.barcode.trim()
        : '';

    if (!barcode || barcode.length < 6) {
      throw new HttpsError('invalid-argument', 'barcode is required');
    }

    const log = (
      tier: string,
      outcome: 'hit' | 'miss' | 'error',
      extras: Record<string, unknown> = {},
    ) => {
      console.log(
        JSON.stringify({
          fn: 'lookupProductByBarcode',
          barcode,
          tier,
          outcome,
          ...extras,
        }),
      );
    };

    // Tier 1: UPCitemdb — best US retail coverage for beauty products in
    // practice. Trial endpoint is ~100 lookups/day shared (no key required).
    // Set UPCITEMDB_API_KEY env var to use the paid endpoint with higher
    // rate limits — the trial endpoint commonly returns 429 / empty results
    // under modest production usage.
    try {
      const apiKey = process.env['UPCITEMDB_API_KEY'];
      const upcItemDbUrl = apiKey
        ? `https://api.upcitemdb.com/prod/v1/lookup?upc=${encodeURIComponent(barcode)}`
        : `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`;
      const headers: Record<string, string> = {
        'User-Agent': 'BeautyForwardIMS/1.0',
      };
      if (apiKey) headers['user_key'] = apiKey;

      const res = await fetch(upcItemDbUrl, { headers });
      if (!res.ok) {
        log('upcitemdb', 'miss', {
          httpStatus: res.status,
          httpStatusText: res.statusText,
          hasApiKey: !!apiKey,
          note: res.status === 429
            ? 'rate limited — trial endpoint shared quota exhausted; set UPCITEMDB_API_KEY'
            : undefined,
        });
      } else {
        const body = (await res.json()) as {
          code?: string;
          message?: string;
          items?: Array<{
            title?: string;
            brand?: string;
            category?: string;
            images?: string[];
          }>;
        };
        const item = body.items?.[0];
        if (body.code === 'OK' && item?.title) {
          const type = categoriesToProductType(item.category ?? '');
          log('upcitemdb', 'hit', {
            title: item.title.slice(0, 80),
            brand: item.brand,
            mappedType: type,
          });
          return {
            found: true,
            barcode,
            name: item.title,
            brand: item.brand ?? '',
            type,
            ingredients: '',
            categories: item.category ?? '',
            imageUrl: item.images?.[0] ?? null,
            source: 'upcitemdb',
          };
        }
        log('upcitemdb', 'miss', {
          bodyCode: body.code,
          bodyMessage: body.message,
          itemCount: body.items?.length ?? 0,
          firstItemTitle: item?.title?.slice(0, 80),
          hasApiKey: !!apiKey,
        });
      }
    } catch (err) {
      log('upcitemdb', 'error', { err: String(err).slice(0, 200) });
    }

    // Tier 2 & 3: Open Beauty Facts → Open Food Facts. Crowdsourced; coverage
    // varies. OBF is beauty-specific so tried before OFF.
    const openFactsEndpoints: Array<{
      url: string;
      source: 'open_beauty_facts' | 'open_food_facts';
      tier: 'obf' | 'off';
    }> = [
      {
        url: `https://world.openbeautyfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
        source: 'open_beauty_facts',
        tier: 'obf',
      },
      {
        url: `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
        source: 'open_food_facts',
        tier: 'off',
      },
    ];

    for (const { url, source, tier } of openFactsEndpoints) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'BeautyForwardIMS/1.0' },
        });
        if (!res.ok) {
          log(tier, 'miss', { httpStatus: res.status });
          continue;
        }
        const body = (await res.json()) as {
          status?: number;
          product?: Record<string, unknown>;
        };
        if (body.status !== 1 || !body.product) {
          log(tier, 'miss', { bodyStatus: body.status, hasProduct: !!body.product });
          continue;
        }

        const p = body.product;
        const name =
          (p['product_name'] as string) || (p['generic_name'] as string) || '';
        if (!name) {
          log(tier, 'miss', { reason: 'no name in product' });
          continue;
        }

        const categoriesText = (p['categories'] as string) ?? '';
        const type = categoriesToProductType(categoriesText);
        log(tier, 'hit', { name: name.slice(0, 80), mappedType: type });
        return {
          found: true,
          barcode,
          name,
          brand: (p['brands'] as string)?.split(',')[0]?.trim() ?? '',
          type,
          ingredients: (p['ingredients_text'] as string) ?? '',
          categories: categoriesText,
          imageUrl: (p['image_url'] as string) ?? null,
          source,
        };
      } catch (err) {
        log(tier, 'error', { err: String(err).slice(0, 200) });
      }
    }

    // Tier 4: Gemini text fallback. Asks the model to identify the product
    // from the UPC/EAN alone. Lower accuracy than the DBs above, so results
    // are flagged low/medium confidence and the UI prompts the volunteer
    // to verify. Only fires for numeric barcodes.
    if (/^\d{8,14}$/.test(barcode)) {
      try {
        const vertex = getVertex();
        const model = vertex.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: extractionSchema,
            temperature: 0.2,
          },
        });
        const prompt =
          `A volunteer at a beauty product donation warehouse scanned UPC/EAN "${barcode}". ` +
          'Identify the product from this barcode using your product knowledge. ' +
          'Product type MUST be one of the enum values (snake_case). ' +
          'Set confidence "high" only if certain, "medium" if probable, ' +
          '"low" if guessing. If you have no knowledge of this barcode, ' +
          'return confidence "low" and leave name/brand empty.';

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        const text =
          result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (text) {
          const parsed = JSON.parse(text) as {
            name?: string;
            brand?: string;
            type?: string;
            confidence?: 'high' | 'medium' | 'low';
          };
          if (parsed.name && parsed.brand && parsed.confidence !== 'low') {
            log('gemini', 'hit', {
              confidence: parsed.confidence,
              name: parsed.name?.slice(0, 80),
            });
            return {
              found: true,
              barcode,
              name: parsed.name,
              brand: parsed.brand,
              type: parsed.type,
              ingredients: '',
              categories: '',
              imageUrl: null,
              confidence: parsed.confidence,
              source: 'gemini_text',
            };
          }
          log('gemini', 'miss', {
            confidence: parsed.confidence,
            hasName: !!parsed.name,
            hasBrand: !!parsed.brand,
          });
        } else {
          log('gemini', 'miss', { reason: 'empty model response' });
        }
      } catch (err) {
        log('gemini', 'error', { err: String(err).slice(0, 200) });
      }
    } else {
      log('gemini', 'miss', { reason: 'barcode not 8-14 digits, skipped' });
    }

    log('cascade', 'miss', { reason: 'all tiers exhausted' });
    return { found: false, barcode };
  }
);

// Sends a product photo to Gemini and returns structured fields
// constrained to our beauty product schema. Used when barcode
// lookup returns nothing useful.
export const extractProductFromImage = onCall(
  { region: 'us-central1', memory: '512MiB', timeoutSeconds: 60 },
  async (request) => {
    const imageBase64 =
      typeof request.data?.imageBase64 === 'string'
        ? request.data.imageBase64
        : '';
    const mimeType =
      typeof request.data?.mimeType === 'string'
        ? request.data.mimeType
        : 'image/jpeg';

    if (!imageBase64 || imageBase64.length < 100) {
      throw new HttpsError('invalid-argument', 'imageBase64 is required');
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      throw new HttpsError('invalid-argument', 'unsupported mimeType');
    }

    const vertex = getVertex();
    const model = vertex.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: extractionSchema,
        temperature: 0.2,
      },
    });

    const prompt =
      'You are helping a beauty product donation warehouse catalog products. ' +
      'Examine this product photo and extract the visible fields. ' +
      'Product type MUST be one of the enum values (use snake_case exactly). ' +
      'If a field is not visible or you are uncertain, omit it. ' +
      'Set confidence to "high" if the product is clearly identified, ' +
      '"medium" if partial, "low" if unsure.';

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: imageBase64 } },
            ],
          },
        ],
      });

      const text =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      if (!text) {
        return { found: false, reason: 'empty response' };
      }

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { found: false, reason: 'invalid JSON', raw: text };
      }

      return {
        found: true,
        source: 'gemini_vision',
        ...parsed,
      };
    } catch (err) {
      console.error('Gemini image extraction failed', err);
      throw new HttpsError(
        'internal',
        'Image extraction failed. Check Vertex AI API is enabled.',
      );
    }
  }
);
