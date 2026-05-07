import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  DonationListRow,
  DonationService,
} from '../../core/services/donation.service';
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

type SwatchKey = 'rose' | 'butter' | 'dust' | 'eucalyptus' | 'apricot' | 'cobalt';

interface DayBucket {
  key: string;
  label: string;
  donations: DonationListRow[];
}

@Component({
  selector: 'app-donation-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    PageHeaderComponent,
    StatTileComponent,
    PillToolbarComponent,
    StatusPillComponent,
  ],
  templateUrl: './donation-list-page.component.html',
  styleUrl: './donation-list-page.component.scss',
})
export class DonationListPageComponent implements OnInit {
  private readonly donationService = inject(DonationService);
  private readonly router = inject(Router);

  readonly donations = signal<DonationListRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchQuery = signal('');
  readonly activeFilter = signal('all');

  readonly filters: PillFilter[] = [
    { key: 'all', label: 'all' },
    { key: 'scheduled', label: 'scheduled' },
    { key: 'walk-in', label: 'walk-in' },
    { key: 'shipping', label: 'shipping' },
  ];

  readonly thisWeekCount = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.donations().filter((d) => new Date(d.createdAt) >= weekAgo).length;
  });

  readonly newDonorCount = computed(() => {
    const seen = new Set<string>();
    let count = 0;
    const sorted = [...this.donations()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    for (const d of sorted) {
      if (!seen.has(d.donor.id)) {
        seen.add(d.donor.id);
        if (new Date(d.createdAt) >= weekAgo) count++;
      }
    }
    return count;
  });

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const f = this.activeFilter();
    return this.donations().filter((d) => {
      if (f !== 'all' && d.method !== f) return false;
      if (q) {
        const hay = `${d.donor.fullName} ${d.donor.email} ${d.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  });

  readonly buckets = computed<DayBucket[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 86400000);

    const groups = new Map<string, DonationListRow[]>();
    for (const d of this.filtered()) {
      const day = new Date(d.createdAt);
      day.setHours(0, 0, 0, 0);
      const key = day.toISOString();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(d);
    }

    const result: DayBucket[] = [];
    const sortedKeys = [...groups.keys()].sort((a, b) => b.localeCompare(a));
    for (const key of sortedKeys) {
      const day = new Date(key);
      let label: string;
      if (day.getTime() === today.getTime()) {
        label = `today · ${day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).toLowerCase()}`;
      } else if (day.getTime() === yesterday.getTime()) {
        label = `yesterday · ${day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).toLowerCase()}`;
      } else {
        label = day
          .toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
          .toLowerCase();
      }
      result.push({ key, label, donations: groups.get(key)! });
    }
    return result;
  });

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.donationService.listRecent(50);
      this.donations.set(rows);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load donations.');
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

  swatch(d: DonationListRow): SwatchKey {
    const cycle: SwatchKey[] = ['rose', 'dust', 'butter', 'eucalyptus', 'apricot', 'cobalt'];
    const hash = (d.donor.fullName + d.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  }

  variant(d: DonationListRow): StatusPillVariant {
    if (d.method === 'walk-in') return 'walk';
    if (d.method === 'pickup') return 'route';
    return 'intake';
  }

  shortRef(d: DonationListRow): string {
    const date = new Date(d.createdAt);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `BFW-${yyyy}${mm}${dd}-${d.id.slice(0, 6).toUpperCase()}`;
  }

  meta(d: DonationListRow): string {
    const time = new Date(d.createdAt).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${d.method} · ${time.toLowerCase()}`;
  }

  startNew(): void {
    this.router.navigate(['/donations/new']);
  }
}
