import { Routes } from '@angular/router';
import { UrlEncoderPageComponent } from './url-encoder-page.component';

export const urlEncoderPageRoutes: Routes = [
  { path: '', component: UrlEncoderPageComponent, data: { title: $localize`:@@page.urlEncoder.menu:URLエンコーダー` } },
];
