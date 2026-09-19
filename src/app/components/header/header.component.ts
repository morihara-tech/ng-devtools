import { Component, computed, inject, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderModel, PersonButtonMenuModel } from './header-model';
import { PersonButtonComponent } from './person-button/person-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LanguageButtonComponent } from './language-button/language-button.component';
import { filter, map, mergeMap, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MENU_DASHBOARD } from '../../../resources/menu/def/menu-def';

@Component({
    selector: 'app-header',
    imports: [
        PersonButtonComponent,
        LanguageButtonComponent,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly model = input<HeaderModel>();
  readonly toggleMenu = output<void>();
  readonly clickPersonContext = output<PersonButtonMenuModel>();

  /**
   * Router link for the header logo. Since the Issue #223 landing-page
   * split, the app root `/` is the landing page and the operational
   * dashboard lives at `/dashboard` — the logo (long-standing "take me to
   * my tools" affordance) now points there instead of the app root, so it
   * no longer needs `HomeLinkDirective`'s root-path trailing-slash handling
   * (see `home-link.directive.ts`), a plain `[routerLink]` is correct.
   */
  readonly dashboardLink = MENU_DASHBOARD.routerLink;

  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly routeTitle = toSignal(
    this.route.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      map((data) => data['title'] as string | undefined),
      startWith(undefined),
    )
  );

  readonly getTitle = computed(() => {
    const title = this.routeTitle();
    if (title) return title;
    return this.model()?.defaultTitle ?? '';
  });

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}
