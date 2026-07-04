/**
 * Post-build script: adjusts asset placement for S3 hosting.
 *
 * After an i18n build Angular places all public assets under each locale
 * directory (e.g. browser/ja/, browser/en/).  S3 serves a top-level 404.html
 * for paths that don't match any object, so we need that file at the browser
 * root – not inside a locale prefix.
 *
 * This script:
 *  1. Copies 404.html from the first locale directory to the browser root.
 *  2. Deletes 404.html from every locale directory (it must NOT live there).
 *  3. Copies favicon files from the first locale directory to the browser root
 *     (they remain in the locale directories as well).
 *  4. Injects the Google AdSense <script> tag into every locale's index.html.
 *     The client ID is read from environment.ts so it stays the single source
 *     of truth.
 *  5. Injects canonical and hreflang <link> tags into every locale's index.html.
 *  6. Injects OGP <meta property="og:..."> tags into every locale's index.html.
 *  7. Generates sitemap.xml at the browser root listing all indexable URLs,
 *     with a per-URL <lastmod> resolved from the actual last-modified date of
 *     each page's source (git log for static pages, article frontmatter for
 *     article pages). See docs/products/sitemap-lastmod/architecture.md.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { execFileSync } from 'node:child_process';
import { join } from 'path';

const BROWSER_DIR = 'dist/ng-devtools/browser';
const LOCALES = ['ja', 'en'];
const FAVICON_FILES = ['favicon.ico', 'favicon.svg', 'icon-192x192.png', 'icon-512x512.png'];

if (!existsSync(BROWSER_DIR)) {
  console.error(`Build output not found: ${BROWSER_DIR}`);
  process.exit(1);
}

// 1. Copy 404.html to root and remove it from all locale dirs
let copiedRoot = false;
for (const locale of LOCALES) {
  const src = join(BROWSER_DIR, locale, '404.html');
  if (!existsSync(src)) continue;

  if (!copiedRoot) {
    copyFileSync(src, join(BROWSER_DIR, '404.html'));
    console.log(`Copied 404.html → ${BROWSER_DIR}/`);
    copiedRoot = true;
  }

  unlinkSync(src);
  console.log(`Removed ${BROWSER_DIR}/${locale}/404.html`);
}

if (!copiedRoot) {
  console.warn('404.html was not found in any locale directory — skipping root copy.');
}

// 2. Copy favicon files to root (locale copies are kept intact)

/**
 * Returns the first existing path for `file` across the given locale dirs,
 * or `null` if the file is absent in every locale.
 */
function findFileInLocales(file, locales, baseDir) {
  for (const locale of locales) {
    const candidate = join(baseDir, locale, file);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

for (const file of FAVICON_FILES) {
  const src = findFileInLocales(file, LOCALES, BROWSER_DIR);
  if (!src) {
    console.warn(`${file} not found in any locale directory — skipping.`);
    continue;
  }

  copyFileSync(src, join(BROWSER_DIR, file));
  console.log(`Copied ${file} → ${BROWSER_DIR}/`);
}

// 2b. Copy robots.txt to root (must be served from the domain root, not under a locale prefix)
const robotsSrc = findFileInLocales('robots.txt', LOCALES, BROWSER_DIR);
if (robotsSrc) {
  copyFileSync(robotsSrc, join(BROWSER_DIR, 'robots.txt'));
  console.log(`Copied robots.txt → ${BROWSER_DIR}/`);
} else {
  console.warn('robots.txt not found in any locale directory — skipping.');
}

// 3. Inject AdSense <script> into every index.html under every locale dir.
//    Read clientId from environment.ts to keep a single source of truth.

const ENV_FILE = 'src/environments/environment.ts';
const envSource = readFileSync(ENV_FILE, 'utf-8');
const clientIdMatch = envSource.match(/clientId:\s*'([^']+)'/);
if (!clientIdMatch) {
  console.warn('AdSense clientId not found in environment.ts — skipping AdSense injection.');
} else {
  const clientId = clientIdMatch[1];
  const adsenseTag = `  <!-- Google AdSense -->\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}" crossorigin="anonymous"></script>\n`;

  for (const locale of LOCALES) {
    const localeDir = join(BROWSER_DIR, locale);
    if (!existsSync(localeDir)) {
      console.warn(`Locale directory not found: ${localeDir} — skipping.`);
      continue;
    }

    // Recursively find all index.html files under the locale directory.
    const allFiles = readdirSync(localeDir, { recursive: true, withFileTypes: false });
    const indexFiles = /** @type {string[]} */ (allFiles)
      .filter((f) => f === 'index.html' || f.endsWith('/index.html') || f.endsWith('\\index.html'))
      .map((f) => join(localeDir, f));

    for (const indexPath of indexFiles) {
      const html = readFileSync(indexPath, 'utf-8');
      if (html.includes('adsbygoogle.js')) {
        console.log(`AdSense already present in ${indexPath} — skipping.`);
        continue;
      }

      const injected = html.replace('</head>', `${adsenseTag}</head>`);
      writeFileSync(indexPath, injected, 'utf-8');
      console.log(`Injected AdSense into ${indexPath}`);
    }
  }
}

// 5. Inject canonical and hreflang <link> tags into every index.html under every locale dir.
//    BASE_URL is read from environment.ts so it stays the single source of truth shared
//    with src/app/core/services/structured-data.service.ts (Angular side). It can be
//    overridden per-environment (e.g. staging/preview) via the BASE_URL env var, which
//    takes precedence when set — useful for future GitHub Actions injection without
//    touching environment.ts.

const baseUrlMatch = envSource.match(/baseUrl:\s*'([^']+)'/);
if (!baseUrlMatch) {
  console.error('site.baseUrl not found in environment.ts — cannot generate canonical/hreflang/sitemap URLs.');
  process.exit(1);
}
const BASE_URL = process.env.BASE_URL || baseUrlMatch[1];

