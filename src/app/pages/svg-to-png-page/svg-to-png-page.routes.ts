import { Routes } from '@angular/router';
import { SvgToPngPageComponent } from './svg-to-png-page.component';

export const svgToPngPageRoutes: Routes = [
  {
    path: '',
    component: SvgToPngPageComponent,
    data: { title: $localize`:@@page.svgToPng.menu:SVGビューアー` }
  },
];
