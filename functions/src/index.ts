import { initializeApp } from 'firebase-admin/app';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { SchemaType, VertexAI } from '@google-cloud/vertexai';

initializeApp();

const PRODUCT_TYPE_ENUM = [
  'shampoo',
  'conditioner',
  'hair_oil',
  'hair_mask',
  'styling_product',
  'moisturizer',
  'cleanser',
  'serum',
  'sunscreen',
  'toner',
  'lipstick',
  'lip_gloss',
  'foundation',
  'concealer',
  'eyeshadow',
  'mascara',
  'blush',
  'bronzer',
  'soap',
  'body_wash',
  'deodorant',
  'toothpaste',
  'toothbrush',
  'feminine_products',
  'nail_polish',
  'nail_polish_remover',
  'nail_tools',
  'perfume',
  'body_spray',
  'body_lotion',
] as const;

const extractionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING, description: 'Product name on the package' },
    brand: { type: SchemaType.STRING, description: 'Brand name' },
    type: { type: SchemaType.STRING, enum: PRODUCT_TYPE_ENUM as unknown as string[] },
    color: { type: SchemaType.STRING, description: 'Specific color/shade if visible' },
    colorCategory: {
      type: SchemaType.STRING,
      description: 'Broad category like warm nude, rose, cool pink',
    },
    keyIngredients: {
      type: SchemaType.STRING,
      description: 'Comma-separated key ingredients if visible',
    },
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

// Proxies the Open Food Facts public API for barcode lookup.
// Called when a scanned barcode isn't in the local product_catalog cache.
// Open Food Facts covers beauty/personal care products under "obf" (Open Beauty Facts).
export const lookupProductByBarcode = onCall({ region: 'us-central1' }, async (request) => {
  const barcode = typeof request.data?.barcode === 'string' ? request.data.barcode.trim() : '';

  if (!barcode || barcode.length < 6) {
    throw new HttpsError('invalid-argument', 'barcode is required');
  }

  // Tier 1: Open Beauty Facts (beauty-specific crowdsourced DB)
  // Tier 2: Open Food Facts (food DB, occasionally has beauty items)
  const openFactsEndpoints = [
    `https://world.openbeautyfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
  ];

  for (const url of openFactsEndpoints) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'BeautyForwardIMS/1.0' },
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        status?: number;
        product?: Record<string, unknown>;
      };
      if (body.status !== 1 || !body.product) continue;

      const p = body.product;
      const name = (p['product_name'] as string) || (p['generic_name'] as string) || '';
      if (!name) continue;

      return {
        found: true,
        barcode,
        name,
        brand: (p['brands'] as string)?.split(',')[0]?.trim() ?? '',
        ingredients: (p['ingredients_text'] as string) ?? '',
        categories: (p['categories'] as string) ?? '',
        imageUrl: (p['image_url'] as string) ?? null,
        source: url.includes('openbeautyfacts') ? 'open_beauty_facts' : 'open_food_facts',
      };
    } catch (err) {
      console.warn(`Open Facts lookup failed for ${url}`, err);
    }
  }

  // Tier 3: UPCitemdb — broader US retail coverage than OBF/OFF.
  // Trial endpoint is free at ~100 lookups/day, no key. Set
  // UPCITEMDB_API_KEY to use the paid tier with higher limits.
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
    if (res.ok) {
      const body = (await res.json()) as {
        code?: string;
        items?: Array<{
          title?: string;
          brand?: string;
          category?: string;
          images?: string[];
        }>;
      };
      const item = body.items?.[0];
      if (body.code === 'OK' && item?.title) {
        return {
          found: true,
          barcode,
          name: item.title,
          brand: item.brand ?? '',
          ingredients: '',
          categories: item.category ?? '',
          imageUrl: item.images?.[0] ?? null,
          source: 'upcitemdb',
        };
      }
    }
  } catch (err) {
    console.warn('UPCitemdb lookup failed', err);
  }

  // Tier 4: Gemini text fallback — ask the model to identify the product
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
      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      if (text) {
        const parsed = JSON.parse(text) as {
          name?: string;
          brand?: string;
          type?: string;
          confidence?: 'high' | 'medium' | 'low';
        };
        if (parsed.name && parsed.brand && parsed.confidence !== 'low') {
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
      }
    } catch (err) {
      console.warn('Gemini text lookup failed', err);
    }
  }

  return { found: false, barcode };
});

// Sends a product photo to Gemini and returns structured fields
// constrained to our beauty product schema. Used when barcode
// lookup returns nothing useful.
export const extractProductFromImage = onCall(
  { region: 'us-central1', memory: '512MiB', timeoutSeconds: 60 },
  async (request) => {
    const imageBase64 =
      typeof request.data?.imageBase64 === 'string' ? request.data.imageBase64 : '';
    const mimeType =
      typeof request.data?.mimeType === 'string' ? request.data.mimeType : 'image/jpeg';

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
            parts: [{ text: prompt }, { inlineData: { mimeType, data: imageBase64 } }],
          },
        ],
      });

      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
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
      throw new HttpsError('internal', 'Image extraction failed. Check Vertex AI API is enabled.');
    }
  },
);
