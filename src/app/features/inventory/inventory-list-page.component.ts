import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ALL_PRODUCT_TYPES, PRODUCT_TYPE_CATEGORIES } from '../../core/models/product-types';
import {
  InventoryRow,
  ProductService,
} from '../../core/services/product.service';
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
import { SwatchCardComponent, SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

type CategoryKey =
  | 'all'
  | 'hair'
  | 'skin'
  | 'makeup'
  | 'hygiene'
  | 'nail'
  | 'fragrance'
  | 'expiring';

const CATEGORY_TYPES: Record<Exclude<CategoryKey, 'all' | 'expiring'>, string[]> = {
  hair: ['shampoo', 'conditioner', 'hair_oil', 'hair_mask', 'styling_product'],
  skin: ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner'],
  makeup: ['lipstick', 'lip_gloss', 'foundation', 'concealer', 'eyeshadow', 'mascara', 'blush', 'bronzer'],
  hygiene: ['soap', 'body_wash', 'deodorant', 'toothpaste', 'toothbrush', 'feminine_products'],
  nail: ['nail_polish', 'nail_polish_remover', 'nail_tools'],
  fragrance: ['perfume', 'body_spray', 'body_lotion'],
};

const SWATCH_BY_CATEGORY: Record<Exclude<CategoryKey, 'all' | 'expiring'>, SwatchVariant> = {
  skin: 'rose',
  hair: 'butter',
  makeup: 'crimson',
  hygiene: 'eucalyptus',
  nail: 'apricot',
  fragrance: 'dust',
};

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [
    DatePipe,
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
  readonly activeCategory = signal<CategoryKey>('all');

  readonly filters: PillFilter[] = [
    { key: 'all', label: 'all' },
    { key: 'skin', label: 'skincare' },
    { key: 'hair', label: 'hair' },
    { key: 'makeup', label: 'color' },
    { key: 'hygiene', label: 'hygiene' },
    { key: 'fragrance', label: 'fragrance' },
    { key: 'expiring', label: 'expiring', variant: 'warn' },
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

  readonly readyProducts = computed(() =>
    this.filtered().filter((p) => !this.isExpiring(p)),
  );

  readonly flaggedProducts = computed(() =>
    this.filtered().filter((p) => this.isExpiring(p)),
  );

  readonly totalCount = computed(() => this.products().length);
  readonly expiringCount = computed(
    () => this.products().filter((p) => this.isExpiring(p)).length,
  );

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.productService.listInStock({ limit: 500 });
      this.products.set(rows);
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

  unitLabel(p: InventoryRow): string {
    return p.quantity === 1 ? 'unit' : 'units';
  }

  shortLot(id: string): string {
    return id.slice(0, 4).toUpperCase();
  }
}
