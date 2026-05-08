import { Routes } from '@angular/router';
import { ApiKeyGenPageComponent } from './api-key-gen-page.component';

export const apiKeyGenPageRoutes: Routes = [
  { path: '', component: ApiKeyGenPageComponent, data: { title: $localize`:@@page.apiKey.menu:APIキー生成` } },
];
