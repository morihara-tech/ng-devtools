import { Directive, HostBinding, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformService } from '../../core/services/platform.service';

/**
 * Renders a locale-aware, trailing-slash-free absolute `href` for links that
 * navigate to the app root (e.g. "/ja", not "/ja/"), while still performing
 * an in-app Router navigation (no full page reload) on click.
 *
 * Background: a plain `routerLink="/"` derives the anchor's `href` by
 * resolving the root path against `<base href>` (e.g. "/ja/" — Angular's
 * i18n build always emits a trailing slash on the locale base href). For the
 * root path this serializes to the base href itself, "/ja/", instead of the
 * canonical, trailing-slash-free form ("/ja") that matches the home page's
 * canonical URL. Crawlers following that literal "/ja/" href take a needless
 * 301 hop through the CloudFront redirect function.
 *
 * See https://github.com/morihara-tech/ng-devtools/issues/204.
 *
 * Usage: replace `routerLink="/"` (or `[routerLink]="'/'"`) with
 * `appHomeLink` on the same anchor element.
 */
@Directive({
  selector: '[appHomeLink]',
  standalone: true,
})
export class HomeLinkDirective {
  private readonly router = inject(Router);
  private readonly platformService = inject(PlatformService);

  @HostBinding('attr.href')
  get href(): string {
    const base = this.platformService.nativeDocument.querySelector('base')?.getAttribute('href') ?? '/';
    const trimmed = base.replace(/\/+$/, '');
    return trimmed || '/';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.platformService.isBrowser()) return;
    if (event.defaultPrevented) return;
    // Let the browser handle non-primary-button clicks and modified clicks
    // (open in new tab/window, etc.) natively instead of intercepting them.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl('/');
  }
}
