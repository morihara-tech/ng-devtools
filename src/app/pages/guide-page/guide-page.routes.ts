import { Routes } from '@angular/router';
import { GuidePageComponent } from './guide-page.component';

export const guidePageRoutes: Routes = [
  {
    path: '',
    component: GuidePageComponent,
    data: {
      title: $localize`:@@page.guide.title:ご利用ガイド`,
      description: $localize`:@@page.guide.description:このページでは、devTools が提供する全ツールの概要・使い方・仕様を一覧で確認できます。`,
    },
  },
];
