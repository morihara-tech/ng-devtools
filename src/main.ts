/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@angular/common/locales/global/ja';
import '@angular/common/locales/global/en';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
