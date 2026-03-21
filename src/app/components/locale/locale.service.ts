import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Locale } from './locale-model';
import { PlatformService } from '../../core/services/platform.service';


@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly SUBPATHS: Record<Locale, string> = {
    ja: 'ja',
    en: 'en',
  };

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private readonly platformService: PlatformService,
  ) {}

  switchTo(target: Locale, options?: { preservePath?: boolean }) {
    const preservePath = options?.preservePath ?? true;

    const win = this.platformService.window;
    if (!win) return;

    const baseHref = this.getBaseHref();
    const { origin, pathname, search, hash } = win.location;

    const relative = preservePath
      ? this.stripLeadingSlash(
          pathname.startsWith(baseHref)
            ? pathname.slice(baseHref.length)
            : pathname.replace(/^\/+/, '')
        )
      : '';

    const sub = this.ensureTrailingSlash('/' + this.SUBPATHS[target]);
    const targetUrl =
      origin +
      sub +
      (relative ? relative : '') +
      (search || '') +
      (hash || '');

    if (this.isSameLocale(baseHref, sub)) return;

    win.location.assign(targetUrl);
  }

  getCurrentLocale(): Locale {
    const baseHref = this.getBaseHref();
    if (baseHref.includes('/ja/')) {
      return 'ja';
    }
    if (baseHref.includes('/en/')) {
      return 'en';
    }
    return 'ja';
  }

  private getBaseHref(): string {
    // <base href="..."> is set by Angular i18n build per locale
    const base = this.doc.querySelector('base')?.getAttribute('href') || '/';
    return this.ensureLeadingSlash(this.ensureTrailingSlash(base));
  }

  private isSameLocale(currentBase: string, targetBase: string): boolean {
    // Normalize for trailing slash
    const a = this.ensureTrailingSlash(currentBase);
    const b = this.ensureTrailingSlash(targetBase);
    return a === b;
  }

  private ensureLeadingSlash(p: string): string {
    return p.startsWith('/') ? p : '/' + p;
  }

  private ensureTrailingSlash(p: string): string {
    return p.endsWith('/') ? p : p + '/';
  }

  private stripLeadingSlash(p: string): string {
    return p.replace(/^\/+/, '');
  }

}
