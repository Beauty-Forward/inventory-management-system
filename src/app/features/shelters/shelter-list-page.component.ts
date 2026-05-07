import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShelterService, ShelterListRow } from '../../core/services/shelter.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SwatchVariant } from '../../shared/components/swatch-card/swatch-card.component';

type ActiveFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-shelter-list-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  templateUrl: './shelter-list-page.component.html',
  styleUrl: './shelter-list-page.component.scss',
})
export class ShelterListPageComponent implements OnInit {
  private readonly shelterService = inject(ShelterService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly shelters = signal<ShelterListRow[]>([]);
  readonly filter = signal<ActiveFilter>('active');

  readonly activeCount = computed(() => this.shelters().filter((s) => s.isActive).length);
  readonly inactiveCount = computed(() => this.shelters().filter((s) => !s.isActive).length);

  readonly filtered = computed(() => {
    const f = this.filter();
    const all = this.shelters();
    if (f === 'all') return all;
    if (f === 'active') return all.filter((s) => s.isActive);
    return all.filter((s) => !s.isActive);
  });

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const rows = await this.shelterService.listAll();
      this.shelters.set(rows);
    } catch (err) {
      console.error(err);
      this.error.set('Could not load shelters. Check your Data Connect connection.');
    } finally {
      this.loading.set(false);
    }
  }

  setFilter(f: ActiveFilter): void {
    this.filter.set(f);
  }

  startNew(): void {
    this.router.navigate(['/shelters/new']);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('');
  }

  banner(s: ShelterListRow): SwatchVariant {
    const cycle: SwatchVariant[] = [
      'rose',
      'eucalyptus',
      'dust',
      'butter',
      'apricot',
      'hunter',
    ];
    const hash = s.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return cycle[hash % cycle.length];
  }

  invertedBanner(s: ShelterListRow): boolean {
    return this.banner(s) === 'hunter' || this.banner(s) === 'apricot';
  }
}
