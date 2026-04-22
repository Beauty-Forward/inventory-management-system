import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ALL_PRODUCT_TYPES } from '../../core/models/product-types';
import { ShelterService, ShelterDetail } from '../../core/services/shelter.service';

@Component({
  selector: 'app-shelter-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
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

  batchStatusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }
}
