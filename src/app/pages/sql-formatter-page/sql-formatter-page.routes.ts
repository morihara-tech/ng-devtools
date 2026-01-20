import { Routes } from '@angular/router';
import { SqlFormatterPageComponent } from './sql-formatter-page.component';

export const sqlFormatterPageRoutes: Routes = [
  { path: '', component: SqlFormatterPageComponent, data: { title: $localize`:@@page.sql.menu:SQL整形` } },
];