/**
 * Removes a single trailing slash from a path, except for the root path "/"
 * which is left untouched (BASE_URL + "/" is the canonical home URL).
 */
function stripTrailingSlash(urlPath) {
  if (urlPath === '/') return urlPath;
  return urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
}

for (const locale of LOCALES) {
  const localeDir = join(BROWSER_DIR, locale);
  if (!existsSync(localeDir)) continue;

  const allFiles = readdirSync(localeDir, { recursive: true, withFileTypes: false });
  const indexFiles = /** @type {string[]} */ (allFiles)
    .filter((f) => f === 'index.html' || f.endsWith('/index.html') || f.endsWith('\\index.html'))
    .map((f) => join(localeDir, f));

  for (const indexPath of indexFiles) {
    // Skip error pages — they should not be indexed.
    if (indexPath.replace(/\\/g, '/').includes('/error/')) continue;

    const html = readFileSync(indexPath, 'utf-8');
    if (html.includes('rel="canonical"')) {
      console.log(`Canonical already present in ${indexPath} — skipping.`);
      continue;
    }

    // Derive the URL path from the file path.
    // e.g. dist/ng-devtools/browser/ja/json-formatter/index.html → /ja/json-formatter
    // Trailing slashes are intentionally omitted to match the in-app routerLink
    // format (e.g. routerLink="/json-formatter"), so that canonical/sitemap URLs
    // line up with the URLs Googlebot discovers by following internal links.
    const relativePath = indexPath.slice(BROWSER_DIR.length + 1).replace(/\\/g, '/');
    const urlPath = stripTrailingSlash('/' + relativePath.replace(/index\.html$/, ''));

    const altLocale = locale === 'ja' ? 'en' : 'ja';
    const altUrlPath = urlPath.replace(`/${locale}`, `/${altLocale}`);

    const tags = [
      `  <link rel="canonical" href="${BASE_URL}${urlPath}">`,
      `  <link rel="alternate" hreflang="${locale}" href="${BASE_URL}${urlPath}">`,
      `  <link rel="alternate" hreflang="${altLocale}" href="${BASE_URL}${altUrlPath}">`,
      `  <link rel="alternate" hreflang="x-default" href="${BASE_URL}/ja">`,
    ].join('\n');

    const injected = html.replace('</head>', `${tags}\n</head>`);
    writeFileSync(indexPath, injected, 'utf-8');
    console.log(`Injected canonical/hreflang into ${indexPath}`);
  }
}

// 6. Inject OGP <meta property="og:..."> tags into every locale's index.html.
//    Runs after step 5 so that canonical URL is already present in the HTML.

/** Extracts the text content of the first matching HTML tag. */
function extractTagContent(html, tagPattern) {
  const match = html.match(tagPattern);
  return match ? match[1] : null;
}

