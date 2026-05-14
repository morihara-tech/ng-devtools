import { Component, inject, signal } from '@angular/core';
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
}
