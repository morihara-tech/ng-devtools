import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MENU_CATEGORIES, MENU_DASHBOARD, MenuCategory } from '../../../resources/menu/def/menu-def';
import { HOME_UPDATE_HISTORIES } from '../../../resources/update-history/def/home.update-history';
import { UpdateHistoryComponent } from '../../components/update-history/update-history.component';
import { AdComponent } from '../../components/ad/ad.component';
import { environment } from '../../../environments/environment';
import { LandingVerifiedToolsComponent } from './landing-verified-tools/landing-verified-tools.component';
import { LandingHeroComponent } from './landing-hero/landing-hero.component';
import { LandingToolCategoriesComponent } from './landing-tool-categories/landing-tool-categories.component';

/** Number of most-recent update-history entries shown on the landing page. */
const HISTORY_LIMIT = 5;

/**
 * The new top-page (`/`) landing page. Replaces the former operational
 * dashboard at this route — the dashboard itself lives on at `/dashboard`
 * (see `dashboard-page.routes.ts`).
 *
 * Every section here renders as plain, fully static template output (no
 * `@defer`, no client-only data fetch) so SSG emits complete HTML for each
 * section — this is a hard requirement carried over from the Issue #220
 * regression (SSG output silently missing dashboard content).
 */
@Component({
  selector: 'app-landing-page',
  imports: [
    RouterModule,
    MatIconModule,
    UpdateHistoryComponent,
    AdComponent,
    LandingVerifiedToolsComponent,
    LandingHeroComponent,
    LandingToolCategoriesComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  readonly categories: MenuCategory[] = MENU_CATEGORIES;
  readonly dashboardLink = MENU_DASHBOARD.routerLink;
  readonly recentHistories = HOME_UPDATE_HISTORIES.slice(0, HISTORY_LIMIT);
  readonly landingAdSlot = environment.adsense.landingSlot;
}
