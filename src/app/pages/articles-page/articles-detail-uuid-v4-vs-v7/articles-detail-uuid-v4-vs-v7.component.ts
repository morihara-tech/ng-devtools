import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { ArticleRelatedToolsComponent } from '../../../components/article-related-tools/article-related-tools.component';

/** Article: UUID v4とv7の違いと使い分け. Independent editorial content, not a tool-help section. */
@Component({
  selector: 'app-articles-detail-uuid-v4-vs-v7',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    HyperLinkTextComponent,
    ArticleRelatedToolsComponent,
  ],
  templateUrl: './articles-detail-uuid-v4-vs-v7.component.html',
  styleUrl: './articles-detail-uuid-v4-vs-v7.component.scss',
})
export class ArticlesDetailUuidV4VsV7Component {
  readonly relatedTools = ['/uuid-generator', '/ulid-generator'];
}
