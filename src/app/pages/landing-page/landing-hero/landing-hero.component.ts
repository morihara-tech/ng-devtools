import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/**
 * Landing-page hero section. Split out from `LandingPageComponent` purely to
 * keep each component's compiled stylesheet under the project's
 * `anyComponentStyle` budget (4kB error / 2kB warning, see angular.json) —
 * there is no shared-reuse motivation, this markup/CSS is landing-page-only.
 *
 * The "verify.log" panel on the right is a static, illustrative mock of a
 * passing assertion log (not a real terminal or live output) — it exists to
 * make the "実装を検証した" (implementation-verified) concept concrete at a
 * glance. Entirely static HTML, no client-side rendering, per the SSG
 * requirement for this page.
 */
@Component({
  selector: 'app-landing-hero',
  imports: [RouterModule, MatIconModule],
  templateUrl: './landing-hero.component.html',
  styleUrl: './landing-hero.component.scss',
})
export class LandingHeroComponent {
  /** Router link for the secondary CTA (the dashboard). */
  readonly dashboardLink = input.required<string>();
}
