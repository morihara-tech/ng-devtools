import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuCategory } from '../../../../resources/menu/def/menu-def';

/**
 * Landing-page tool-category listing. Split out from `LandingPageComponent`
 * purely to keep each component's compiled stylesheet under the project's
 * `anyComponentStyle` budget (see `landing-hero.component.ts` for the same
 * rationale) — this markup/CSS is landing-page-only, not a reusable widget.
 *
 * Renders every tool in `MENU_CATEGORIES`, grouped by category, as direct
 * links to each tool page (never routed through `/dashboard`).
 */
@Component({
  selector: 'app-landing-tool-categories',
  imports: [RouterModule, MatIconModule],
  templateUrl: './landing-tool-categories.component.html',
  styleUrl: './landing-tool-categories.component.scss',
})
export class LandingToolCategoriesComponent {
  readonly categories = input.required<MenuCategory[]>();
}
