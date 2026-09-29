import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES, PRODUCT_TYPE_CATEGORIES } from '../../core/models/product-types';
import { InventoryRow, ProductService } from '../../core/services/product.service';
import {
  AddToBatchDialogComponent,
  AddToBatchResult,
} from '../../shared/components/add-to-batch-dialog/add-to-batch-dialog.component';
import { SelectionBarComponent } from '../../shared/components/selection-bar/selection-bar.component';
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
import {
  SwatchCardComponent,
  SwatchVariant,
} from '../../shared/components/swatch-card/swatch-card.component';
import { sessionPersistedSignal } from '../../shared/utils/session-persisted-signal';

type CategoryKey =
  | 'all'
  | 'hair'
  | 'skin'
  | 'makeup'
  | 'hygiene'
  | 'nail'
  | 'fragrance'
  | 'other'
  | 'expiring';

// Selectable category pills (a subset of CategoryKey) used to validate a
// persisted value read back from sessionStorage.
const CATEGORY_FILTER_KEYS: readonly CategoryKey[] = [
  'all',
  'skin',
  'hair',
  'makeup',
  'hygiene',
  'fragrance',
  'other',
  'expiring',
];

const CATEGORY_TYPES: Record<Exclude<CategoryKey, 'all' | 'expiring'>, string[]> = {
  hair: ['shampoo', 'conditioner', 'hair_oil', 'hair_mask', 'styling_product'],
  skin: ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner', 'balm'],
  makeup: [
    'lipstick',
    'lip_gloss',
    'foundation',
    'concealer',
    'eyeshadow',
    'mascara',
    'blush',
    'bronzer',
  ],
  hygiene: [
    'soap',
    'body_wash',
    'lotion',
    'deodorant',
    'toothpaste',
    'toothbrush',
    'feminine_products',
  ],
  nail: ['nail_polish', 'nail_polish_remover', 'nail_tools'],
  fragrance: ['perfume', 'body_spray'],
  other: ['other'],
};

