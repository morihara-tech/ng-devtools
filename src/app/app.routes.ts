import { Routes } from '@angular/router';
import { dashboardPageRoutes } from './pages/dashboard-page/dashboard-page.routes';
import { errorPageRoutes } from './pages/error/error-page.routes';
import { ulidGenPageRoutes } from './pages/ulid-gen-page/ulid-gen-page.routes';
import { uuidGenPageRoutes } from './pages/uuid-gen-page/uuid-gen-page.routes';
import { jsonFormatterPageRoutes } from './pages/json-formatter-page/json-formatter-page.routes';
import { sqlFormatterPageRoutes } from './pages/sql-formatter-page/sql-formatter-page.routes';
import { passwordGenPageRoutes } from './pages/password-gen-page/password-gen-page.routes';
import { svgToPngPageRoutes } from './pages/svg-to-png-page/svg-to-png-page.routes';

export const routes: Routes = [
  { path: 'dashboard', children: dashboardPageRoutes },
  { path: 'ulid-generator', children: ulidGenPageRoutes },
  { path: 'uuid-generator', children: uuidGenPageRoutes },
  { path: 'json-formatter', children: jsonFormatterPageRoutes },
  { path: 'sql-formatter', children: sqlFormatterPageRoutes },
  { path: 'password-generator', children: passwordGenPageRoutes },
  { path: 'svg-to-png', children: svgToPngPageRoutes },
  { path: 'error', children: errorPageRoutes },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/error/404' }
];
