import { Routes } from '@angular/router';
import { dashboardPageRoutes } from './pages/dashboard-page/dashboard-page.routes';
import { errorPageRoutes } from './pages/error/error-page.routes';
import { ulidGenPageRoutes } from './pages/ulid-gen-page/ulid-gen-page.routes';

export const routes: Routes = [
  { path: 'dashboard', children: dashboardPageRoutes },
  { path: 'ulid-generator', children: ulidGenPageRoutes },
  { path: 'error', children: errorPageRoutes },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/error/404' }
];
