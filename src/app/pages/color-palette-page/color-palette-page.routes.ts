import { Routes } from '@angular/router';
import { ColorPalettePageComponent } from './color-palette-page.component';

export const colorPalettePageRoutes: Routes = [
  {
    path: '',
    component: ColorPalettePageComponent,
    data: { title: $localize`:@@page.colorPaletteTool.title:カラーパレット生成ツール（配色比較・グラデーション作成）` },
  },
];
