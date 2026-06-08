import { Injectable, inject } from '@angular/core';
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

  async listAll(): Promise<BatchListRow[]> {
    const data = await this.firebase.read(
      listAllBatchesRef(this.firebase.dataConnect),
    );
    return data.batches;
  }

  async listByStatus(status: BatchStatus): Promise<BatchListRow[]> {
    const data = await this.firebase.read(
      listBatchesRef(this.firebase.dataConnect, { status }),
    );
    return data.batches;
  }

  async get(id: string): Promise<BatchDetail | null> {
    const data = await this.firebase.read(
      getBatchRef(this.firebase.dataConnect, { id }),
    );
    return data.batch ?? null;
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
