import { Injectable, inject } from '@angular/core';
import {
  deleteProduct,
  getProductRef,
  listAvailableProductsForShelterRef,
  listExpiringSoonRef,
  listInventoryInStockRef,
  listProductsInBatchRef,
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
    const data = await this.firebase.read(
      listInventoryInStockRef(this.firebase.dataConnect, {
        limit: filter.limit ?? 100,
        offset: filter.offset ?? 0,
      }),
    );
    return data.products;
  }

  async get(id: string): Promise<ProductDetail | null> {
    const data = await this.firebase.read(
      getProductRef(this.firebase.dataConnect, { id }),
    );
    return data.product ?? null;
  }

  async listAvailableForShelter(
    types: string[],
    limit = 200,
  ): Promise<AvailableForShelterRow[]> {
    const data = await this.firebase.read(
      listAvailableProductsForShelterRef(this.firebase.dataConnect, {
        types: types.length > 0 ? types : null,
        limit,
      }),
    );
    return data.products;
  }

  async listInBatch(batchId: string) {
    const data = await this.firebase.read(
      listProductsInBatchRef(this.firebase.dataConnect, { batchId }),
    );
    return data.products;
  }

  async listExpiringSoon(daysFromNow = 30): Promise<ExpiringRow[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysFromNow);
    const before = cutoff.toISOString().slice(0, 10);
    const data = await this.firebase.read(
      listExpiringSoonRef(this.firebase.dataConnect, { beforeDate: before }),
    );
    return data.products;
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
