import { Routes } from '@angular/router';
import { UlidGenPageComponent } from './ulid-gen-page.component';

export const ulidGenPageRoutes: Routes = [
  { path: '', component: UlidGenPageComponent, data: { title: $localize`:@@page.ulid.menu:ULID生成` } },
];
