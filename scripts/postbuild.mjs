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
 *  7. Generates sitemap.xml at the browser root listing all indexable URLs.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
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

const BASE_URL = 'https://devtools.morihara.tech';

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
    // e.g. dist/ng-devtools/browser/ja/json-formatter/index.html → /ja/json-formatter/
    const relativePath = indexPath.slice(BROWSER_DIR.length + 1).replace(/\\/g, '/');
    const urlPath = '/' + relativePath.replace(/index\.html$/, '');

    const altLocale = locale === 'ja' ? 'en' : 'ja';
    const altUrlPath = urlPath.replace(`/${locale}/`, `/${altLocale}/`);

    const tags = [
      `  <link rel="canonical" href="${BASE_URL}${urlPath}">`,
      `  <link rel="alternate" hreflang="${locale}" href="${BASE_URL}${urlPath}">`,
      `  <link rel="alternate" hreflang="${altLocale}" href="${BASE_URL}${altUrlPath}">`,
      `  <link rel="alternate" hreflang="x-default" href="${BASE_URL}/ja/">`,
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

const lastmod = new Date().toISOString().slice(0, 10);
const sitemapUrls = [];

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
    const urlPath = '/' + relativePath.replace(/index\.html$/, '');
    sitemapUrls.push(`${BASE_URL}${urlPath}`);
  }
}

const urlEntries = sitemapUrls
  .map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
writeFileSync(join(BROWSER_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`Generated sitemap.xml with ${sitemapUrls.length} URLs → ${BROWSER_DIR}/sitemap.xml`);
