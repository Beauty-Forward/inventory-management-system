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
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatTileComponent } from '../../shared/components/stat-tile/stat-tile.component';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';

type Greeting = 'good morning' | 'good afternoon' | 'good evening';
type SwatchKey = 'rose' | 'butter' | 'dust' | 'eucalyptus' | 'apricot' | 'cobalt';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    PageHeaderComponent,
    StatTileComponent,
    StatusPillComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly donationService = inject(DonationService);
  private readonly batchService = inject(BatchService);
  private readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly inStockCount = signal(0);
  readonly receivedThisWeek = signal(0);
  readonly shippedThisWeek = signal(0);
  readonly expiringSoonCount = signal(0);

  readonly recentDonations = signal<DonationListRow[]>([]);
  readonly pendingBatches = signal<BatchListRow[]>([]);

  readonly today = new Date();

  readonly weekNumber = computed(() => {
    const start = new Date(this.today.getFullYear(), 0, 1);
    const diff = (this.today.getTime() - start.getTime()) / 86400000;
    return Math.ceil((diff + start.getDay() + 1) / 7);
  });

  readonly season = computed(() => {
    const m = this.today.getMonth();
    if (m <= 1 || m === 11) return 'winter';
    if (m <= 4) return 'spring';
    if (m <= 7) return 'summer';
    return 'autumn';
  });

  readonly greeting = computed<Greeting>(() => {
    const h = this.today.getHours();
    if (h < 12) return 'good morning';
    if (h < 18) return 'good afternoon';
    return 'good evening';
  });

  readonly firstName = computed(() => {
    const u = this.auth.user();
    if (!u) return '';
    if (u.displayName) return u.displayName.split(' ')[0].toLowerCase();
    if (u.email) return u.email.split('@')[0].toLowerCase();
    return '';
  });

  readonly title = computed(() => {
    const name = this.firstName();
    return name ? `${this.greeting()}, ${name}` : this.greeting();
  });

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
      this.recentDonations.set(recent.slice(0, 4));

      this.receivedThisWeek.set(
        recent.filter((d) => new Date(d.createdAt) >= weekAgo).length,
      );

      this.shippedThisWeek.set(
        batches.filter(
          (b) => b.shippedAt && new Date(b.shippedAt) >= weekAgo,
        ).length,
      );

      this.pendingBatches.set(
        batches
          .filter((b) => b.status === 'DRAFT' || b.status === 'FINALIZED')
          .slice(0, 4),
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

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  }

  donorSwatch(d: DonationListRow): SwatchKey {
    const cycle: SwatchKey[] = ['rose', 'dust', 'butter', 'eucalyptus', 'apricot', 'cobalt'];
    const hash = (d.donor.fullName + d.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  }

  shelterSwatch(b: BatchListRow): SwatchKey {
    const cycle: SwatchKey[] = ['eucalyptus', 'butter', 'rose', 'dust', 'apricot', 'cobalt'];
    const hash = b.shelter.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  }

  donationVariant(d: DonationListRow): 'walk' | 'intake' | 'ready' {
    if (d.method === 'walk-in') return 'walk';
    return 'intake';
  }

  batchVariant(b: BatchListRow): 'route' | 'draft' {
    return b.status === 'FINALIZED' ? 'route' : 'draft';
  }

  batchLabel(b: BatchListRow): string {
    return b.status === 'FINALIZED' ? 'routed' : 'draft';
  }

  donationMeta(d: DonationListRow): string {
    const time = new Date(d.createdAt).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${d.method} · ${time.toLowerCase()}`;
  }
}
