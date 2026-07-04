import { Routes } from '@angular/router';
import { TextDiffPageComponent } from './text-diff-page.component';

export const textDiffPageRoutes: Routes = [
  {
    path: '',
    component: TextDiffPageComponent,
    data: { title: $localize`:@@page.textDiffTool.title:テキスト差分比較ツール（2つの文章・コードの違いを可視化）` },
  },
];
