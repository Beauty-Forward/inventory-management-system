import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DonationListRow,
  DonationService,
} from '../../core/services/donation.service';

@Component({
  selector: 'app-donation-list-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './donation-list-page.component.html',
  styleUrl: './donation-list-page.component.scss',
})
export class DonationListPageComponent implements OnInit {
  private readonly donationService = inject(DonationService);

  readonly donations = signal<DonationListRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

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
}
