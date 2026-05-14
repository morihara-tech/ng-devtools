import { Routes } from '@angular/router';
import { MenuPageComponent } from './menu-page.component';

export const menuPageRoutes: Routes = [
  {
    path: '',
    component: MenuPageComponent,
    data: {
      title: $localize`:@@page.menu.title:メニュー`,
      description: $localize`:@@page.menu.description:devTools で利用可能な全ツールの一覧です。`,
    },
  },
];
