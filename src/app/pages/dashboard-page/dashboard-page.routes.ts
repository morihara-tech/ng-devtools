import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';

export const dashboardPageRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    data: {
      title: $localize`:@@page.dashboard.title:JSON整形・SQL整形・UUID生成など無料の開発者ツール`,
      breadcrumb: { label: $localize`:@@page.dashboard.breadcrumb:無料で使える開発者ツール集` },
    },
  },
];
