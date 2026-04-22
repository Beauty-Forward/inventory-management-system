import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  BatchDetail,
  BatchService,
} from '../../core/services/batch.service';

@Component({
  selector: 'app-batch-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './batch-detail-page.component.html',
  styleUrl: './batch-detail-page.component.scss',
})
export class BatchDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly batchService = inject(BatchService);

  readonly batch = signal<BatchDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mutating = signal(false);

  readonly productCount = computed(() => this.batch()?.products.length ?? 0);

  readonly typeSummary = computed(() => {
    const products = this.batch()?.products ?? [];
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, label: this.typeLabel(type), count }))
      .sort((a, b) => b.count - a.count);
  });

  readonly canFinalize = computed(() => this.batch()?.status === 'DRAFT');
  readonly canShip = computed(() => this.batch()?.status === 'FINALIZED');
  readonly canDeliver = computed(() => this.batch()?.status === 'SHIPPED');

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Batch ID missing');
      this.loading.set(false);
      return;
    }
    await this.load(id);
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const batch = await this.batchService.get(id);
      if (!batch) {
        this.error.set('Batch not found');
      } else {
        this.batch.set(batch);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Could not load batch.');
    } finally {
      this.loading.set(false);
    }
  }

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  statusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }

  async removeProduct(productId: string): Promise<void> {
    const b = this.batch();
    if (!b || b.status !== 'DRAFT') return;
    this.mutating.set(true);
    try {
      await this.batchService.removeProduct(productId);
      await this.load(b.id);
    } catch (err) {
      console.error(err);
      this.error.set('Could not remove product.');
    } finally {
      this.mutating.set(false);
    }
  }

  async finalize(): Promise<void> {
    const b = this.batch();
    if (!b) return;
    if (!confirm(`Finalize this batch? Products will be locked.`)) return;
    await this.transition(() => this.batchService.finalize(b.id), b.id);
  }

  async ship(): Promise<void> {
    const b = this.batch();
    if (!b) return;
    if (!confirm(`Mark this batch as shipped?`)) return;
    await this.transition(() => this.batchService.ship(b.id), b.id);
  }

  async deliver(): Promise<void> {
    const b = this.batch();
    if (!b) return;
    if (!confirm(`Mark this batch as delivered?`)) return;
    await this.transition(() => this.batchService.deliver(b.id), b.id);
  }

  private async transition(action: () => Promise<void>, id: string): Promise<void> {
    this.mutating.set(true);
    try {
      await action();
      await this.load(id);
    } catch (err) {
      console.error(err);
      this.error.set('Status update failed.');
    } finally {
      this.mutating.set(false);
    }
  }
}
