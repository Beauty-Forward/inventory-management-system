import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'inventory',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/inventory/inventory-list-page.component').then(
        (m) => m.InventoryListPageComponent
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
    path: 'batches',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/batches/batch-list-page.component').then(
        (m) => m.BatchListPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
