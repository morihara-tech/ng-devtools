import { inject, LOCALE_ID } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { ArticlesPageComponent } from './articles-page.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { getArticlesList } from './articles-list';
import articlesListJa from '../../../generated/articles/articles-list.ja.json';

/**
 * The build-time generated article list is split per locale (it is sourced
 * from Markdown frontmatter, not `$localize`/XLF), so route `title`/
 * `description` data — consumed by `AppComponent` for the document
 * `<title>` and meta description — must be resolved against the active
 * locale at runtime via `LOCALE_ID`, rather than embedded as a literal at
 * route-definition time (each locale is built as a fully separate `ng build`
 * invocation, but this module is plain JS and not subject to `$localize`
 * dead-code elimination).
 */
function resolveArticleTitle(slug: string): ResolveFn<string> {
  return () => getArticlesList(inject(LOCALE_ID)).find((item) => item.slug === slug)?.title ?? '';
}

function resolveArticleDescription(slug: string): ResolveFn<string> {
  return () => getArticlesList(inject(LOCALE_ID)).find((item) => item.slug === slug)?.summary ?? '';
}

/**
 * Routes for every article are generated from the build-time article list
 * (see scripts/prebuild-articles.mjs). All articles share the generic
 * `ArticleDetailComponent`; only the route `path`/`slug` differ per article.
 *
 * Routes must be statically registered before `ng build` runs, because the
 * app uses `prerender: true` without `getPrerenderParams`. See
 * docs/products/articles/architecture.md.
 *
 * The ja list (source locale) is used purely to enumerate slugs at
 * route-definition time; locale-specific title/description text is resolved
 * at runtime via `resolveArticleTitle`/`resolveArticleDescription`.
 */
const articleRoutes: Routes = articlesListJa.map((article) => ({
  path: article.slug,
  component: ArticleDetailComponent,
  resolve: {
    title: resolveArticleTitle(article.slug),
    description: resolveArticleDescription(article.slug),
  },
  data: { slug: article.slug },
}));

export const articlesPageRoutes: Routes = [
  {
    path: '',
    component: ArticlesPageComponent,
    data: {
      title: $localize`:@@page.articles.title:記事一覧`,
      description: $localize`:@@page.articles.description:devTools が提供するツールに関連するトピックを掘り下げて解説する記事の一覧です。`,
    },
  },
  ...articleRoutes,
];
