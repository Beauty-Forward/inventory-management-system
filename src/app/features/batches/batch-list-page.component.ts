import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BatchListRow,
  BatchService,
} from '../../core/services/batch.service';

type StatusFilter = 'all' | 'DRAFT' | 'FINALIZED' | 'SHIPPED' | 'DELIVERED';

@Component({
  selector: 'app-batch-list-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './batch-list-page.component.html',
  styleUrl: './batch-list-page.component.scss',
})
export class BatchListPageComponent implements OnInit {
  private readonly batchService = inject(BatchService);

  readonly batches = signal<BatchListRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly statusFilter = signal<StatusFilter>('all');

  readonly filtered = computed(() => {
    const s = this.statusFilter();
    if (s === 'all') return this.batches();
    return this.batches().filter((b) => b.status === s);
  });

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.batchService.listAll();
      this.batches.set(rows);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load batches.');
    } finally {
      this.loading.set(false);
    }
  }

  setFilter(f: StatusFilter): void {
    this.statusFilter.set(f);
  }

  statusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
