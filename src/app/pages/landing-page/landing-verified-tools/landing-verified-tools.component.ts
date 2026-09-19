import { Component, inject, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArticleListItem, getArticlesList } from '../../articles-page/articles-list';
import { ArticleRelatedToolsComponent } from '../../../components/article-related-tools/article-related-tools.component';

/**
 * "実装を検証したツール" section — pairs each article with the tools it
 * references (`ArticleListItem.relatedTools`), reusing
 * `ArticleRelatedToolsComponent` (already proven to render statically under
 * SSG on the article-detail page) to resolve each `routerLink` array into
 * icon + label.
 *
 * Entirely data-driven: adding a new article with `relatedTools` in its
 * frontmatter automatically extends this section — nothing here is
 * hardcoded per article or per tool. A tool with no article referencing it
 * simply never appears here (it still appears in the tool category list).
 *
 * Renders nothing when there are no articles (see template) — this is the
 * expected state in local dev, where `content/articles/` is not synced and
 * `getArticlesList()` returns `[]` (see articles-page.routes.ts for the same
 * caveat).
 */
@Component({
  selector: 'app-landing-verified-tools',
  imports: [RouterModule, ArticleRelatedToolsComponent],
  templateUrl: './landing-verified-tools.component.html',
  styleUrl: './landing-verified-tools.component.scss',
})
export class LandingVerifiedToolsComponent {
  private readonly locale = inject(LOCALE_ID);

  readonly articles: ArticleListItem[] = getArticlesList(this.locale);
}
