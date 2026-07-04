/**
 * Layer A of the URL-consistency verification (see Issue #194 /
 * docs/core/tech/ci-url-consistency-verification.md).
 *
 * Statically inspects the build output under dist/ng-devtools/browser and
 * checks that every canonical URL, hreflang alternate URL, same-origin
 * internal <a href> link, and sitemap.xml <loc> entry points at a URL that
 * would NOT be 301-redirected by the production CloudFront Function (see
 * scripts/url-policy.mjs for the mirrored redirect rules). If any of those
 * URLs point at a path that redirects, Google (and users) would have to
 * follow a redirect hop to reach the "real" page, which defeats the point of
 * publishing a canonical/hreflang/sitemap URL in the first place.
 *
 * This script intentionally does NOT use a DOM parser — it follows the same
 * regex-based extraction approach as scripts/postbuild.mjs (which generates
 * the very tags this script verifies), so both scripts share a mental model
 * of the HTML shape and only Node's standard library is required (no added
 * npm dependencies).
 *
 * Usage: node scripts/verify-url-consistency.mjs
 * Exit code: 0 if no inconsistency found, 1 otherwise (also emits
 * `::error::` GitHub Actions annotations for each problem found).
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { willRedirect } from './url-policy.mjs';

const BROWSER_DIR = 'dist/ng-devtools/browser';
const LOCALES = ['ja', 'en'];

/**
 * Pre-existing, already-tracked internal-link findings that this script
 * would otherwise fail the build on. These are real: they were discovered
 * while building Layer A for the first time (see
 * https://github.com/morihara-tech/ng-devtools/issues/204) and are caused
 * by an Angular Router quirk — RouterLink to the root path ("/") serializes
 * to the app's literal `<base href>` (e.g. "/ja/", trailing slash and all)
 * rather than the trailing-slash-free canonical form ("/ja"). Fixing that
 * requires an application-code (routing/template) change, which is outside
 * this CI/CD task's scope.
 *
 * This allowlist intentionally applies ONLY to the internal-<a href> check
 * (not to canonical/hreflang/sitemap, which are authored by postbuild.mjs
 * and have no legitimate reason to ever appear here) so that:
 *   - this one pre-existing, already-filed gap doesn't block unrelated PRs
 *     the moment this CI job is turned on, while
 *   - any NEW internal link pointing at a redirect-bound URL still fails
 *     the build loudly.
 *
 * Remove an entry (and this comment can shrink accordingly) once the
 * linked issue is fixed.
 */
const KNOWN_LEGACY_REDIRECT_INTERNAL_LINKS = new Set(['/ja/', '/en/']);

/** Returns the path component of a URL (or path) — everything after the origin. */
function toPath(urlOrPath) {
  const originMatch = urlOrPath.match(/^[a-z]+:\/\/[^/]+(\/.*)?$/i);
  return originMatch ? (originMatch[1] ?? '/') : urlOrPath;
}

/** Reads BASE_URL the same way scripts/postbuild.mjs does, from environment.ts. */
function resolveBaseUrl() {
  const ENV_FILE = 'src/environments/environment.ts';
  const envSource = readFileSync(ENV_FILE, 'utf-8');
  const baseUrlMatch = envSource.match(/baseUrl:\s*'([^']+)'/);
  if (!baseUrlMatch) {
    throw new Error(`site.baseUrl not found in ${ENV_FILE}`);
  }
  return process.env.BASE_URL || baseUrlMatch[1];
}

/** Recursively collects every index.html under `dir`, excluding /error/ pages. */
function findIndexHtmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const allFiles = readdirSync(dir, { recursive: true, withFileTypes: false });
  return /** @type {string[]} */ (allFiles)
    .filter((f) => f === 'index.html' || f.endsWith('/index.html') || f.endsWith('\\index.html'))
    .map((f) => join(dir, f))
    .filter((f) => !f.replace(/\\/g, '/').includes('/error/'));
}

/** Extracts all `href="..."` values for `<link rel="canonical">` tags. */
function extractCanonicalUrls(html) {
  const matches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)];
  return matches.map((m) => m[1]);
}

/** Extracts all `href="..."` values for `<link rel="alternate" hreflang="...">` tags. */
function extractHreflangUrls(html) {
  const matches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)];
  return matches.map((m) => ({ hreflang: m[1], url: m[2] }));
}

/**
 * Extracts same-origin internal <a href="..."> links, i.e. links that start
 * with "/" (root-relative) or with BASE_URL. External links, mailto:,
 * fragment-only links (#...), and asset links are ignored.
 */
function extractInternalLinks(html, baseUrl) {
  const hrefs = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const internal = [];
  for (const href of hrefs) {
    if (href.startsWith(baseUrl)) {
      internal.push(href);
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      internal.push(`${baseUrl}${href}`);
    }
  }
  return internal;
}

/** Extracts every `<loc>...</loc>` entry from a sitemap.xml document. */
function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function main() {
  const baseUrl = resolveBaseUrl();
  /** @type {string[]} */
  const errors = [];

  // --- Check every index.html's canonical / hreflang / internal links ---
  for (const locale of LOCALES) {
    const localeDir = join(BROWSER_DIR, locale);
    for (const indexPath of findIndexHtmlFiles(localeDir)) {
      const html = readFileSync(indexPath, 'utf-8');

      for (const url of extractCanonicalUrls(html)) {
        if (willRedirect(url)) {
          errors.push(`${indexPath}: canonical URL "${url}" would be 301-redirected by CloudFront.`);
        }
      }

      for (const { hreflang, url } of extractHreflangUrls(html)) {
        if (willRedirect(url)) {
          errors.push(`${indexPath}: hreflang="${hreflang}" URL "${url}" would be 301-redirected by CloudFront.`);
        }
      }

      for (const url of extractInternalLinks(html, baseUrl)) {
        if (!willRedirect(url)) continue;

        if (KNOWN_LEGACY_REDIRECT_INTERNAL_LINKS.has(toPath(url))) {
          console.warn(
            `[known-issue #204] ${indexPath}: internal link "${url}" would be 301-redirected by CloudFront ` +
              '(pre-existing, tracked — see https://github.com/morihara-tech/ng-devtools/issues/204).',
          );
          continue;
        }

        errors.push(`${indexPath}: internal link "${url}" would be 301-redirected by CloudFront.`);
      }
    }
  }

  // --- Check sitemap.xml ---
  const sitemapPath = join(BROWSER_DIR, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    errors.push(`${sitemapPath}: sitemap.xml not found — did the build run postbuild.mjs?`);
  } else {
    const sitemapXml = readFileSync(sitemapPath, 'utf-8');
    for (const loc of extractSitemapLocs(sitemapXml)) {
      if (willRedirect(loc)) {
        errors.push(`${sitemapPath}: <loc>${loc}</loc> would be 301-redirected by CloudFront.`);
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`::error::${error}`);
    }
    console.error(`\nFound ${errors.length} URL-consistency issue(s).`);
    process.exitCode = 1;
    return;
  }

  console.log('URL consistency check passed: no canonical/hreflang/internal-link/sitemap URL would be redirected.');
}

main();
