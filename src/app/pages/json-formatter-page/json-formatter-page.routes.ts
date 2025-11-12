import { Routes } from '@angular/router';
import { JsonFormatterPageComponent } from './json-formatter-page.component';

export const jsonFormatterPageRoutes: Routes = [
  { path: '', component: JsonFormatterPageComponent, data: { title: $localize`:@@page.json.menu:JSON整形` } },
];
