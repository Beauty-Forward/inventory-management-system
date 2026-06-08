import { Injectable, inject } from '@angular/core';
import { executeQuery, QueryFetchPolicy } from 'firebase/data-connect';
import {
  deleteProduct,
  getProduct,
  listAvailableProductsForShelter,
  listExpiringSoon,
  listInventoryInStockRef,
  listProductsInBatch,
  markProductDiscarded,
  markProductExpired,
  GetProductData,
  ListInventoryInStockData,
  ListExpiringSoonData,
  ListAvailableProductsForShelterData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';

export type InventoryRow = ListInventoryInStockData['products'][number];
export type ProductDetail = NonNullable<GetProductData['product']>;
export type ExpiringRow = ListExpiringSoonData['products'][number];
export type AvailableForShelterRow =
  ListAvailableProductsForShelterData['products'][number];

export interface InventoryFilter {
  limit?: number;
  offset?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly firebase = inject(FirebaseClientService);

  async listInStock(filter: InventoryFilter = {}): Promise<InventoryRow[]> {
    // Call executeQuery directly with the query ref instead of the
    // auto-generated `listInventoryInStock` wrapper. The wrapper has a
    // bug — it passes `options.fetchPolicy` (a string) where executeQuery
    // expects the full options object, so the SDK never sees SERVER_ONLY
    // and silently falls back to PREFER_CACHE. Direct call preserves the
    // policy so the Inventory tab always reflects the latest inserts.
    const result = await executeQuery(
      listInventoryInStockRef(this.firebase.dataConnect, {
        limit: filter.limit ?? 100,
        offset: filter.offset ?? 0,
      }),
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    return result.data.products;
  }

  async get(id: string): Promise<ProductDetail | null> {
    const result = await getProduct(this.firebase.dataConnect, { id });
    return result.data.product ?? null;
  }

  async listAvailableForShelter(
    types: string[],
    limit = 200,
  ): Promise<AvailableForShelterRow[]> {
    const result = await listAvailableProductsForShelter(
      this.firebase.dataConnect,
      { types: types.length > 0 ? types : null, limit },
    );
    return result.data.products;
  }

  async listInBatch(batchId: string) {
    const result = await listProductsInBatch(this.firebase.dataConnect, {
      batchId,
    });
    return result.data.products;
  }

  async listExpiringSoon(daysFromNow = 30): Promise<ExpiringRow[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysFromNow);
    const before = cutoff.toISOString().slice(0, 10);
    const result = await listExpiringSoon(this.firebase.dataConnect, {
      beforeDate: before,
    });
    return result.data.products;
  }

  async markExpired(id: string): Promise<void> {
    await markProductExpired(this.firebase.dataConnect, { productId: id });
  }

  async markDiscarded(id: string): Promise<void> {
    await markProductDiscarded(this.firebase.dataConnect, { productId: id });
  }

  // Hard delete. A product is a leaf in the data graph (nothing references
  // it), so this removes the row outright — used to correct bad entries.
  async delete(id: string): Promise<void> {
    await deleteProduct(this.firebase.dataConnect, { id });
  }
}
