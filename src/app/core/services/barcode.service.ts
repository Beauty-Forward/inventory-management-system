import { Injectable, inject } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import {
  getCatalogByBarcode,
  incrementCatalogUsage,
  upsertCatalogEntry,
  GetCatalogByBarcodeData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';

export type BarcodeLookupSource =
  | 'catalog'
  | 'open_beauty_facts'
  | 'open_food_facts'
  | 'upcitemdb'
  | 'gemini_text';

export interface BarcodeLookupResult {
  found: boolean;
  barcode: string;
  name?: string;
  brand?: string;
  type?: string;
  price?: string;
  color?: string;
  keyIngredients?: string;
  confidence?: 'high' | 'medium' | 'low';
  source?: BarcodeLookupSource;
}

interface RemoteLookupResult {
  found: boolean;
  barcode: string;
  name?: string;
  brand?: string;
  type?: string;
  ingredients?: string;
  categories?: string;
  imageUrl?: string | null;
  confidence?: 'high' | 'medium' | 'low';
  source?: Exclude<BarcodeLookupSource, 'catalog'>;
}

type CatalogRow = NonNullable<GetCatalogByBarcodeData['productCatalog']>;

@Injectable({ providedIn: 'root' })
export class BarcodeLookupService {
  private readonly firebase = inject(FirebaseClientService);

  /**
   * Two-tier lookup:
   *   1. product_catalog table (local cache, instant)
   *   2. Open Food/Beauty Facts via Cloud Function
   */
  async lookup(barcode: string): Promise<BarcodeLookupResult> {
    const normalized = barcode.trim();
    if (!normalized) return { found: false, barcode };

    // Tier 1: local catalog
    const cached = await this.fetchFromCatalog(normalized);
    if (cached) {
      // Fire-and-forget usage increment
      incrementCatalogUsage(this.firebase.dataConnect, {
        barcode: normalized,
      }).catch((err) => console.warn('catalog usage inc failed', err));
      return {
        found: true,
        barcode: normalized,
        name: cached.name,
        brand: cached.brand,
        type: cached.type,
        price: cached.price ?? undefined,
        color: cached.color ?? undefined,
        keyIngredients: cached.keyIngredients ?? undefined,
        source: 'catalog',
      };
    }

    // Tier 2+: remote lookup cascade (OBF → OFF → UPCitemdb → Gemini text)
    try {
      const fn = httpsCallable<{ barcode: string }, RemoteLookupResult>(
        this.firebase.functions,
        'lookupProductByBarcode',
      );
      const { data } = await fn({ barcode: normalized });
      if (data.found) {
        return {
          found: true,
          barcode: normalized,
          name: data.name,
          brand: data.brand,
          type: data.type,
          keyIngredients: data.ingredients,
          confidence: data.confidence,
          source: data.source,
        };
      }
    } catch (err) {
      console.warn('barcode lookup failed', err);
    }

    return { found: false, barcode: normalized };
  }

  private async fetchFromCatalog(barcode: string): Promise<CatalogRow | null> {
    try {
      const result = await getCatalogByBarcode(this.firebase.dataConnect, {
        barcode,
      });
      return result.data.productCatalog ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Called after a product is successfully entered with a barcode, so
   * the next scan of the same product pre-populates instantly.
   */
  async cacheEntry(entry: {
    barcode: string;
    name: string;
    brand: string;
    type: string;
    price?: string;
    color?: string;
    keyIngredients?: string;
    source?: 'manual' | 'open_food_facts' | 'scan';
  }): Promise<void> {
    try {
      await upsertCatalogEntry(this.firebase.dataConnect, {
        barcode: entry.barcode,
        name: entry.name,
        brand: entry.brand,
        type: entry.type,
        price: entry.price || null,
        color: entry.color || null,
        keyIngredients: entry.keyIngredients || null,
        source: entry.source ?? 'scan',
      });
    } catch (err) {
      console.warn('catalog cache failed', err);
    }
  }

  /**
   * Sends a product photo to Gemini (via the extractProductFromImage
   * Cloud Function) and returns structured fields. Used as a fallback
   * when barcode lookup fails or no barcode is scannable.
   */
  async identifyFromImage(
    imageBase64: string,
    mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  ): Promise<PhotoExtractionResult> {
    try {
      const fn = httpsCallable<
        { imageBase64: string; mimeType: string },
        PhotoExtractionResult
      >(this.firebase.functions, 'extractProductFromImage');
      const { data } = await fn({ imageBase64, mimeType });
      return data;
    } catch (err) {
      // Keep the real error in the reason so an upload/size/timeout failure is
      // distinguishable from a genuine "no product found" when diagnosing on a
      // device (where the console isn't visible).
      console.warn('photo extraction failed', err);
      return { found: false, reason: `function error: ${String(err)}` };
    }
  }
}

export interface PhotoExtractionResult {
  found: boolean;
  source?: 'gemini_vision';
  confidence?: 'high' | 'medium' | 'low';
  name?: string;
  brand?: string;
  type?: string;
  color?: string;
  colorCategory?: string;
  keyIngredients?: string;
  size?: string;
  reason?: string;
  raw?: string;
}
