import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BatchListRow,
  BatchService,
} from '../../core/services/batch.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatTileComponent } from '../../shared/components/stat-tile/stat-tile.component';
import {
  PillFilter,
  PillToolbarComponent,
} from '../../shared/components/pill-toolbar/pill-toolbar.component';
import {
  StatusPillComponent,
  StatusPillVariant,
} from '../../shared/components/status-pill/status-pill.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';
import { sessionPersistedSignal } from '../../shared/utils/session-persisted-signal';

const STATUS_FILTER_KEYS = ['all', 'DRAFT', 'FINALIZED', 'SHIPPED', 'DELIVERED'];

@Component({
  selector: 'app-batch-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    PageHeaderComponent,
    StatTileComponent,
    PillToolbarComponent,
    StatusPillComponent,
  ],
  templateUrl: './batch-list-page.component.html',
  styleUrl: './batch-list-page.component.scss',
})
export class BatchListPageComponent implements OnInit {
  private readonly batchService = inject(BatchService);
  private readonly router = inject(Router);

  readonly batches = signal<BatchListRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchQuery = signal('');
  // Persists the active status filter per browser session; a refresh keeps
  // the filter, a new session falls back to 'all'.
  readonly statusFilter = sessionPersistedSignal<string>(
    'batches.statusFilter',
    'all',
    STATUS_FILTER_KEYS,
  );

  readonly filters: PillFilter[] = [
    { key: 'all', label: 'all' },
    { key: 'DRAFT', label: 'draft' },
    { key: 'FINALIZED', label: 'finalized' },
    { key: 'SHIPPED', label: 'shipped' },
    { key: 'DELIVERED', label: 'delivered' },
  ];

  readonly filtered = computed(() => {
    const s = this.statusFilter();
    const q = this.searchQuery().toLowerCase().trim();
    return this.batches().filter((b) => {
      if (s !== 'all' && b.status !== s) return false;
      if (q) {
        const hay = `${b.shelter.name} ${b.shelter.city}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  });

  readonly draftCount = computed(() => this.batches().filter((b) => b.status === 'DRAFT').length);
  readonly enrouteCount = computed(
    () => this.batches().filter((b) => b.status === 'FINALIZED' || b.status === 'SHIPPED').length,
  );
  readonly deliveredCount = computed(
    () => this.batches().filter((b) => b.status === 'DELIVERED').length,
  );

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

  variant(b: BatchListRow): StatusPillVariant {
    if (b.status === 'DRAFT') return 'draft';
    if (b.status === 'FINALIZED') return 'route';
    if (b.status === 'SHIPPED') return 'shipped';
    if (b.status === 'DELIVERED') return 'delivered';
    return 'soft';
  }

  shelterSwatch(b: BatchListRow): SwatchVariant {
    const cycle: SwatchVariant[] = ['eucalyptus', 'butter', 'rose', 'dust', 'apricot', 'cobalt'];
    const hash = b.shelter.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  }

  startNew(): void {
    this.router.navigate(['/batches/new']);
  }
}
