/**
 * Layer C of the URL-consistency verification (see Issue #194 /
 * docs/core/tech/ci-url-consistency-verification.md).
 *
 * Runs against the built artifacts AFTER a real deployment (invoked as a
 * post-CloudFront-Invalidation step in .github/workflows/deployment.yml).
 * Collects every URL that Google/users are expected to be able to reach
 * without a redirect hop — every sitemap.xml <loc> plus every page's
 * canonical/hreflang (including x-default) URL — and performs a real HTTP
 * request against each one with `redirect: 'manual'`, failing the build if
 * anything other than 200 comes back (a 3xx here means production actually
 * disagrees with what Layers A/B predicted, e.g. a CloudFront Function
 * change that scripts/url-policy.mjs hasn't been updated to match).
 *
 * The status-checking logic (`checkUrls`) is exported so that
 * tests/url-consistency/verify-url-consistency.contract.test.mjs (Layer B)
 * can exercise the exact same logic against the mock CloudFront Function
 * server instead of real production, keeping the "does this judge URLs
 * correctly" logic covered by a fast, deterministic, always-on test.
 *
 * Node standard library only (fs, path, fetch — Node 18+). No added npm
 * dependencies.
 *
 * Usage: node scripts/verify-production-urls.mjs
 * Exit code: 0 if every URL returns 200, 1 otherwise (emits `::error::`
 * GitHub Actions annotations). A failure here intentionally does NOT roll
 * back the deployment (S3 sync / CloudFront invalidation have already
 * happened by the time this step runs) — it only turns the workflow run
 * red so a human notices and investigates.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BROWSER_DIR = 'dist/ng-devtools/browser';
const LOCALES = ['ja', 'en'];

/** Reads BASE_URL the same way scripts/postbuild.mjs does, from environment.ts. */
export function resolveBaseUrl() {
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

/**
 * Collects the deduplicated set of URLs that must resolve with a plain 200:
 * every sitemap.xml <loc>, plus every page's canonical and hreflang
 * (including x-default) URLs.
 */
export function collectTargetUrls(browserDir = BROWSER_DIR) {
  const urls = new Set();

  const sitemapPath = join(browserDir, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemapXml = readFileSync(sitemapPath, 'utf-8');
    for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(m[1]);
    }
  }

  for (const locale of LOCALES) {
    const localeDir = join(browserDir, locale);
    for (const indexPath of findIndexHtmlFiles(localeDir)) {
      const html = readFileSync(indexPath, 'utf-8');

      for (const m of html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/g)) {
        urls.add(m[1]);
      }
      for (const m of html.matchAll(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="([^"]+)"/g)) {
        urls.add(m[1]);
      }
    }
  }

  return [...urls];
}

/**
 * Requests every URL in `urls` with `redirect: 'manual'` and reports which
 * ones did NOT come back 200. All URLs are checked before returning (no
 * early return), so a single run reports every failure, not just the first.
 *
 * Retries are a defense against transient network blips when this runs in
 * CI right after a fresh deploy (NOT a wait for CloudFront cache
 * propagation — the invalidation step already ran before this script, so by
 * the time we get here CloudFront should already be serving the new
 * content; retries only exist to ride out an occasional flaky request).
 *
 * @param {string[]} urls
 * @param {object} [options]
 * @param {typeof fetch} [options.fetchImpl] - injectable for tests (Layer B
 *   points this at the mock CloudFront Function server instead of the real
 *   fetch/production).
 * @param {number} [options.retries] - number of retry attempts per URL
 *   after the first try (default 2, i.e. up to 3 attempts total).
 * @param {number} [options.retryDelayMs] - delay between retries (default
 *   10000ms / 10s).
 * @returns {Promise<{url: string, status: number | null, error: string | null}[]>}
 *   the subset of `urls` that did not resolve to 200 (empty if all passed).
 */
export async function checkUrls(urls, options = {}) {
  const { fetchImpl = fetch, retries = 2, retryDelayMs = 10_000 } = options;

  const failures = [];

  for (const url of urls) {
    let lastStatus = null;
    let lastError = null;
    let ok = false;

    for (let attempt = 0; attempt <= retries && !ok; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
      try {
        const response = await fetchImpl(url, { redirect: 'manual' });
        lastStatus = response.status;
        lastError = null;
        if (response.status === 200) {
          ok = true;
        }
      } catch (err) {
        lastStatus = null;
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!ok) {
      failures.push({ url, status: lastStatus, error: lastError });
    }
  }

  return failures;
}

async function main() {
  const urls = collectTargetUrls();

  if (urls.length === 0) {
    console.error('::error::No URLs found to verify (sitemap.xml/canonical/hreflang missing) — did the build run?');
    process.exitCode = 1;
    return;
  }

  console.log(`Verifying ${urls.length} production URL(s) resolve to 200...`);
  const failures = await checkUrls(urls);

  if (failures.length > 0) {
    for (const { url, status, error } of failures) {
      const detail = error ? `request failed: ${error}` : `got HTTP ${status}`;
      console.error(`::error::${url} — expected 200, ${detail}.`);
    }
    console.error(`\nFound ${failures.length} production URL inconsistency(ies) out of ${urls.length} checked.`);
    process.exitCode = 1;
    return;
  }

  console.log(`All ${urls.length} production URL(s) resolved to 200.`);
}

// Only run main() when executed directly (not when imported by tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
