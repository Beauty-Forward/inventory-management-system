import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  ProductDetail,
  ProductService,
} from '../../core/services/product.service';

@Component({
  selector: 'app-inventory-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
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

  statusClass(status: string): string {
    return `badge-${status.toLowerCase().replace('_', '-')}`;
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

  detailsKeys(details: unknown): string[] {
    if (!details || typeof details !== 'object') return [];
    return Object.keys(details).filter((k) => (details as Record<string, unknown>)[k]);
  }

  detailValue(details: unknown, key: string): string {
    if (!details || typeof details !== 'object') return '';
    const v = (details as Record<string, unknown>)[key];
    return typeof v === 'string' ? v : '';
  }

  detailLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
  }
}
