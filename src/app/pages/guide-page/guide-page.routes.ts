import { Routes } from '@angular/router';
import { GuidePageComponent } from './guide-page.component';

export const guidePageRoutes: Routes = [
  {
    path: '',
    component: GuidePageComponent,
    data: {
      title: $localize`:@@page.guide.title:ご利用ガイド`,
      description: $localize`:@@page.guide.description:devTools が提供する各ツールについて、どんな場面で使えるかを簡単に紹介します。詳しい使い方や仕様は各ツールのページをご覧ください。`,
    },
  },
];
