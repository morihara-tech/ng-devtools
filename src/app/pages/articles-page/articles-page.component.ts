import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ArticleListItem, getArticlesList } from './articles-list';

/**
 * Japanese labels for `mat-paginator`. Angular Material ships English labels
 * by default, so on the `ja` locale we override `MatPaginatorIntl` to avoid
 * mixing English paginator chrome into an otherwise Japanese page.
 */
function createJaPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.itemsPerPageLabel = '1ページあたりの件数:';
  intl.nextPageLabel = '次のページ';
  intl.previousPageLabel = '前のページ';
  intl.firstPageLabel = '最初のページ';
  intl.lastPageLabel = '最後のページ';
  intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length} 件`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} / ${length} 件`;
  };
  return intl;
}

/** Returns a `MatPaginatorIntl` with labels matching the active locale. */
function paginatorIntlFactory(locale: string): MatPaginatorIntl {
  return locale === 'ja' ? createJaPaginatorIntl() : new MatPaginatorIntl();
}

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
    MatPaginatorModule,
    ApplicationPageTemplateComponent,
    HeadingComponent,
  ],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.scss',
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: () => paginatorIntlFactory(inject(LOCALE_ID)),
    },
  ],
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
