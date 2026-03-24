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
 */

import { copyFileSync, existsSync, unlinkSync } from 'fs';
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
