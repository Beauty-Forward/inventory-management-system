import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  BatchDetail,
  BatchService,
} from '../../core/services/batch.service';
import { CrumbComponent, CrumbItem } from '../../shared/components/crumb/crumb.component';
import {
  StatusPillComponent,
  StatusPillVariant,
} from '../../shared/components/status-pill/status-pill.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

@Component({
  selector: 'app-batch-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, CrumbComponent, StatusPillComponent],
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

  readonly totalUnits = computed(() =>
    (this.batch()?.products ?? []).reduce((acc, p) => acc + (p.quantity ?? 0), 0),
  );

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

  readonly statusVariant = computed<StatusPillVariant>(() => {
    const b = this.batch();
    if (!b) return 'soft';
    if (b.status === 'DRAFT') return 'draft';
    if (b.status === 'FINALIZED') return 'route';
    if (b.status === 'SHIPPED') return 'shipped';
    if (b.status === 'DELIVERED') return 'delivered';
    return 'soft';
  });

  readonly swatch = computed<SwatchVariant>(() => {
    const b = this.batch();
    if (!b) return 'eucalyptus';
    const cycle: SwatchVariant[] = ['eucalyptus', 'butter', 'rose', 'dust', 'apricot', 'cobalt'];
    const hash = b.shelter.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  });

  readonly initials = computed(() => {
    const b = this.batch();
    if (!b) return '';
    return b.shelter.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  });

  readonly crumbs = computed<CrumbItem[]>(() => {
    const b = this.batch();
    if (!b) return [{ label: 'batches', link: '/batches' }];
    return [
      { label: 'batches', link: '/batches' },
      { label: `#${b.id.slice(0, 6).toUpperCase()}` },
    ];
  });

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