for (const locale of LOCALES) {
  const localeDir = join(BROWSER_DIR, locale);
  if (!existsSync(localeDir)) continue;

  const allFiles = readdirSync(localeDir, { recursive: true, withFileTypes: false });
  const indexFiles = /** @type {string[]} */ (allFiles)
    .filter((f) => f === 'index.html' || f.endsWith('/index.html') || f.endsWith('\\index.html'))
    .map((f) => join(localeDir, f));

  for (const indexPath of indexFiles) {
    if (indexPath.replace(/\\/g, '/').includes('/error/')) continue;

    const html = readFileSync(indexPath, 'utf-8');
    if (html.includes('property="og:title"')) {
      console.log(`OGP already present in ${indexPath} — skipping.`);
      continue;
    }

    const title = extractTagContent(html, /<title>([^<]+)<\/title>/);
    const description = extractTagContent(html, /<meta name="description" content="([^"]+)"/);
    const canonicalUrl = extractTagContent(html, /<link rel="canonical" href="([^"]+)"/);

    if (!title || !canonicalUrl) {
      console.warn(`Missing title or canonical in ${indexPath} — skipping OGP injection.`);
      continue;
    }

    const ogTags = [
      `  <meta property="og:type" content="website">`,
      `  <meta property="og:site_name" content="devTools">`,
      `  <meta property="og:title" content="${title}">`,
      `  <meta property="og:url" content="${canonicalUrl}">`,
      ...(description ? [`  <meta property="og:description" content="${description}">`] : []),
    ].join('\n');

    const injected = html.replace('</head>', `${ogTags}\n</head>`);
    writeFileSync(indexPath, injected, 'utf-8');
    console.log(`Injected OGP into ${indexPath}`);
  }
}

// 7. Generate sitemap.xml at the browser root listing all indexable URLs.
//
// Each URL's <lastmod> is resolved from the actual last-modified date of the
// page's source, not a single build-wide timestamp — see
// docs/products/sitemap-lastmod/architecture.md for the rationale.
//
// - Static pages (tool pages, top page, /menu, /guide, etc.): the most recent
//   `git log` commit date across the page's source files (PAGE_SOURCE_MAP).
// - Article detail pages (/articles/<slug>): `updatedDate ?? publishedDate`
//   from the generated articles-list.{locale}.json.
// - Article list page (/articles): the max of the above across all articles.
// - Fallback (unregistered URL, git failure, no history, etc.): the build
//   date (today), scoped to that single URL only. The build must not fail.

const BUILD_DATE_FALLBACK = new Date().toISOString().slice(0, 10);

/**
 * Maps a locale-agnostic urlPath (e.g. "/json-formatter", "/", "/menu") to
 * the source paths whose most recent commit determines that page's lastmod.
 * Deliberately explicit (no auto-derivation from the urlPath) because
 * urlPath ↔ directory-name conventions have exceptions (e.g. the
 * `password-generator` route maps to the `password-gen-page` directory).
 * Shared shell UI (header/footer) and messages.en.xlf are intentionally
 * excluded — see the architecture doc's "除外事項".
 *
 * NOTE: keep this in sync with src/app/app.routes.ts / src/app/pages/. A
 * missing entry does not break the build — it just falls back to the build
 * date for that one URL (see resolveLastmod below).
 */
const MENU_DEF_PATH = 'src/resources/menu/def/menu-def.ts';

const PAGE_SOURCE_MAP = {
  '/': ['src/app/pages/dashboard-page', MENU_DEF_PATH],
  '/menu': ['src/app/pages/menu-page', MENU_DEF_PATH],
  '/guide': ['src/app/pages/guide-page'],
  '/ulid-generator': ['src/app/pages/ulid-gen-page'],
  '/uuid-generator': ['src/app/pages/uuid-gen-page'],
  '/json-formatter': ['src/app/pages/json-formatter-page'],
  '/sql-formatter': ['src/app/pages/sql-formatter-page'],
  '/password-generator': ['src/app/pages/password-gen-page'],
  '/api-key-generator': ['src/app/pages/api-key-gen-page'],
  '/svg-to-png': ['src/app/pages/svg-to-png-page'],
  '/ip-cidr-calculator': ['src/app/pages/ip-cidr-calculator-page'],
  '/url-encoder': ['src/app/pages/url-encoder-page'],
  '/unix-timestamp-converter': ['src/app/pages/unix-timestamp-converter-page'],
  '/text-diff': ['src/app/pages/text-diff-page'],
  '/color-palette': ['src/app/pages/color-palette-page'],
  '/privacy-policy': ['src/app/pages/privacy-policy-page'],
  '/operator-info': ['src/app/pages/operator-info-page'],
};

const ARTICLES_LIST_DIR = 'src/generated/articles';
const articlesListCache = {};

/** Reads (and caches) src/generated/articles/articles-list.{locale}.json. */
function getArticlesList(locale) {
  if (articlesListCache[locale]) return articlesListCache[locale];

  const listPath = join(ARTICLES_LIST_DIR, `articles-list.${locale}.json`);
  if (!existsSync(listPath)) {
    articlesListCache[locale] = [];
    return articlesListCache[locale];
  }

  try {
    const list = JSON.parse(readFileSync(listPath, 'utf-8'));
    articlesListCache[locale] = Array.isArray(list) ? list : [];
  } catch {
    articlesListCache[locale] = [];
  }
  return articlesListCache[locale];
}

/**
 * Builds the pathspec list for `git log`, excluding *.spec.ts files from any
 * directory entries (files passed as-is, e.g. menu-def.ts).
 */
