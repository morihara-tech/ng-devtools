/**
 * Pre-build script: converts locally-synced article Markdown into the
 * generated JSON consumed by `ArticleDetailComponent`, `ArticlesPageComponent`,
 * `ArticlesCardComponent` and `articles-page.routes.ts`.
 *
 * This script must run BEFORE `ng build`, because the Angular app is
 * configured with `prerender: true` (no `getPrerenderParams`), meaning
 * each route must already be statically registered before `ng build`
 * starts for it to be prerendered. Embedding article HTML after the fact
 * (e.g. in postbuild.mjs) is not possible because the route's index.html
 * would not exist yet.
 *
 * Data flow (see docs/products/articles/architecture.md):
 *   content/articles/<slug>/{ja,en}.md   (synced from S3 in CI; gitignored)
 *     │  gray-matter (frontmatter split)
 *     │  marked (Markdown → HTML, body only)
 *     │  sanitize-html (XSS-safe whitelist)
 *     ▼
 *   src/generated/articles/articles-content.{ja,en}.json
 *     { "<slug>": { "html": "<sanitized HTML>" }, ... }
 *
 * Phase 2 also aggregates each slug's frontmatter (`title`, `summary`,
 * `publishedDate`, `relatedTools`) into a per-locale list file, replacing
 * the old hand-maintained `articles-def.ts` as the source of truth for
 * article metadata:
 *   src/generated/articles/articles-list.{ja,en}.json
 *     [{ slug, routerLink, title, summary, publishedDate, relatedTools }, ...]
 *
 * `publishedDate` and `relatedTools` are locale-independent, but the list is
 * still split per locale (matching the `articles-content.{ja,en}.json`
 * pattern) so the list page/card can show the title/summary in the active
 * locale without re-deriving it at runtime, and so missing-translation
 * frontmatter is caught at build time per locale.
 *
 * Local development fallback: if `content/` does not exist at all, this is
 * treated as "no Markdown-sourced articles configured yet" and the script
 * exits successfully without generating anything (empty placeholders only).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const CONTENT_DIR = 'content/articles';
const OUTPUT_DIR = 'src/generated/articles';
const LOCALES = ['ja', 'en'];

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4',
    'p', 'ul', 'ol', 'li',
    'strong', 'em', 'code', 'pre',
    'a', 'blockquote',
  ],
  allowedAttributes: {
    a: ['href'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

function fail(message) {
  console.error(`[prebuild-articles] ERROR: ${message}`);
  process.exit(1);
}

/**
 * Writes empty placeholders for every locale (`{}` for content,
 * `[]` for the list). Used for the "nothing to generate" fallback paths.
 * The placeholders are committed to the repo (see .gitignore) so
 * `yarn start` / type-checking works even if this script hasn't run yet;
 * a real prebuild run overwrites them with actual content.
 */
function writeEmptyPlaceholders() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    writeFileSync(join(OUTPUT_DIR, `articles-content.${locale}.json`), '{}\n', 'utf-8');
    writeFileSync(join(OUTPUT_DIR, `articles-list.${locale}.json`), '[]\n', 'utf-8');
  }
}

if (!existsSync(CONTENT_DIR)) {
  console.log(
    `[prebuild-articles] ${CONTENT_DIR} not found — no Markdown-sourced articles to generate. ` +
    `Falling back to empty article list/content.`,
  );
  writeEmptyPlaceholders();
  process.exit(0);
}

const slugDirs = readdirSync(CONTENT_DIR).filter((name) => statSync(join(CONTENT_DIR, name)).isDirectory());

if (slugDirs.length === 0) {
  console.log(`[prebuild-articles] ${CONTENT_DIR} is empty — nothing to generate.`);
  writeEmptyPlaceholders();
  process.exit(0);
}

/** @type {Record<string, Record<string, { html: string }>>} */
const contentByLocale = { ja: {}, en: {} };

/** @type {Record<string, Array<{slug: string, routerLink: string, title: string, summary: string, publishedDate: string, relatedTools: string[]}>>} */
const listByLocale = { ja: [], en: [] };

function requireFrontmatterField(data, field, slug, locale) {
  const value = data[field];
  if (value === undefined || value === null || value === '') {
    fail(
      `content/articles/${slug}/${locale}.md is missing required frontmatter field "${field}". ` +
      `Every article must declare title, summary, publishedDate and relatedTools in frontmatter.`,
    );
  }
  return value;
}

for (const slug of slugDirs) {
  const slugDir = join(CONTENT_DIR, slug);
  const jaPath = join(slugDir, 'ja.md');
  const enPath = join(slugDir, 'en.md');

  if (!existsSync(jaPath)) {
    fail(
      `content/articles/${slug}/ja.md is missing. Every article slug folder must contain ` +
      `a ja.md (source locale). Aborting build.`,
    );
  }

  if (!existsSync(enPath)) {
    fail(
      `content/articles/${slug}/en.md is missing. Every article slug folder must contain ` +
      `both ja.md and en.md. Add the English translation and re-run the build.`,
    );
  }

  const routerLink = `/articles/${slug}`;

  for (const locale of LOCALES) {
    const filePath = join(slugDir, `${locale}.md`);
    const raw = readFileSync(filePath, 'utf-8');

    const { content, data } = matter(raw);

    const title = requireFrontmatterField(data, 'title', slug, locale);
    const summary = requireFrontmatterField(data, 'summary', slug, locale);
    const publishedDate = requireFrontmatterField(data, 'publishedDate', slug, locale);
    const relatedTools = requireFrontmatterField(data, 'relatedTools', slug, locale);

    const html = marked.parse(content, { async: false });
    const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);

    contentByLocale[locale][slug] = { html: sanitized };

    listByLocale[locale].push({
      slug,
      routerLink,
      title: String(title),
      summary: String(summary),
      publishedDate: publishedDate instanceof Date ? publishedDate.toISOString().slice(0, 10) : String(publishedDate),
      relatedTools,
    });
  }

  console.log(`[prebuild-articles] Generated content for slug "${slug}" (ja, en).`);
}

for (const locale of LOCALES) {
  listByLocale[locale].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const locale of LOCALES) {
  const contentPath = join(OUTPUT_DIR, `articles-content.${locale}.json`);
  writeFileSync(contentPath, JSON.stringify(contentByLocale[locale], null, 2), 'utf-8');
  console.log(`[prebuild-articles] Wrote ${contentPath}`);

  const listPath = join(OUTPUT_DIR, `articles-list.${locale}.json`);
  writeFileSync(listPath, JSON.stringify(listByLocale[locale], null, 2), 'utf-8');
  console.log(`[prebuild-articles] Wrote ${listPath}`);
}
