import { Component, inject, LOCALE_ID } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { ArticleListItem, getArticlesList } from '../../articles-page/articles-list';

/**
 * Number of recent articles shown in the dashboard card.
 *
 * Issue #172 requirement: increase from 2 to 6.
 *
 * Note: the card's `.card-content` has `overflow: auto` (see
 * dashboard-page-template.component.scss), so when 6 items exceed the
 * visible content area, they remain reachable via card-internal scrolling.
 * This is expected behavior, not a layout regression.
 */
const RECENT_ARTICLES_COUNT = 6;

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

  readonly articles: ArticleListItem[] = getArticlesList(this.locale).slice(
    0,
    RECENT_ARTICLES_COUNT,
  );
}