const SWATCH_BY_CATEGORY: Record<Exclude<CategoryKey, 'all' | 'expiring'>, SwatchVariant> = {
  skin: 'rose',
  hair: 'butter',
  makeup: 'crimson',
  hygiene: 'eucalyptus',
  nail: 'apricot',
  fragrance: 'dust',
  other: 'cobalt',
};

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    AddToBatchDialogComponent,
    SelectionBarComponent,
    PageHeaderComponent,
    StatTileComponent,
    PillToolbarComponent,
    StatusPillComponent,
    SwatchCardComponent,
  ],
  templateUrl: './inventory-list-page.component.html',
  styleUrl: './inventory-list-page.component.scss',
})
export class InventoryListPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly categories = PRODUCT_TYPE_CATEGORIES;
  readonly products = signal<InventoryRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchQuery = signal('');
  // Persists the active category per browser session; a refresh keeps the
  // category, a new session falls back to 'all'.
  readonly activeCategory = sessionPersistedSignal<CategoryKey>(
    'inventory.activeCategory',
    'all',
    CATEGORY_FILTER_KEYS,
  );

  readonly filters: PillFilter[] = [
    { key: 'all', label: 'all' },
    { key: 'skin', label: 'skincare' },
    { key: 'hair', label: 'hair' },
    { key: 'makeup', label: 'makeup' },
    { key: 'hygiene', label: 'hygiene' },
    { key: 'fragrance', label: 'fragrance' },
    { key: 'other', label: 'other' },
  ];

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategory();
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);

    return this.products().filter((p) => {
      if (cat === 'expiring') {
        if (!p.expirationDate) return false;
        if (new Date(p.expirationDate) > thirtyDays) return false;
      } else if (cat !== 'all') {
        const types = CATEGORY_TYPES[cat];
        if (!types.includes(p.type)) return false;
      }
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  });

  readonly readyProducts = computed(() => this.filtered().filter((p) => !this.isExpiring(p)));

  readonly flaggedProducts = computed(() => this.filtered().filter((p) => this.isExpiring(p)));

  // --- Selection mode (bulk "add to batch…") ---
  readonly selecting = signal(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly pickingBatch = signal(false);
  readonly addResult = signal<{ text: string; batchId: string } | null>(null);
  // Anchor for shift-click range selection.
  private anchorId: string | null = null;

  // Cards in the order they're drawn (ready first, then flagged), which is
  // the order a shift-click range follows.
  readonly displayed = computed(() => [...this.readyProducts(), ...this.flaggedProducts()]);
  readonly selectedCount = computed(() => this.selectedIds().size);
  readonly selectedProducts = computed(() =>
    this.products().filter((p) => this.selectedIds().has(p.id)),
  );
  readonly allDisplayedSelected = computed(() => {
    const sel = this.selectedIds();
    const shown = this.displayed();
    return shown.length > 0 && shown.every((p) => sel.has(p.id));
  });

  readonly totalCount = computed(() => this.products().length);
  readonly expiringCount = computed(() => this.products().filter((p) => this.isExpiring(p)).length);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.productService.listInStock({ limit: 500 });
      this.products.set(rows);
      // Drop selections for products that have since left stock.
      const live = new Set(rows.map((p) => p.id));
      this.selectedIds.update((set) => new Set([...set].filter((id) => live.has(id))));
    } catch (err) {
      console.error(err);
      this.error.set('Could not load inventory.');
    } finally {
      this.loading.set(false);
    }
  }

  isExpiring(p: InventoryRow): boolean {
    if (!p.expirationDate) return false;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 60);
    return new Date(p.expirationDate) <= cutoff;
  }

  daysUntilExpiry(p: InventoryRow): number | null {
    if (!p.expirationDate) return null;
    const ms = new Date(p.expirationDate).getTime() - Date.now();
    return Math.max(0, Math.round(ms / 86400000));
  }

  category(p: InventoryRow): Exclude<CategoryKey, 'all' | 'expiring'> {
    for (const [k, types] of Object.entries(CATEGORY_TYPES)) {
      if (types.includes(p.type)) return k as Exclude<CategoryKey, 'all' | 'expiring'>;
    }
    return 'skin';
  }

  swatch(p: InventoryRow): SwatchVariant {
    return SWATCH_BY_CATEGORY[this.category(p)];
  }

  categoryLabel(p: InventoryRow): string {
    return this.category(p);
  }

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  cardStatus(p: InventoryRow): StatusPillVariant {
    if (this.isExpiring(p)) return 'expiring-strong';
    if (p.status === 'IN_STOCK') return 'ready-strong';
    if (p.status === 'ALLOCATED') return 'route';
    return 'soft';
  }

  cardStatusLabel(p: InventoryRow): string {
    if (this.isExpiring(p)) {
      const days = this.daysUntilExpiry(p);
      return days !== null && days < 60 ? `< ${days || '—'} days` : 'expiring';
    }
    if (p.status === 'IN_STOCK') return 'ready';
    if (p.status === 'ALLOCATED') return 'routed';
    return p.status.toLowerCase();
  }

  open(p: InventoryRow): void {
    this.router.navigate(['/inventory', p.id]);
  }

  // Card click: opens the product normally; in selection mode it toggles the
  // card, and shift-click applies the new state to every card in between.
  onCardClick(event: MouseEvent, p: InventoryRow): void {
    if (!this.selecting()) {
      this.open(p);
      return;
    }
    const select = !this.selectedIds().has(p.id);
    const shown = this.displayed();
    const from =
      event.shiftKey && this.anchorId ? shown.findIndex((x) => x.id === this.anchorId) : -1;
    const to = shown.findIndex((x) => x.id === p.id);
    this.selectedIds.update((set) => {
      const next = new Set(set);
      const apply = (id: string) => (select ? next.add(id) : next.delete(id));
      if (from >= 0 && to >= 0) {
        const [lo, hi] = from < to ? [from, to] : [to, from];
        for (let i = lo; i <= hi; i++) apply(shown[i].id);
      } else {
        apply(p.id);
      }
      return next;
    });
    this.anchorId = p.id;
  }

  isSelected(p: InventoryRow): boolean {
    return this.selectedIds().has(p.id);
  }

  startSelecting(): void {
    this.addResult.set(null);
    this.selecting.set(true);
  }

  stopSelecting(): void {
    this.selecting.set(false);
    this.clearSelection();
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
    this.anchorId = null;
  }

  toggleAllDisplayed(): void {
    const deselect = this.allDisplayedSelected();
    const shown = this.displayed();
    this.selectedIds.update((set) => {
      const next = new Set(set);
      for (const p of shown) {
        if (deselect) next.delete(p.id);
        else next.add(p.id);
      }
      return next;
    });
  }

  async onAddedToBatch(result: AddToBatchResult): Promise<void> {
    this.pickingBatch.set(false);
    const s = (n: number) => (n === 1 ? '' : 's');
    let text = `${result.allocated} product${s(result.allocated)} ${
      result.createdBatch ? 'added to a new batch' : 'added to the draft'
    } for ${result.shelterName}.`;
    if (result.skipped > 0) {
      text += ` ${result.skipped} couldn't be added — no longer in stock.`;
    }
    this.addResult.set({ text, batchId: result.batchId });
    this.stopSelecting();
    await this.load();
  }

  unitLabel(p: InventoryRow): string {
    return p.quantity === 1 ? 'unit' : 'units';
  }

  shortLot(id: string): string {
    return id.slice(0, 4).toUpperCase();
  }
}
