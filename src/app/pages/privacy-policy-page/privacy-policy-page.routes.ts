import { Routes } from '@angular/router';
import { PrivacyPolicyPageComponent } from './privacy-policy-page.component';

export const privacyPolicyPageRoutes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPageComponent,
    data: { title: $localize`:@@page.privacyPolicy.title:プライバシーポリシー` },
  },
];
