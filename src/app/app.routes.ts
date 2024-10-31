import { Routes } from '@angular/router';
import { errorPageRoutes } from './pages/error/error-page.routes';
import { ulidGenPageRoutes } from './pages/ulid-gen-page/ulid-gen-page.routes';

export const routes: Routes = [
  { path: 'ulid-generator', children: ulidGenPageRoutes },
  { path: 'error', children: errorPageRoutes },
  { path: '', redirectTo: '/ulid-generator', pathMatch: 'full' },
  { path: '**', redirectTo: '/error/404' }
];
