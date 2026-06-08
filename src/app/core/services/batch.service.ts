import { Injectable, inject } from '@angular/core';
import { executeQuery, QueryFetchPolicy } from 'firebase/data-connect';
import {
  allocateProductToBatch,
  createBatch,
  deleteBatch,
  deliverBatch,
  finalizeBatch,
  getBatchRef,
  listAllBatchesRef,
  listBatchesRef,
  markBatchProductsShipped,
  returnBatchProductsToStock,
  shipBatch,
  unallocateProduct,
  updateBatchNotes,
  BatchStatus,
  GetBatchData,
  ListAllBatchesData,
} from '../dataconnect';
import { FirebaseClientService } from './firebase-client.service';

export type BatchListRow = ListAllBatchesData['batches'][number];
export type BatchDetail = NonNullable<GetBatchData['batch']>;

@Injectable({ providedIn: 'root' })
export class BatchService {
  private readonly firebase = inject(FirebaseClientService);

  // Reads call executeQuery directly with the query ref rather than the
  // generated wrappers. The wrappers forward `options.fetchPolicy` (a string)
  // where executeQuery expects the full options object, so SERVER_ONLY is
  // dropped and the SDK falls back to PREFER_CACHE — returning stale data
  // after a mutation (e.g. finalize). See product.service.listInStock.
  async listAll(): Promise<BatchListRow[]> {
    const result = await executeQuery(listAllBatchesRef(this.firebase.dataConnect), {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
    return result.data.batches;
  }

  async listByStatus(status: BatchStatus): Promise<BatchListRow[]> {
    const result = await executeQuery(
      listBatchesRef(this.firebase.dataConnect, { status }),
      { fetchPolicy: QueryFetchPolicy.SERVER_ONLY },
    );
    return result.data.batches;
  }

  async get(id: string): Promise<BatchDetail | null> {
    const result = await executeQuery(getBatchRef(this.firebase.dataConnect, { id }), {
      fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
    });
    return result.data.batch ?? null;
  }

  async create(
    shelterId: string,
    notes?: string,
  ): Promise<string> {
    const result = await createBatch(this.firebase.dataConnect, {
      shelterId,
      notes: notes || null,
    });
    return result.data.batch_insert.id;
  }

  async addProduct(productId: string, batchId: string): Promise<void> {
    await allocateProductToBatch(this.firebase.dataConnect, {
      productId,
      batchId,
    });
  }

  async removeProduct(productId: string): Promise<void> {
    await unallocateProduct(this.firebase.dataConnect, { productId });
  }

  async finalize(id: string): Promise<void> {
    await finalizeBatch(this.firebase.dataConnect, { id });
  }

  async ship(id: string): Promise<void> {
    await shipBatch(this.firebase.dataConnect, { id });
    await markBatchProductsShipped(this.firebase.dataConnect, { batchId: id });
  }

  async deliver(id: string): Promise<void> {
    await deliverBatch(this.firebase.dataConnect, { id });
  }

  async updateNotes(id: string, notes: string): Promise<void> {
    await updateBatchNotes(this.firebase.dataConnect, {
      id,
      notes: notes || null,
    });
  }

  // Hard delete. Return any allocated products to inventory first so they
  // aren't stranded on a batch row that no longer exists, then drop the batch.
  // Only meaningful for batches that haven't shipped (enforced in the UI).
  async delete(id: string): Promise<void> {
    await returnBatchProductsToStock(this.firebase.dataConnect, { batchId: id });
    await deleteBatch(this.firebase.dataConnect, { id });
  }
}
