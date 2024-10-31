import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const errorPageRoutes: Routes = [
  { path: '404', component: NotFoundPageComponent },
];
