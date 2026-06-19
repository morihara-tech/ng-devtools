/**
 * Pre-build script: converts locally-synced article Markdown into the
 * generated JSON consumed by `ArticleDetailComponent`.
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
 *     │  gray-matter (frontmatter split; unused in MVP but parsed for future use)
 *     │  marked (Markdown → HTML)
 *     │  sanitize-html (XSS-safe whitelist)
 *     ▼
 *   src/generated/articles/articles-content.{ja,en}.json
 *     { "<slug>": { "html": "<sanitized HTML>" }, ... }
 *
 * Local development fallback: if `content/` does not exist at all, this is
 * treated as "no Markdown-sourced articles configured yet" and the script
 * exits successfully without generating anything — articles continue to be
 * served by their existing hand-written components.
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
 * Writes empty `{}` placeholders for every locale. Used for the "nothing to
 * generate" fallback paths. The placeholders are committed to the repo (see
 * .gitignore) so `yarn start` / type-checking works even if this script
 * hasn't run yet; a real prebuild run overwrites them with actual content.
 */
function writeEmptyPlaceholders() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    const outPath = join(OUTPUT_DIR, `articles-content.${locale}.json`);
    writeFileSync(outPath, '{}\n', 'utf-8');
  }
}

if (!existsSync(CONTENT_DIR)) {
  console.log(
    `[prebuild-articles] ${CONTENT_DIR} not found — no Markdown-sourced articles to generate. ` +
    `Falling back to existing hand-written article components only.`,
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

  for (const locale of LOCALES) {
    const filePath = join(slugDir, `${locale}.md`);
    const raw = readFileSync(filePath, 'utf-8');

    // Parse frontmatter even though the MVP doesn't use it yet, so the
    // pipeline is ready for Phase 2 (frontmatter-driven metadata).
    const { content } = matter(raw);

    const html = marked.parse(content, { async: false });
    const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS);

    contentByLocale[locale][slug] = { html: sanitized };
  }

  console.log(`[prebuild-articles] Generated content for slug "${slug}" (ja, en).`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const locale of LOCALES) {
  const outPath = join(OUTPUT_DIR, `articles-content.${locale}.json`);
  writeFileSync(outPath, JSON.stringify(contentByLocale[locale], null, 2), 'utf-8');
  console.log(`[prebuild-articles] Wrote ${outPath}`);
}
