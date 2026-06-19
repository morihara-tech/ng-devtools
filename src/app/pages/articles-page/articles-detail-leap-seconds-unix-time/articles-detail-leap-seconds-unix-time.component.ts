import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../../components/hyper-link-text/hyper-link-text.component';
import { ArticleRelatedToolsComponent } from '../../../components/article-related-tools/article-related-tools.component';

/** Article: UNIX時間がうるう秒をどう扱うか. Independent editorial content, not a tool-help section. */
@Component({
  selector: 'app-articles-detail-leap-seconds-unix-time',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    HyperLinkTextComponent,
    ArticleRelatedToolsComponent,
  ],
  templateUrl: './articles-detail-leap-seconds-unix-time.component.html',
  styleUrl: './articles-detail-leap-seconds-unix-time.component.scss',
})
export class ArticlesDetailLeapSecondsUnixTimeComponent {
  readonly relatedTools = ['/unix-timestamp-converter'];
}
