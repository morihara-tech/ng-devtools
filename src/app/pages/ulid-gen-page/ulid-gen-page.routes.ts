import { Routes } from '@angular/router';
import { UlidGenPageComponent } from './ulid-gen-page.component';

export const ulidGenPageRoutes: Routes = [
  {
    path: '',
    component: UlidGenPageComponent,
    data: { title: $localize`:@@page.ulidGenerator.title:ULID生成ツール（時系列ソート可能な一意ID・一括生成）` },
  },
];
