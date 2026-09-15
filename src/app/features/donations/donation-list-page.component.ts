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
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import { sessionPersistedSignal } from '../../shared/utils/session-persisted-signal';
import {
  DonationBucket,
  LifecycleView,
  bucketOf,
  deriveLifecycle,
} from '../../core/models/donation-lifecycle';

type SwatchKey = 'rose' | 'butter' | 'dust' | 'eucalyptus' | 'apricot' | 'cobalt';

// Buckets trace the donation's trip to the warehouse and its catalogue state:
//   incoming  — inbound from the delivery app (awaiting pickup / on the way)
//   arrived   — physically here, no products catalogued yet (needs processing)
//   processed — catalogued into inventory; stays visible, doesn't disappear
const DONATION_FILTERS = ['incoming', 'arrived', 'processed', 'all'] as const;
type DonationFilter = (typeof DONATION_FILTERS)[number];

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
  // Persists the active tab per browser session; a refresh keeps the tab,
  // a new session falls back to 'arrived'.
  readonly activeFilter = sessionPersistedSignal<DonationFilter>(
    'donations.activeFilter',
    'arrived',
    DONATION_FILTERS,
  );

  // Live counts per bucket are rendered as chip badges so the manager can see
  // the whole pipeline at a glance without switching tabs.
  readonly filters = computed<PillFilter[]>(() => {
    const counts = this.bucketCounts();
    return [
      { key: 'incoming', label: 'incoming', count: counts.incoming },
      { key: 'arrived', label: 'arrived', count: counts.arrived },
      { key: 'processed', label: 'processed', count: counts.processed },
      { key: 'all', label: 'all' },
    ];
  });

  // deriveLifecycle is the single source of truth for where a donation sits;
  // it's memoized per row so the list, buckets, counts, and pills all agree.
  private readonly lifecycleCache = new WeakMap<DonationListRow, LifecycleView>();
  lifecycle(d: DonationListRow): LifecycleView {
    let view = this.lifecycleCache.get(d);
    if (!view) {
      view = deriveLifecycle(d);
      this.lifecycleCache.set(d, view);
    }
    return view;
  }

  bucket(d: DonationListRow): DonationBucket {
    return bucketOf(this.lifecycle(d).phase);
  }

  // "incoming" rows can be nudged in with "mark arrived"; "arrived" rows get
  // the "process" CTA. Processed rows just show their lifecycle pill.
  isIncoming(d: DonationListRow): boolean {
    return this.bucket(d) === 'incoming';
  }
  isArrived(d: DonationListRow): boolean {
    return this.bucket(d) === 'arrived';
  }

  readonly bucketCounts = computed(() => {
    const counts = { incoming: 0, arrived: 0, processed: 0 };
    for (const d of this.donations()) counts[this.bucket(d)]++;
    return counts;
  });

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
      if (f !== 'all' && this.bucket(d) !== f) return false;
      if (q) {
        const hay = `${d.donor.fullName} ${d.donor.email} ${d.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  });

  // Click handler on the Process button shown on Arrived rows — drops
  // the manager into the products step of intake with the donation
  // pre-loaded.
  processArrived(donationId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/donations/new'], {
      queryParams: { donationId },
    });
  }

  // Tracks which donation rows are mid-flight on a "Mark arrived" click so the
  // button can disable itself and we don't double-submit.
  readonly marking = signal<ReadonlySet<string>>(new Set());

  // Click handler on the "Mark arrived" button shown on Coming rows. Flips
  // the donation to 'arrived' so it moves into the Arrived bucket, then
  // reloads. Used for shipping/drop-off donations that never auto-complete.
  async markArrived(donationId: string, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.marking().has(donationId)) return;
    this.marking.update((s) => new Set(s).add(donationId));
    try {
      await this.donationService.markArrived(donationId);
      await this.load();
    } catch (err) {
      console.error(err);
      this.error.set('Could not mark the donation as arrived.');
    } finally {
      this.marking.update((s) => {
        const next = new Set(s);
        next.delete(donationId);
        return next;
      });
    }
  }

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

  // Newest-first pagination. Incoming/arrived cluster at the top (they're the
  // most recent), so they land on the first page; processed history is reached
  // by loading further pages rather than a hard 50-row cap that silently
  // dropped older donations. Bucket counts reflect what's loaded so far.
  private static readonly PAGE_SIZE = 25;
  readonly loadingMore = signal(false);
  readonly hasMore = signal(false);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.donationService.listRecent(
        DonationListPageComponent.PAGE_SIZE,
      );
      this.donations.set(rows);
      this.hasMore.set(rows.length === DonationListPageComponent.PAGE_SIZE);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load donations.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    if (this.loadingMore() || !this.hasMore()) return;
    this.loadingMore.set(true);
    this.error.set(null);
    try {
      const size = DonationListPageComponent.PAGE_SIZE;
      const next = await this.donationService.listRecent(size, this.donations().length);
      // De-dupe by id in case a new donation shifted the window between pages.
      const seen = new Set(this.donations().map((d) => d.id));
      const fresh = next.filter((d) => !seen.has(d.id));
      this.donations.update((rows) => [...rows, ...fresh]);
      this.hasMore.set(next.length === size);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load more donations.');
    } finally {
      this.loadingMore.set(false);
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

  shortRef(d: DonationListRow): string {
    const date = new Date(d.createdAt);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `BFW-${yyyy}${mm}${dd}-${d.id.slice(0, 6).toUpperCase()}`;
  }

  meta(d: DonationListRow): string {
    const time = new Date(d.createdAt)
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      .toLowerCase();
    return `${d.method} · ${this.dateLabel(d.date)} · ${time}`;
  }

  // 'sep 15' from a 'YYYY-MM-DD' date string. Parsed as local (not via
  // new Date(str), which treats date-only strings as UTC and can shift the
  // month/day back a day in western timezones).
  private dateLabel(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, (m ?? 1) - 1, d ?? 1);
    const month = date.toLocaleDateString([], { month: 'short' }).toLowerCase();
    return `${month} ${date.getDate()}`;
  }

  startNew(): void {
    this.router.navigate(['/donations/new']);
  }
}
