import { Routes } from '@angular/router';
import { ArticlesPageComponent } from './articles-page.component';
import { ArticlesDetailUuidV4VsV7Component } from './articles-detail-uuid-v4-vs-v7/articles-detail-uuid-v4-vs-v7.component';
import { ArticlesDetailLeapSecondsUnixTimeComponent } from './articles-detail-leap-seconds-unix-time/articles-detail-leap-seconds-unix-time.component';

export const articlesPageRoutes: Routes = [
  {
    path: '',
    component: ArticlesPageComponent,
    data: {
      title: $localize`:@@page.articles.title:記事一覧`,
      description: $localize`:@@page.articles.description:devTools が提供するツールに関連するトピックを掘り下げて解説する記事の一覧です。`,
    },
  },
  {
    path: 'uuid-v4-vs-v7',
    component: ArticlesDetailUuidV4VsV7Component,
    data: {
      title: $localize`:@@article.uuidV4VsV7.title:UUID v4とv7の違いと使い分け`,
      description: $localize`:@@article.uuidV4VsV7.summary:ランダム生成のv4と時系列ソート可能なv7、それぞれの内部構造と適した用途を解説します。`,
    },
  },
  {
    path: 'leap-seconds-unix-time',
    component: ArticlesDetailLeapSecondsUnixTimeComponent,
    data: {
      title: $localize`:@@article.leapSecondsUnixTime.title:UNIX時間がうるう秒をどう扱うか`,
      description: $localize`:@@article.leapSecondsUnixTime.summary:86400秒固定で進むUNIX時間とうるう秒の関係、変換時に注意すべき点を解説します。`,
    },
  },
];
