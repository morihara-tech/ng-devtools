import { Routes } from '@angular/router';
import { JsonFormatterPageComponent } from './json-formatter-page.component';

export const jsonFormatterPageRoutes: Routes = [
  {
    path: '',
    component: JsonFormatterPageComponent,
    data: { title: $localize`:@@page.jsonFormatter.title:JSON整形・バリデーションツール（インデント調整・ミニファイ対応）` },
  },
];
