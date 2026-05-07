import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  ProductDetail,
  ProductService,
} from '../../core/services/product.service';
import { CrumbComponent, CrumbItem } from '../../shared/components/crumb/crumb.component';
import {
  StatusPillComponent,
  StatusPillVariant,
} from '../../shared/components/status-pill/status-pill.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

const CATEGORY_TYPES: Record<string, string[]> = {
  hair: ['shampoo', 'conditioner', 'hair_oil', 'hair_mask', 'styling_product'],
  skin: ['moisturizer', 'cleanser', 'serum', 'sunscreen', 'toner'],
  makeup: ['lipstick', 'lip_gloss', 'foundation', 'concealer', 'eyeshadow', 'mascara', 'blush', 'bronzer'],
  hygiene: ['soap', 'body_wash', 'deodorant', 'toothpaste', 'toothbrush', 'feminine_products'],
  nail: ['nail_polish', 'nail_polish_remover', 'nail_tools'],
  fragrance: ['perfume', 'body_spray', 'body_lotion'],
};

const SWATCH_BY_CATEGORY: Record<string, SwatchVariant> = {
  skin: 'rose',
  hair: 'butter',
  makeup: 'crimson',
  hygiene: 'eucalyptus',
  nail: 'apricot',
  fragrance: 'dust',
};

@Component({
  selector: 'app-inventory-detail-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, CrumbComponent, StatusPillComponent],
  templateUrl: './inventory-detail-page.component.html',
  styleUrl: './inventory-detail-page.component.scss',
})
export class InventoryDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly product = signal<ProductDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mutating = signal(false);

  readonly category = computed(() => {
    const p = this.product();
    if (!p) return 'skin';
    for (const [k, types] of Object.entries(CATEGORY_TYPES)) {
      if (types.includes(p.type)) return k;
    }
    return 'skin';
  });

  readonly swatch = computed<SwatchVariant>(() => SWATCH_BY_CATEGORY[this.category()] ?? 'rose');

  readonly statusVariant = computed<StatusPillVariant>(() => {
    const p = this.product();
    if (!p) return 'soft';
    if (p.status === 'IN_STOCK') return 'ready-strong';
    if (p.status === 'ALLOCATED') return 'route';
    if (p.status === 'EXPIRED') return 'expiring-strong';
    if (p.status === 'SHIPPED') return 'shipped';
    return 'soft';
  });

  readonly statusLabel = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.status.toLowerCase().replace('_', ' ');
  });

  readonly daysOnHand = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return Math.max(0, Math.round((Date.now() - new Date(p.createdAt).getTime()) / 86400000));
  });

  readonly daysToExpiry = computed(() => {
    const p = this.product();
    if (!p?.expirationDate) return null;
    return Math.max(0, Math.round((new Date(p.expirationDate).getTime() - Date.now()) / 86400000));
  });

  readonly retailValue = computed(() => {
    const p = this.product();
    if (!p) return null;
    const price = p.price ? Number(p.price) : null;
    if (!price || isNaN(price)) return null;
    return price * p.quantity;
  });

  readonly crumbs = computed<CrumbItem[]>(() => {
    const p = this.product();
    if (!p) return [{ label: 'inventory', link: '/inventory' }];
    return [
      { label: 'inventory', link: '/inventory' },
      { label: this.category() },
      { label: `lot #${p.id.slice(0, 4).toUpperCase()}` },
    ];
  });

  readonly volumeText = computed(() => {
    const p = this.product();
    if (!p) return '';
    return [p.color, this.typeLabel(p.type)].filter(Boolean).join(' · ');
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Product ID missing');
      this.loading.set(false);
      return;
    }
    await this.load(id);
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const product = await this.productService.get(id);
      if (!product) {
        this.error.set('Product not found');
      } else {
        this.product.set(product);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Could not load product.');
    } finally {
      this.loading.set(false);
    }
  }

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  shortLot(id: string): string {
    return id.slice(0, 4).toUpperCase();
  }

  unitLabel(p: ProductDetail): string {
    return p.quantity === 1 ? 'unit' : 'units';
  }

  async markExpired(): Promise<void> {
    const p = this.product();
    if (!p) return;
    if (!confirm(`Mark "${p.name}" as expired? It will be removed from inventory.`)) {
      return;
    }
    this.mutating.set(true);
    try {
      await this.productService.markExpired(p.id);
      await this.load(p.id);
    } finally {
      this.mutating.set(false);
    }
  }

  async markDiscarded(): Promise<void> {
    const p = this.product();
    if (!p) return;
    if (!confirm(`Mark "${p.name}" as discarded? It will be removed from inventory.`)) {
      return;
    }
    this.mutating.set(true);
    try {
      await this.productService.markDiscarded(p.id);
      await this.load(p.id);
    } finally {
      this.mutating.set(false);
    }
  }

  goToBatch(): void {
    const p = this.product();
    if (p?.batch) this.router.navigate(['/batches', p.batch.id]);
    else this.router.navigate(['/batches/new']);
  }

  goToDonation(): void {
    const p = this.product();
    if (p?.donation) this.router.navigate(['/donations', p.donation.id]);
  }
}
