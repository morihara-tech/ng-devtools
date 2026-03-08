import { Routes } from '@angular/router';
import { UnixTimestampConverterPageComponent } from './unix-timestamp-converter-page.component';

export const unixTimestampConverterPageRoutes: Routes = [
  {
    path: '',
    component: UnixTimestampConverterPageComponent,
    data: { title: $localize`:@@page.unixTimestamp.menu:UNIXタイム変換` },
  },
];
