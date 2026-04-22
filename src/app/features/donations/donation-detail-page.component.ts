import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import {
  DonationDetail,
  DonationService,
} from '../../core/services/donation.service';

@Component({
  selector: 'app-donation-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './donation-detail-page.component.html',
  styleUrl: './donation-detail-page.component.scss',
})
export class DonationDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly donationService = inject(DonationService);

  readonly donation = signal<DonationDetail | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly productCount = computed(
    () => this.donation()?.products.length ?? 0,
  );

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

  statusClass(status: string): string {
    return `badge-${status.toLowerCase().replace('_', '-')}`;
  }
}
