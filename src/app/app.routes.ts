import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Every route except /login requires an authenticated user. The guard
// redirects unauthenticated visitors to /login. This is the client-side
// half of access control; the Data Connect operations are also gated at
// @auth(level: USER), so the API rejects unauthenticated calls directly.

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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  {
    path: 'donations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/donations/donation-list-page.component').then(
        (m) => m.DonationListPageComponent
      ),
  },
  {
    path: 'donations/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/donations/donation-intake-page.component').then(
        (m) => m.DonationIntakePageComponent
      ),
  },
  {
    path: 'donations/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/donations/donation-detail-page.component').then(
        (m) => m.DonationDetailPageComponent
      ),
  },
  {
    path: 'inventory',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/inventory/inventory-list-page.component').then(
        (m) => m.InventoryListPageComponent
      ),
  },
  {
    path: 'inventory/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/inventory/inventory-detail-page.component').then(
        (m) => m.InventoryDetailPageComponent
      ),
  },
  {
    path: 'shelters',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shelters/shelter-list-page.component').then(
        (m) => m.ShelterListPageComponent
      ),
  },
  {
    path: 'shelters/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shelters/shelter-form-page.component').then(
        (m) => m.ShelterFormPageComponent
      ),
  },
  {
    path: 'shelters/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shelters/shelter-detail-page.component').then(
        (m) => m.ShelterDetailPageComponent
      ),
  },
  {
    path: 'shelters/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shelters/shelter-form-page.component').then(
        (m) => m.ShelterFormPageComponent
      ),
  },
  {
    path: 'batches',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/batches/batch-list-page.component').then(
        (m) => m.BatchListPageComponent
      ),
  },
  {
    path: 'batches/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/batches/batch-form-page.component').then(
        (m) => m.BatchFormPageComponent
      ),
  },
  {
    path: 'batches/:id',
    canActivate: [authGuard],
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
