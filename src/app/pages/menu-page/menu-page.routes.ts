import { Routes } from '@angular/router';
import { MenuPageComponent } from './menu-page.component';

export const menuPageRoutes: Routes = [
  {
    path: '',
    component: MenuPageComponent,
    data: { title: $localize`:@@page.menu.title:メニュー一覧` },
  },
];
