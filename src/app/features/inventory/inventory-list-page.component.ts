import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES, PRODUCT_TYPE_CATEGORIES } from '../../core/models/product-types';
import {
  InventoryRow,
  ProductService,
} from '../../core/services/product.service';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './inventory-list-page.component.html',
  styleUrl: './inventory-list-page.component.scss',
})
export class InventoryListPageComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly categories = PRODUCT_TYPE_CATEGORIES;
  readonly products = signal<InventoryRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchQuery = signal('');
  readonly typeFilter = signal<string | null>(null);
  readonly brandFilter = signal('');
  readonly expiringOnly = signal(false);

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.typeFilter();
    const brand = this.brandFilter().toLowerCase().trim();
    const expOnly = this.expiringOnly();
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);

    return this.products().filter((p) => {
      if (type && p.type !== type) return false;
      if (brand && !p.brand.toLowerCase().includes(brand)) return false;
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.type}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (expOnly) {
        if (!p.expirationDate) return false;
        const exp = new Date(p.expirationDate);
        if (exp > thirtyDays) return false;
      }
      return true;
    });
  });

  readonly totalCount = computed(() => this.products().length);
  readonly filteredCount = computed(() => this.filtered().length);
  readonly expiringCount = computed(() => {
    const now = new Date();
    const thirty = new Date(now.getTime() + 30 * 86400000);
    return this.products().filter((p) => {
      if (!p.expirationDate) return false;
      return new Date(p.expirationDate) <= thirty;
    }).length;
  });

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

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.typeFilter.set(null);
    this.brandFilter.set('');
    this.expiringOnly.set(false);
  }
}
