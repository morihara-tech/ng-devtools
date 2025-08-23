import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';

export const dashboardPageRoutes: Routes = [
  { path: '', component: DashboardPageComponent, data: { title: $localize`:@@page.dashboard.title:ダッシュボード` } },
];
