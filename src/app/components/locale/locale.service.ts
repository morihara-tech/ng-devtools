import { Injectable } from '@angular/core';
import { Locale } from './locale-model';
import { Observable, of } from 'rxjs';

const LOCALE_KEY: string = 'language';
@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private locales: Array<Locale> = ['ja', 'en'];

  constructor() {
    if (this.exist()) {
      return;
    }
    this.save(this.locales[0]);
  }

  save(locale: Locale): void {
    localStorage.setItem(LOCALE_KEY, locale);
  }

  remove(): void {
    localStorage.removeItem(LOCALE_KEY);
  }

  get(): Observable<Locale> {
    const locale = localStorage.getItem(LOCALE_KEY);
    const result = this.convertLocale(locale);
    return of(result);
  }

  getLocales(): Array<Locale> {
    return this.locales;
  }

  private exist(): boolean {
    return !!localStorage.getItem(LOCALE_KEY);
  }

  private convertLocale(str: string | null): Locale {
    if (!str || !this.isLocale(str)) {
      return this.locales[0];
    }
    return str;
  }

  private isLocale(str: string): str is Locale {
    return !!this.locales.find(l => l === str);
  }
}
