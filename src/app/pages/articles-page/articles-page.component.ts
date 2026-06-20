import { Component, inject, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
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
    ApplicationPageTemplateComponent,
    HeadingComponent,
  ],
  templateUrl: './articles-page.component.html',
  styleUrl: './articles-page.component.scss',
})
export class ArticlesPageComponent {
  private readonly locale = inject(LOCALE_ID);

  readonly articles: ArticleListItem[] = getArticlesList(this.locale);
}
