import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

export const landingPageRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      title: $localize`:@@page.landing.title:実装を検証した無料の開発者ツール集`,
      description: $localize`:@@page.landing.description:JSON整形・SQL整形・UUID生成など、ブラウザだけで完結する無料の開発者ツール集です。仕様やエッジケースを記事で検証しながら実装しているツールを中心に紹介します。`,
      breadcrumb: { label: $localize`:@@page.landing.breadcrumb:実装を検証した開発者ツール集` },
    },
  },
];
