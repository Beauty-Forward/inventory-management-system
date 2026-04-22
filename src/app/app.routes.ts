import { Routes } from '@angular/router';

// Note: Auth guard exists at ./core/guards/auth.guard.ts but is intentionally
// left unwired so the warehouse manager can navigate freely during development.
// To enable: add `canActivate: [authGuard]` to each protected route.

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  {
    path: 'donations',
    loadComponent: () =>
      import('./features/donations/donation-list-page.component').then(
        (m) => m.DonationListPageComponent
      ),
  },
  {
    path: 'donations/new',
    loadComponent: () =>
      import('./features/donations/donation-intake-page.component').then(
        (m) => m.DonationIntakePageComponent
      ),
  },
  {
    path: 'donations/:id',
    loadComponent: () =>
      import('./features/donations/donation-detail-page.component').then(
        (m) => m.DonationDetailPageComponent
      ),
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./features/inventory/inventory-list-page.component').then(
        (m) => m.InventoryListPageComponent
      ),
  },
  {
    path: 'inventory/:id',
    loadComponent: () =>
      import('./features/inventory/inventory-detail-page.component').then(
        (m) => m.InventoryDetailPageComponent
      ),
  },
  {
    path: 'shelters',
    loadComponent: () =>
      import('./features/shelters/shelter-list-page.component').then(
        (m) => m.ShelterListPageComponent
      ),
  },
  {
    path: 'shelters/new',
    loadComponent: () =>
      import('./features/shelters/shelter-form-page.component').then(
        (m) => m.ShelterFormPageComponent
      ),
  },
  {
    path: 'shelters/:id',
    loadComponent: () =>
      import('./features/shelters/shelter-detail-page.component').then(
        (m) => m.ShelterDetailPageComponent
      ),
  },
  {
    path: 'shelters/:id/edit',
    loadComponent: () =>
      import('./features/shelters/shelter-form-page.component').then(
        (m) => m.ShelterFormPageComponent
      ),
  },
  {
    path: 'batches',
    loadComponent: () =>
      import('./features/batches/batch-list-page.component').then(
        (m) => m.BatchListPageComponent
      ),
  },
  {
    path: 'batches/new',
    loadComponent: () =>
      import('./features/batches/batch-form-page.component').then(
        (m) => m.BatchFormPageComponent
      ),
  },
  {
    path: 'batches/:id',
    loadComponent: () =>
      import('./features/batches/batch-detail-page.component').then(
        (m) => m.BatchDetailPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
