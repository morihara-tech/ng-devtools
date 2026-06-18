import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { ARTICLES, ArticleItem } from '../../../../resources/articles/def/articles-def';

/** Number of recent articles shown in the dashboard card. */
const RECENT_ARTICLES_COUNT = 2;

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
  readonly articles: ArticleItem[] = [...ARTICLES]
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, RECENT_ARTICLES_COUNT);
}
