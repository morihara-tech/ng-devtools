import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderModel, PersonButtonMenuModel } from './components/header/header-model';
import { filter, map, mergeMap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { IconService } from './icon.service';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { MENU_CATEGORIES, MENU_DASHBOARD } from '../resources/menu/def/menu-def';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from './core/services/platform.service';

@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
        SidenavComponent,
        MatSidenavModule,
        RouterOutlet,
        SitemapComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly _ = inject(IconService);
  private readonly document = inject(DOCUMENT);
  private readonly platformService = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);

  headerModel: HeaderModel = {
    defaultTitle: $localize`:@@app.title:devTools`,
    logo: { logoUrl: 'logo.svg', routerLink: '/' },
    appsButton: {
      routerLink: '/menu',
      label: $localize`:@@header.appsButton.label:メニュー`,
    },
  };

  readonly toggle = signal(false);

  constructor() {
    this.setTitle();
    afterNextRender(() => {
      this.loadGa4Script();
      this.trackSpaNavigations();
    });
  }

  onClickPersonContext(menu: PersonButtonMenuModel): void {
    if (menu.menuId === 'logout') {
      this.route.navigate(['logout']);
    }
  }

  onToggleMenu(): void {
    this.toggle.update(v => !v);
  }

  private setTitle(): void {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        let title = this.headerModel.defaultTitle;
        if (event['title']) {
          title = event['title'] + ' | ' + title;
        }
        this.titleService.setTitle(title);
        this.toggle.set(event['menuToggle']);
        this.setMetaDescription(event);
      });
  }

  private setMetaDescription(routeData: Data): void {
    const url = this.route.url;
    const path = url.split('?')[0].split('#')[0];

    const allItems = [MENU_DASHBOARD, ...MENU_CATEGORIES.flatMap((cat) => cat.items)];
    const menuItem = allItems.find((item) => item.routerLink === path);

    const description = menuItem?.description ?? (routeData['description'] as string | undefined) ?? '';
    if (description) {
      this.metaService.updateTag({ name: 'description', content: description });
    }
  }

  /** Appends the GA4 gtag.js script tag to the document head. */
  private loadGa4Script(): void {
    const measurementId = environment.analytics.measurementId;
    const script = this.document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    this.document.head.appendChild(script);

    const inlineScript = this.document.createElement('script');
    inlineScript.textContent = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      "gtag('js', new Date());",
      `gtag('config', ${JSON.stringify(measurementId)});`,
    ].join('\n');
    this.document.head.appendChild(inlineScript);
  }

  /** Subscribes to NavigationEnd events and sends a page_view hit to GA4. */
  private trackSpaNavigations(): void {
    const win = this.platformService.window as (Window & { gtag?: (...args: unknown[]) => void }) | null;
    if (!win?.gtag) return;

    const measurementId = environment.analytics.measurementId;
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        win.gtag?.('config', measurementId, { page_path: navEnd.urlAfterRedirects });
      });
  }
}
