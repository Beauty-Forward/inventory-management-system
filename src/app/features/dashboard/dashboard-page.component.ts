import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BatchListRow,
  BatchService,
} from '../../core/services/batch.service';
import {
  DonationListRow,
  DonationService,
} from '../../core/services/donation.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly donationService = inject(DonationService);
  private readonly batchService = inject(BatchService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly inStockCount = signal(0);
  readonly receivedThisWeek = signal(0);
  readonly shippedThisWeek = signal(0);
  readonly expiringSoonCount = signal(0);

  readonly recentDonations = signal<DonationListRow[]>([]);
  readonly pendingBatches = signal<BatchListRow[]>([]);

  readonly hasData = computed(
    () => this.inStockCount() > 0 || this.recentDonations().length > 0,
  );

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const [inventory, expiring, recent, batches] = await Promise.all([
        this.productService.listInStock({ limit: 500 }),
        this.productService.listExpiringSoon(30),
        this.donationService.listRecent(5),
        this.batchService.listAll(),
      ]);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      this.inStockCount.set(inventory.length);
      this.expiringSoonCount.set(expiring.length);
      this.recentDonations.set(recent);

      this.receivedThisWeek.set(
        recent.filter((d) => new Date(d.createdAt) >= weekAgo).length,
      );

      this.shippedThisWeek.set(
        batches.filter(
          (b) => b.shippedAt && new Date(b.shippedAt) >= weekAgo,
        ).length,
      );

      this.pendingBatches.set(
        batches.filter((b) => b.status === 'DRAFT' || b.status === 'FINALIZED'),
      );
    } catch (err) {
      console.error(err);
      this.error.set(
        'Could not load dashboard data. Confirm Data Connect is deployed.',
      );
    } finally {
      this.loading.set(false);
    }
  }

  statusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
