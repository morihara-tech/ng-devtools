import { Component, inject, LOCALE_ID } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { ArticleListItem, getArticlesList } from '../../articles-page/articles-list';

/**
 * Number of recent articles shown in the dashboard card.
 *
 * Issue #172 originally requested 6, but the card's content area at
 * `size: { y: 'l' }` (652px, see dashboard-page.component.ts) cannot fit 6
 * articles without internal scrolling: measured with realistic title/summary
 * lengths (~18 chars / ~44 chars, matching existing content/articles/*.md),
 * each list item is 109px tall, so 6 items overflow the content area by
 * ~24px (676px content vs 652px visible) while the "view all" link/footer
 * sits outside the scrollable area.
 *
 * 5 items fit exactly (5 * 109px = 545px <= 652px, measured scrollHeight ===
 * clientHeight with 0px overflow), so all visible articles plus the
 * "view all articles" link are reachable via page scroll alone, with no
 * card-internal scrollbar. This value is intentionally 5, not 6.
 */
const RECENT_ARTICLES_COUNT = 5;

@Component({
  selector: 'app-articles-card',
  imports: [
    RouterModule,
    MatListModule,
    MatDividerModule,
    HyperLinkTextComponent,
  ],
  templateUrl: './articles-card.component.html',
  styleUrl: './articles-card.component.scss',
})
export class ArticlesCardComponent {
  private readonly locale = inject(LOCALE_ID);

  readonly articles: ArticleListItem[] = [...getArticlesList(this.locale)]
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, RECENT_ARTICLES_COUNT);
}
