import { Routes } from '@angular/router';
import { UuidGenPageComponent } from './uuid-gen-page.component';

export const uuidGenPageRoutes: Routes = [
  {
    path: '',
    component: UuidGenPageComponent,
    data: { title: $localize`:@@page.uuidGenerator.title:UUID生成ツール（v1/v4/v7対応・一括生成）` },
  },
];
