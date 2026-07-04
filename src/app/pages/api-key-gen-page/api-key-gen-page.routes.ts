import { Routes } from '@angular/router';
import { ApiKeyGenPageComponent } from './api-key-gen-page.component';

export const apiKeyGenPageRoutes: Routes = [
  {
    path: '',
    component: ApiKeyGenPageComponent,
    data: { title: $localize`:@@page.apiKeyGenerator.title:APIキー生成ツール（ランダムなAPIキー・シークレットを生成）` },
  },
];
