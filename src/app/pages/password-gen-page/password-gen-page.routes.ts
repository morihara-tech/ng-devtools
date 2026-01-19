import { Routes } from '@angular/router';
import { PasswordGenPageComponent } from './password-gen-page.component';

export const passwordGenPageRoutes: Routes = [
  { path: '', component: PasswordGenPageComponent, data: { title: $localize`:@@page.password.menu:パスワード生成` } },
];
