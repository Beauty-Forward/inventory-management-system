import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import { AuthService } from '../../core/services/auth.service';
import { BatchService } from '../../core/services/batch.service';
import {
  AvailableForShelterRow,
  ProductService,
} from '../../core/services/product.service';
import {
  ShelterListRow,
  ShelterService,
} from '../../core/services/shelter.service';

@Component({
  selector: 'app-batch-form-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './batch-form-page.component.html',
  styleUrl: './batch-form-page.component.scss',
})
export class BatchFormPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly batchService = inject(BatchService);
  private readonly shelterService = inject(ShelterService);
  private readonly productService = inject(ProductService);

  readonly activeShelters = signal<ShelterListRow[]>([]);
  readonly selectedShelter = signal<ShelterListRow | null>(null);
  readonly available = signal<AvailableForShelterRow[]>([]);
  readonly selected = signal<Set<string>>(new Set());
  readonly notes = signal('');

  readonly loading = signal(true);
  readonly loadingProducts = signal(false);
  readonly creating = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedCount = computed(() => this.selected().size);

  readonly typeSummary = computed(() => {
    const selectedIds = this.selected();
    const counts = new Map<string, number>();
    for (const p of this.available()) {
      if (selectedIds.has(p.id)) {
        counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, label: this.typeLabel(type), count }))
      .sort((a, b) => b.count - a.count);
  });

  async ngOnInit(): Promise<void> {
    try {
      const shelters = await this.shelterService.listByActive(true);
      this.activeShelters.set(shelters);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load shelters.');
    } finally {
      this.loading.set(false);
    }
  }

  async selectShelter(shelter: ShelterListRow): Promise<void> {
    this.selectedShelter.set(shelter);
    this.selected.set(new Set());
    this.loadingProducts.set(true);
    try {
      const products = await this.productService.listAvailableForShelter(
        shelter.acceptedTypes ?? [],
      );
      this.available.set(products);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load available inventory.');
    } finally {
      this.loadingProducts.set(false);
    }
  }

  toggleSelected(id: string): void {
    this.selected.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  async createBatch(): Promise<void> {
    const shelter = this.selectedShelter();
    if (!shelter) {
      this.error.set('Select a shelter first.');
      return;
    }
    if (this.selected().size === 0) {
      if (!confirm('Create batch with zero products? You can add products later.')) {
        return;
      }
    }

    this.creating.set(true);
    this.error.set(null);
    try {
      const createdBy = this.authService.user()?.uid ?? 'unauthenticated';
      const batchId = await this.batchService.create(
        shelter.id,
        createdBy,
        this.notes() || undefined,
      );

      for (const productId of this.selected()) {
        await this.batchService.addProduct(productId, batchId);
      }

      await this.router.navigate(['/batches', batchId]);
    } catch (err) {
      console.error(err);
      this.error.set('Could not create batch.');
    } finally {
      this.creating.set(false);
    }
  }

  resetShelter(): void {
    this.selectedShelter.set(null);
    this.available.set([]);
    this.selected.set(new Set());
  }
}
