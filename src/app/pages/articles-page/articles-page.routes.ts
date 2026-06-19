import { Routes } from '@angular/router';
import { ArticlesPageComponent } from './articles-page.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticlesDetailLeapSecondsUnixTimeComponent } from './articles-detail-leap-seconds-unix-time/articles-detail-leap-seconds-unix-time.component';
import { ARTICLES } from '../../../resources/articles/def/articles-def';

/**
 * Routes for articles whose body is generated at build time from Markdown
 * (`ArticleItem.bodySource === 'markdown'`). All such articles share the
 * generic `ArticleDetailComponent`; only the route `path`/`slug`/`data`
 * differ per article. See scripts/prebuild-articles.mjs and
 * docs/products/articles/architecture.md.
 */
const markdownArticleRoutes: Routes = ARTICLES.filter((article) => article.bodySource === 'markdown').map(
  (article) => {
    const slug = article.routerLink.replace('/articles/', '');
    return {
      path: slug,
      component: ArticleDetailComponent,
      data: {
        slug,
        title: article.title,
        description: article.summary,
      },
    };
  },
);

export const articlesPageRoutes: Routes = [
  {
    path: '',
    component: ArticlesPageComponent,
    data: {
      title: $localize`:@@page.articles.title:記事一覧`,
      description: $localize`:@@page.articles.description:devTools が提供するツールに関連するトピックを掘り下げて解説する記事の一覧です。`,
    },
  },
  ...markdownArticleRoutes,
  // Hand-written article components (ArticleItem.bodySource left unspecified).
  {
    path: 'leap-seconds-unix-time',
    component: ArticlesDetailLeapSecondsUnixTimeComponent,
    data: {
      title: $localize`:@@article.leapSecondsUnixTime.title:UNIX時間がうるう秒をどう扱うか`,
      description: $localize`:@@article.leapSecondsUnixTime.summary:86400秒固定で進むUNIX時間とうるう秒の関係、変換時に注意すべき点を解説します。`,
    },
  },
];
