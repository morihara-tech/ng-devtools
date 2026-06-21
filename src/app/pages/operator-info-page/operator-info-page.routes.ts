import { Routes } from '@angular/router';
import { OperatorInfoPageComponent } from './operator-info-page.component';

export const operatorInfoPageRoutes: Routes = [
  {
    path: '',
    component: OperatorInfoPageComponent,
    data: {
      title: $localize`:@@page.operatorInfo.title:運営者情報・お問い合わせ`,
      description: $localize`:@@page.operatorInfo.description:当サイトの運営者情報およびお問い合わせ方法についての説明です。`,
    },
  },
];
