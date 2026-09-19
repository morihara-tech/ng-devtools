import { Component, inject, input, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ArticleListItem, getArticlesList } from '../../articles-page/articles-list';
import { MENU_CATEGORIES, MenuItem } from '../../../../resources/menu/def/menu-def';

/**
 * One "tool → article" pairing shown on the hero panel: the tool's menu
 * label paired with the newest article that references it via
 * `ArticleListItem.relatedTools`. Both fields are resolved from existing
 * data sources (menu-def, generated article list) — nothing here is a
 * hardcoded tool name or article title, so the pairing stays correct as
 * articles are added/removed.
 */
export interface RelatedArticleCard {
  readonly toolLabel: string;
  readonly toolRouterLink: string;
  readonly article: ArticleListItem;
}

/**
 * Tool routerLinks to feature on the hero panel, in display order. This is a
 * fixed, small selection (kept intentionally to two) rather than a full
 * listing like `landing-verified-tools` — the hero panel is meant to give a
 * quick, concrete example of "tool with an explainer article", not enumerate
 * every article.
 */
const HERO_RELATED_TOOL_ROUTER_LINKS: readonly string[] = ['/ulid-generator', '/svg-to-png'];

/**
 * For each `toolRouterLink`, pairs the tool's menu label with the
 * newest matching article (first hit — `articles` is expected pre-sorted
 * newest-first, as `getArticlesList()` returns). A tool is skipped when no
 * article references it yet, or when it isn't present in `menuItems` — this
 * is expected in local dev, where `content/articles/` is not synced and
 * `getArticlesList()` returns `[]` (see `landing-verified-tools.component.ts`
 * for the same caveat).
 */
export function buildRelatedArticleCards(
  articles: readonly ArticleListItem[],
  menuItems: readonly MenuItem[],
  toolRouterLinks: readonly string[] = HERO_RELATED_TOOL_ROUTER_LINKS,
): RelatedArticleCard[] {
  const cards: RelatedArticleCard[] = [];
  for (const toolRouterLink of toolRouterLinks) {
    const article = articles.find((candidate) => candidate.relatedTools.includes(toolRouterLink));
    const toolLabel = menuItems.find((item) => item.routerLink === toolRouterLink)?.label;
    if (article && toolLabel) {
      cards.push({ toolLabel, toolRouterLink, article });
    }
  }
  return cards;
}

/**
 * Landing-page hero section. Split out from `LandingPageComponent` purely to
 * keep each component's compiled stylesheet under the project's
 * `anyComponentStyle` budget (4kB error / 2kB warning, see angular.json) —
 * there is no shared-reuse motivation, this markup/CSS is landing-page-only.
 *
 * The panel on the right shows up to two "tool → article" cards (see
 * `buildRelatedArticleCards`), entirely static HTML, no client-side
 * rendering, per the SSG requirement for this page. It renders nothing when
 * there are no matching articles — expected in local dev (empty generated
 * article JSON); populated once `content/articles/` is synced (CI).
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

  private readonly locale = inject(LOCALE_ID);

  private readonly menuItems: MenuItem[] = MENU_CATEGORIES.flatMap((category) => category.items);

  readonly relatedArticleCards: RelatedArticleCard[] = buildRelatedArticleCards(
    getArticlesList(this.locale),
    this.menuItems,
  );
}
