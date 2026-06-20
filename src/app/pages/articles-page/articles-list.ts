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

/** Returns the article list for `locale`, falling back to `ja` (source locale). */
export function getArticlesList(locale: string): ArticleListItem[] {
  return ARTICLES_LIST_BY_LOCALE[locale] ?? ARTICLES_LIST_BY_LOCALE['ja'];
}
