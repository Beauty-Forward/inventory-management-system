import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import { ShelterService, ShelterDetail } from '../../core/services/shelter.service';
import { CrumbComponent, CrumbItem } from '../../shared/components/crumb/crumb.component';
import {
  StatusPillComponent,
  StatusPillVariant,
} from '../../shared/components/status-pill/status-pill.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

@Component({
  selector: 'app-shelter-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, CrumbComponent, StatusPillComponent],
  templateUrl: './shelter-detail-page.component.html',
  styleUrl: './shelter-detail-page.component.scss',
})
export class ShelterDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shelterService = inject(ShelterService);

  readonly shelter = signal<ShelterDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mutating = signal(false);

  readonly acceptedLabels = computed(() => {
    const accepted = this.shelter()?.acceptedTypes ?? [];
    return accepted.map((v) => this.labelFor(v)).filter(Boolean);
  });

  readonly rejectedLabels = computed(() => {
    const rejected = this.shelter()?.rejectedTypes ?? [];
    return rejected.map((v) => this.labelFor(v)).filter(Boolean);
  });

  readonly swatch = computed<SwatchVariant>(() => {
    const s = this.shelter();
    if (!s) return 'rose';
    const cycle: SwatchVariant[] = ['rose', 'eucalyptus', 'dust', 'butter', 'apricot', 'hunter'];
    const hash = s.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  });

  readonly invertedSwatch = computed(
    () => this.swatch() === 'hunter' || this.swatch() === 'apricot',
  );

  // A shelter can only be hard-deleted when no batches reference it.
  // Otherwise the FK constraint would block it — deactivate instead.
  readonly canDelete = computed(
    () => (this.shelter()?.batches?.length ?? 0) === 0,
  );

  readonly initials = computed(() => {
    const s = this.shelter();
    if (!s) return '';
    return s.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  });

  readonly crumbs = computed<CrumbItem[]>(() => {
    const s = this.shelter();
    return [
      { label: 'shelters', link: '/shelters' },
      { label: s?.name ?? '...' },
    ];
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Shelter ID missing');
      this.loading.set(false);
      return;
    }
    await this.load(id);
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const shelter = await this.shelterService.get(id);
      if (!shelter) {
        this.error.set('Shelter not found');
      } else {
        this.shelter.set(shelter);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Could not load shelter.');
    } finally {
      this.loading.set(false);
    }
  }

  private labelFor(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  async toggleActive(): Promise<void> {
    const s = this.shelter();
    if (!s) return;
    this.mutating.set(true);
    try {
      if (s.isActive) {
        await this.shelterService.deactivate(s.id);
      } else {
        await this.shelterService.reactivate(s.id);
      }
      await this.load(s.id);
    } catch (err) {
      console.error(err);
      this.error.set('Update failed.');
    } finally {
      this.mutating.set(false);
    }
  }

  async deleteShelter(): Promise<void> {
    const s = this.shelter();
    if (!s || !this.canDelete()) return;
    if (
      !confirm(
        `Permanently delete "${s.name}"? This can't be undone. (Use deactivate to keep the record but hide it.)`,
      )
    ) {
      return;
    }
    this.mutating.set(true);
    try {
      await this.shelterService.delete(s.id);
      await this.router.navigate(['/shelters']);
    } catch (err) {
      console.error(err);
      this.error.set('Could not delete shelter.');
      this.mutating.set(false);
    }
  }

  batchVariant(status: string): StatusPillVariant {
    const s = status.toUpperCase();
    if (s === 'DRAFT') return 'draft';
    if (s === 'FINALIZED') return 'route';
    if (s === 'SHIPPED') return 'shipped';
    if (s === 'DELIVERED') return 'delivered';
    return 'soft';
  }
}
