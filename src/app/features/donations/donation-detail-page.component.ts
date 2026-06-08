import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  DonationDetail,
  DonationService,
} from '../../core/services/donation.service';
import { CrumbComponent, CrumbItem } from '../../shared/components/crumb/crumb.component';
import {
  StatusPillComponent,
  StatusPillVariant,
} from '../../shared/components/status-pill/status-pill.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

@Component({
  selector: 'app-donation-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, CrumbComponent, StatusPillComponent],
  templateUrl: './donation-detail-page.component.html',
  styleUrl: './donation-detail-page.component.scss',
})
export class DonationDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly donationService = inject(DonationService);

  readonly donation = signal<DonationDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mutating = signal(false);

  readonly productCount = computed(
    () => this.donation()?.products.length ?? 0,
  );

  readonly totalUnits = computed(() =>
    (this.donation()?.products ?? []).reduce((acc, p) => acc + (p.quantity ?? 0), 0),
  );

  readonly methodVariant = computed<StatusPillVariant>(() => {
    const d = this.donation();
    if (!d) return 'soft';
    if (d.method === 'walk-in') return 'walk';
    if (d.method === 'pickup') return 'route';
    return 'intake';
  });

  readonly swatch = computed<SwatchVariant>(() => {
    const d = this.donation();
    if (!d) return 'rose';
    const cycle: SwatchVariant[] = ['rose', 'dust', 'butter', 'eucalyptus', 'apricot', 'cobalt'];
    const hash = (d.donor.fullName + d.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  });

  readonly initials = computed(() => {
    const d = this.donation();
    if (!d) return '';
    return d.donor.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  });

  readonly crumbs = computed<CrumbItem[]>(() => {
    const d = this.donation();
    return [
      { label: 'donations', link: '/donations' },
      { label: d?.donor.fullName ?? '...' },
    ];
  });

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Donation ID missing');
      this.loading.set(false);
      return;
    }
    try {
      const donation = await this.donationService.get(id);
      if (!donation) {
        this.error.set('Donation not found');
      } else {
        this.donation.set(donation);
      }
    } catch (err) {
      console.error(err);
      this.error.set('Could not load donation.');
    } finally {
      this.loading.set(false);
    }
  }

  typeLabel(value: string): string {
    return ALL_PRODUCT_TYPES.find((t) => t.value === value)?.label ?? value;
  }

  async deleteDonation(): Promise<void> {
    const d = this.donation();
    if (!d) return;
    const count = this.productCount();
    const note =
      count > 0
        ? ` Its ${count} product${count === 1 ? '' : 's'} will also be deleted.`
        : '';
    if (
      !confirm(
        `Permanently delete this donation from ${d.donor.fullName}?${note} This can't be undone.`,
      )
    ) {
      return;
    }
    this.mutating.set(true);
    try {
      await this.donationService.delete(d.id, d.donor.id);
      await this.router.navigate(['/donations']);
    } catch (err) {
      console.error(err);
      this.error.set('Could not delete donation.');
      this.mutating.set(false);
    }
  }

  productVariant(status: string): StatusPillVariant {
    const s = status.toUpperCase();
    if (s === 'IN_STOCK') return 'ready';
    if (s === 'ALLOCATED') return 'route';
    if (s === 'EXPIRED') return 'expiring-strong';
    if (s === 'SHIPPED') return 'shipped';
    if (s === 'DELIVERED') return 'delivered';
    return 'soft';
  }
}
