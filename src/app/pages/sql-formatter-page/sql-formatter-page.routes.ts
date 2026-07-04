import { Routes } from '@angular/router';
import { SqlFormatterPageComponent } from './sql-formatter-page.component';

export const sqlFormatterPageRoutes: Routes = [
  {
    path: '',
    component: SqlFormatterPageComponent,
    data: { title: $localize`:@@page.sqlFormatter.title:SQL整形ツール（ORM生成SQL・複雑なJOIN句にも対応）` },
  },
];
