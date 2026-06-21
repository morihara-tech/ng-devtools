import articlesListJa from '../../../generated/articles/articles-list.ja.json';
import articlesListEn from '../../../generated/articles/articles-list.en.json';

/**
 * Article list item shape generated at build time from Markdown frontmatter
 * by scripts/prebuild-articles.mjs (see
 * docs/products/articles/architecture.md). This is the single source of
 * truth for article metadata — there is no hand-maintained TypeScript
 * equivalent (the old `articles-def.ts` has been removed).
 */
export interface ArticleListItem {
  slug: string;
  routerLink: string;
  title: string;
  summary: string;
  publishedDate: string;
  relatedTools: string[];
}

/**
 * The generated list is split per locale (sourced from Markdown frontmatter,
 * not `$localize`/XLF) so title/summary can be shown in the active locale
 * without re-deriving translations at runtime.
 */
export const ARTICLES_LIST_BY_LOCALE: Record<string, ArticleListItem[]> = {
  ja: articlesListJa,
  en: articlesListEn,
};

/**
 * Sorts `articles` by `publishedDate` in descending order (newest first).
 * Does not mutate the input array.
 *
 * Extracted as a standalone, side-effect-free function so it can be unit
 * tested directly with fixture data, independent of the build-time
 * generated JSON imports.
 */
export function sortArticlesByPublishedDateDesc(
  articles: readonly ArticleListItem[],
): ArticleListItem[] {
  return [...articles].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

/**
 * Returns the article list for `locale` sorted by `publishedDate` in
 * descending order (newest first), falling back to `ja` (source locale).
 *
 * Sorting is centralized here so every consumer (articles list page,
 * dashboard articles card, etc.) shows articles in the same newest-first
 * order without duplicating the sort logic.
 */
export function getArticlesList(locale: string): ArticleListItem[] {
  const articles = ARTICLES_LIST_BY_LOCALE[locale] ?? ARTICLES_LIST_BY_LOCALE['ja'];
  return sortArticlesByPublishedDateDesc(articles);
}
