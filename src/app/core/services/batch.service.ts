import { Injectable, inject } from '@angular/core';
import {
  allocateProductToBatch,
  createBatch,
  deliverBatch,
  finalizeBatch,
  getBatch,
  listAllBatches,
  listBatches,
  markBatchProductsShipped,
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
    const result = await listAllBatches(this.firebase.dataConnect);
    return result.data.batches;
  }

  async listByStatus(status: BatchStatus): Promise<BatchListRow[]> {
    const result = await listBatches(this.firebase.dataConnect, { status });
    return result.data.batches;
  }

  async get(id: string): Promise<BatchDetail | null> {
    const result = await getBatch(this.firebase.dataConnect, { id });
    return result.data.batch ?? null;
  }

  async create(
    shelterId: string,
    createdBy: string,
    notes?: string,
  ): Promise<string> {
    const result = await createBatch(this.firebase.dataConnect, {
      shelterId,
      createdBy,
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
}
