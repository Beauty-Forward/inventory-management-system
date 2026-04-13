import { Component } from '@angular/core';

@Component({
  selector: 'app-donation-list-page',
  standalone: true,
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Donations</h1>
        <button class="btn-primary">Process Donation</button>
      </div>
      <p class="empty-state">No donations processed yet.</p>
    </div>
  `,
  styles: [`
    @use '../../styles-shared' as *;
    .page { padding: 32px; @media (max-width: $mobile-breakpoint) { padding: 20px 16px 80px; } }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .page-title { @include h3; margin: 0; }
    .empty-state { @include p3; color: $muted-text; text-align: center; padding: 48px 0; }
  `],
})
export class DonationListPageComponent {}
