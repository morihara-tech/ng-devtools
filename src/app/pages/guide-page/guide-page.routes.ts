import { Routes } from '@angular/router';
import { GuidePageComponent } from './guide-page.component';

export const guidePageRoutes: Routes = [
  {
    path: '',
    component: GuidePageComponent,
    data: { title: $localize`:@@page.guide.title:ご利用ガイド` },
  },
];
