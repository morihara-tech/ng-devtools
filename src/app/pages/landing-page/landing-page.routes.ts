import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

export const landingPageRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      title: $localize`:@@page.landing.title:無料で使える開発者ツール集`,
      description: $localize`:@@page.landing.description:APIキー生成・SVGビューアー・ULID生成・カラーパレットなど、無料で使える開発者ツール集です。気になる仕様やエッジケースについては、記事でも詳しく解説しています。`,
      breadcrumb: { label: $localize`:@@page.landing.breadcrumb:無料の開発者ツール集` },
    },
  },
];
