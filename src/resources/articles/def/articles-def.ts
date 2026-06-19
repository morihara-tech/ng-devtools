/** Represents a single article entry shown in the article list. */
export interface ArticleItem {
  /** Article title (i18n) */
  title: string;
  /** Short summary shown in the list card and used as meta description (i18n) */
  summary: string;
  /** Angular router link to the article detail page */
  routerLink: string;
  /** Publication date (ISO 8601, YYYY-MM-DD) */
  publishedDate: string;
  /** Router links of tools related to this article, used for "related tools" links */
  relatedTools: string[];
  /**
   * Source of the article body.
   * - Unspecified (default): body is a hand-written component under
   *   `src/app/pages/articles-page/articles-detail-<slug>/`.
   * - `'markdown'`: body is generated at build time from
   *   `content/articles/<slug>/{ja,en}.md` via `scripts/prebuild-articles.mjs`
   *   and rendered by the generic `ArticleDetailComponent` from
   *   `src/generated/articles/articles-content.{ja,en}.json`.
   */
  bodySource?: 'markdown';
}

/**
 * Single source of truth for all articles.
 *
 * Articles are independent editorial content answering a search intent about a
 * *topic* (e.g. "UUID v4 と v7 の違い"), as opposed to tool help sections which
 * explain "how to use this tool". An article may relate to zero or more tools;
 * the relationship is many-to-many, not 1:1.
 */
export const ARTICLES: ArticleItem[] = [
  {
    title: $localize`:@@article.uuidV4VsV7.title:UUID v4とv7の違いと使い分け`,
    summary: $localize`:@@article.uuidV4VsV7.summary:ランダム生成のv4と時系列ソート可能なv7、それぞれの内部構造と適した用途を解説します。`,
    routerLink: '/articles/uuid-v4-vs-v7',
    publishedDate: '2026-06-18',
    relatedTools: ['/uuid-generator', '/ulid-generator'],
    bodySource: 'markdown',
  },
  {
    title: $localize`:@@article.leapSecondsUnixTime.title:UNIX時間がうるう秒をどう扱うか`,
    summary: $localize`:@@article.leapSecondsUnixTime.summary:86400秒固定で進むUNIX時間とうるう秒の関係、変換時に注意すべき点を解説します。`,
    routerLink: '/articles/leap-seconds-unix-time',
    publishedDate: '2026-06-18',
    relatedTools: ['/unix-timestamp-converter'],
  },
];
