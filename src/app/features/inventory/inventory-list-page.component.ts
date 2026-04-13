import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-list-page',
  standalone: true,
  template: `
    <div class="page">
      <h1 class="page-title">Inventory</h1>
      <div class="filter-bar">
        <input class="search-input" type="text" placeholder="Search products..." />
      </div>
      <p class="empty-state">No products in stock.</p>
    </div>
  `,
  styles: [`
    @use '../../styles-shared' as *;
    .page { padding: 32px; @media (max-width: $mobile-breakpoint) { padding: 20px 16px 80px; } }
    .page-title { @include h3; margin: 0 0 24px; }
    .filter-bar { margin-bottom: 24px; }
    .search-input { @include form-input; max-width: 400px; }
    .empty-state { @include p3; color: $muted-text; text-align: center; padding: 48px 0; }
  `],
})
export class InventoryListPageComponent {}
