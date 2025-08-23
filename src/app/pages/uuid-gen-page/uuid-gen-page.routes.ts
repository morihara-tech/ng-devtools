import { Routes } from '@angular/router';
import { UuidGenPageComponent } from './uuid-gen-page.component';

export const uuidGenPageRoutes: Routes = [
  { path: '', component: UuidGenPageComponent, data: { title: $localize`:@@page.uuid.menu:UUID生成` } },
];
