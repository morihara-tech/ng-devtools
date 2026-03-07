import { Routes } from '@angular/router';
import { IpCidrCalculatorPageComponent } from './ip-cidr-calculator-page.component';

export const ipCidrCalculatorPageRoutes: Routes = [
  {
    path: '',
    component: IpCidrCalculatorPageComponent,
    data: { title: $localize`:@@page.ipCidr.menu:IP/CIDR計算機` }
  }
];
