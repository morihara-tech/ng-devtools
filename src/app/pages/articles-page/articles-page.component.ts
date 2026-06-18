import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ARTICLES, ArticleItem } from '../../../resources/articles/def/articles-def';

/**
 * Lists all independent editorial articles (distinct from per-tool help
 * sections). Articles answer a search intent about a topic and are not
 * required to map 1:1 with a tool.
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
  readonly articles: ArticleItem[] = ARTICLES;
}
