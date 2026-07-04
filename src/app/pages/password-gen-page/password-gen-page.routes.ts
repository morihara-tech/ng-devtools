import { Routes } from '@angular/router';
import { PasswordGenPageComponent } from './password-gen-page.component';

export const passwordGenPageRoutes: Routes = [
  {
    path: '',
    component: PasswordGenPageComponent,
    data: { title: $localize`:@@page.passwordGenerator.title:安全なパスワード生成ツール（文字種・桁数を指定可能）` },
  },
];
