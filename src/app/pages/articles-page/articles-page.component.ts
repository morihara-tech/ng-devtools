import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ArticleListItem, getArticlesList } from './articles-list';

/**
 * Lists all independent editorial articles (distinct from per-tool help
 * sections). Articles answer a search intent about a topic and are not
 * required to map 1:1 with a tool.
 *
 * Article metadata is generated at build time from Markdown frontmatter by
 * scripts/prebuild-articles.mjs (see docs/products/articles/architecture.md)
 * rather than from a hand-maintained TypeScript definition file.
 */
@Component({
  selector: 'app-articles-page',
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    ApplicationPageTemplateComponent,
    HeadingComponent,
  ],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.scss',
})
export class ArticlesPageComponent {
  private readonly locale = inject(LOCALE_ID);

  readonly allArticles: ArticleListItem[] = getArticlesList(this.locale);

  readonly pageSizeOptions = [12, 24, 48];
  readonly pageIndex = signal(0);
  readonly pageSize = signal(this.pageSizeOptions[0]);

  readonly articles = computed<ArticleListItem[]>(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.allArticles.slice(start, start + this.pageSize());
  });

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
