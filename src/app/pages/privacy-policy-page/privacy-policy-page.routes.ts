import { Routes } from '@angular/router';
import { PrivacyPolicyPageComponent } from './privacy-policy-page.component';

export const privacyPolicyPageRoutes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPageComponent,
    data: {
      title: $localize`:@@page.privacyPolicy.title:プライバシーポリシー`,
      description: $localize`:@@page.privacyPolicy.description:個人情報の取り扱いおよびGoogle Analyticsの利用についての説明です。`,
    },
  },
];