function buildGitPathspecs(paths) {
  const specs = [];
  for (const path of paths) {
    let isDirectory = false;
    try {
      isDirectory = statSync(path).isDirectory();
    } catch {
      // Path doesn't exist on disk (shouldn't normally happen) — still pass
      // it through to git log, which will simply find no matches for it.
    }
    specs.push(path);
    if (isDirectory) {
      specs.push(`:(exclude)${path}/**/*.spec.ts`);
    }
  }
  return specs;
}

/**
 * Returns the YYYY-MM-DD date of the most recent commit touching any of the
 * given source paths, or null if git fails or reports no history.
 */
function gitLastCommitDate(paths) {
  try {
    const specs = buildGitPathspecs(paths);
    const output = execFileSync('git', ['log', '-1', '--format=%ai', '--', ...specs], {
      encoding: 'utf-8',
    }).trim();
    if (!output) return null;
    return output.slice(0, 10); // "%ai" → "YYYY-MM-DD HH:MM:SS +ZZZZ"
  } catch {
    return null;
  }
}

/** Returns `updatedDate ?? publishedDate` for the article with the given slug, or null. */
function articleLastmod(locale, slug) {
  const entry = getArticlesList(locale).find((a) => a.slug === slug);
  if (!entry) return null;
  return entry.updatedDate ?? entry.publishedDate ?? null;
}

/** Returns the max `updatedDate ?? publishedDate` across all articles, or null. */
function articlesListLastmod(locale) {
  const dates = getArticlesList(locale)
    .map((a) => a.updatedDate ?? a.publishedDate)
    .filter((d) => typeof d === 'string' && d.length > 0);
  if (dates.length === 0) return null;
  return dates.reduce((max, d) => (d > max ? d : max));
}

/**
 * Resolves the sitemap <lastmod> for a locale-agnostic urlPath (no locale
 * prefix, e.g. "/json-formatter", "/articles/foo"). Never throws — falls
 * back to the build date (scoped to this one URL) and logs why.
 */
function resolveLastmod(urlPath, locale) {
  const warnFallback = (reason) => {
    console.warn(`[sitemap] ${urlPath} (${locale}): ${reason} — falling back to build date.`);
    return BUILD_DATE_FALLBACK;
  };

  if (urlPath === '/articles') {
    const date = articlesListLastmod(locale);
    return date ?? warnFallback('no article entries with a valid date');
  }

  const articleMatch = urlPath.match(/^\/articles\/(.+)$/);
  if (articleMatch) {
    const slug = articleMatch[1];
    const date = articleLastmod(locale, slug);
    return date ?? warnFallback(`no articles-list entry (or date) for slug "${slug}"`);
  }

  const sourcePaths = PAGE_SOURCE_MAP[urlPath];
  if (!sourcePaths) {
    return warnFallback('not registered in PAGE_SOURCE_MAP');
  }

  const date = gitLastCommitDate(sourcePaths);
  return date ?? warnFallback('git log returned no history for its source paths');
}

/** Strips the "/ja" or "/en" locale prefix from a urlPath, e.g. "/ja/menu" → "/menu", "/ja" → "/". */
function stripLocalePrefix(urlPath, locale) {
  const prefix = `/${locale}`;
  if (urlPath === prefix) return '/';
  if (urlPath.startsWith(`${prefix}/`)) return urlPath.slice(prefix.length);
  return urlPath;
}

const sitemapEntries = [];

for (const locale of LOCALES) {
  const localeDir = join(BROWSER_DIR, locale);
  if (!existsSync(localeDir)) continue;

  const allFiles = readdirSync(localeDir, { recursive: true, withFileTypes: false });
  const indexFiles = /** @type {string[]} */ (allFiles)
    .filter((f) => f === 'index.html' || f.endsWith('/index.html') || f.endsWith('\\index.html'))
    .map((f) => join(localeDir, f));

  for (const indexPath of indexFiles) {
    if (indexPath.replace(/\\/g, '/').includes('/error/')) continue;

    const relativePath = indexPath.slice(BROWSER_DIR.length + 1).replace(/\\/g, '/');
    const urlPath = stripTrailingSlash('/' + relativePath.replace(/index\.html$/, ''));
    const barePath = stripLocalePrefix(urlPath, locale);

    const lastmod = resolveLastmod(barePath, locale);
    sitemapEntries.push({ loc: `${BASE_URL}${urlPath}`, lastmod });
  }
}

const urlEntries = sitemapEntries
  .map(({ loc, lastmod }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
writeFileSync(join(BROWSER_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`Generated sitemap.xml with ${sitemapEntries.length} URLs → ${BROWSER_DIR}/sitemap.xml`);
