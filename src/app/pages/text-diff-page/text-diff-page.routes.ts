import { Routes } from '@angular/router';
import { TextDiffPageComponent } from './text-diff-page.component';

export const textDiffPageRoutes: Routes = [
  { path: '', component: TextDiffPageComponent, data: { title: $localize`:@@page.textDiff.menu:テキスト比較` } },
];
