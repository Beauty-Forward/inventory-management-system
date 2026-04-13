export type BatchStatus = 'draft' | 'finalized' | 'shipped' | 'delivered';

export interface Batch {
  id: string;
  shelterId: string;
  status: BatchStatus;
  productIds: string[];
  productCount: number;
  productSummary: Record<string, number>;
  notes?: string;
  createdBy: string;
  finalizedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
