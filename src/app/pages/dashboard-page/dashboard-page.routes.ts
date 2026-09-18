import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page.component';

export const dashboardPageRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    data: {
      title: $localize`:@@page.dashboard.title:JSON整形・SQL整形・UUID生成など無料の開発者ツール`,
      breadcrumb: { label: $localize`:@@page.dashboard.breadcrumb:無料で使える開発者ツール集` },
      // /dashboard is an operational, personalizable card layout (D&D,
      // resize, localStorage persistence) that offers no unique static
      // content of its own for search engines — the same tools are already
      // indexable via their individual pages and the landing page's tool
      // category list. See docs/products/landing-page/spec.md (or Issue
      // #223) for the full rationale. `follow` is kept so link equity to the
      // individual tool pages still flows through this route.
      robots: 'noindex,follow',
    },
  },
];
