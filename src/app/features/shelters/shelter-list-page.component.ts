import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShelterService, ShelterListRow } from '../../core/services/shelter.service';

type ActiveFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-shelter-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shelter-list-page.component.html',
  styleUrl: './shelter-list-page.component.scss',
})
export class ShelterListPageComponent implements OnInit {
  private readonly shelterService = inject(ShelterService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly shelters = signal<ShelterListRow[]>([]);
  readonly filter = signal<ActiveFilter>('active');

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
}
