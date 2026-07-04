/**
 * Layer B contract tests for Issue #194's URL-consistency verification.
 *
 * Uses Node's built-in test runner (`node --test`) and `assert` only — no
 * added npm dependencies. Run with:
 *
 *   node --test tests/url-consistency/
 *
 * What this proves:
 *  - "Normal" case: the URL set this repo actually publishes (sitemap.xml
 *    <loc> + every page's canonical/hreflang URLs — taken from a real
 *    `dist/ng-devtools/browser` build when present, otherwise a small
 *    representative sample) all resolve to 200 against a server that
 *    behaves exactly like the production CloudFront Function
 *    (tests/url-consistency/mock-cloudfront-function.mjs, itself driven by
 *    scripts/url-policy.mjs).
 *  - "Abnormal" case: if a canonical URL were accidentally emitted with a
 *    trailing slash under a locale prefix (e.g. "/ja/json-formatter/"
 *    instead of "/ja/json-formatter") — exactly the kind of regression this
 *    whole feature exists to catch — the shared judgment logic
 *    (`checkUrls` from scripts/verify-production-urls.mjs, also used by
 *    Layer C in production) detects it and reports a failure. This test is
 *    a standing guarantee that the detection logic still fires; if it ever
 *    stops failing on a redirect-bound URL, that's a regression in the
 *    verification tooling itself.
 */

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { after, before, describe, test } from 'node:test';
import { checkUrls, collectTargetUrls, resolveBaseUrl } from '../../scripts/verify-production-urls.mjs';
import { startMockCloudFrontServer } from './mock-cloudfront-function.mjs';

const DIST_DIR = 'dist/ng-devtools/browser';

/** Rewrites a URL's origin from `fromBaseUrl` to `toBaseUrl`, keeping the path. */
function rewriteOrigin(url, fromBaseUrl, toBaseUrl) {
  if (!url.startsWith(fromBaseUrl)) {
    throw new Error(`URL "${url}" does not start with expected origin "${fromBaseUrl}"`);
  }
  return toBaseUrl + url.slice(fromBaseUrl.length);
}

/**
 * Returns the URL set to validate against the mock server: the real build
 * output when available (so the test reflects what actually ships), or a
 * small representative sample otherwise (e.g. when running this test
 * without having built the app first).
 */
function getSourceUrls(realBaseUrl) {
  if (existsSync(`${DIST_DIR}/sitemap.xml`)) {
    return collectTargetUrls(DIST_DIR);
  }

  return [
    `${realBaseUrl}/ja`,
    `${realBaseUrl}/en`,
    `${realBaseUrl}/ja/json-formatter`,
    `${realBaseUrl}/en/json-formatter`,
    `${realBaseUrl}/ja/menu`,
    `${realBaseUrl}/en/menu`,
  ];
}

describe('Layer B: contract test for the URL-consistency detection logic', () => {
  /** @type {import('node:http').Server} */
  let server;
  /** @type {string} */
  let mockBaseUrl;
  /** @type {string} */
  let realBaseUrl;
  /** @type {string[]} */
  let sourceUrls;

  before(async () => {
    ({ server, baseUrl: mockBaseUrl } = await startMockCloudFrontServer());
    realBaseUrl = resolveBaseUrl();
    sourceUrls = getSourceUrls(realBaseUrl);
    assert.ok(sourceUrls.length > 0, 'expected at least one source URL to validate');
  });

  after(() => {
    server.close();
  });

  test('normal case: every published URL resolves to 200 against the mock CloudFront Function', async () => {
    const urlsAgainstMock = sourceUrls.map((url) => rewriteOrigin(url, realBaseUrl, mockBaseUrl));

    const failures = await checkUrls(urlsAgainstMock, { fetchImpl: fetch, retries: 0 });

    assert.deepEqual(
      failures,
      [],
      `expected all URLs to resolve 200, but got failures: ${JSON.stringify(failures, null, 2)}`,
    );
  });

  test('abnormal case: a canonical URL rewritten with a trailing slash under a locale prefix is detected as a redirect', async () => {
    // Take one real "/ja/..." or "/en/..." URL and corrupt it into the exact
    // shape the CloudFront Function 301s away from (trailing slash under a
    // locale prefix) — simulating a regression where postbuild.mjs (or a
    // future change) starts emitting trailing-slash URLs again.
    const localeUrl = sourceUrls.find((url) => /\/(ja|en)(\/|$)/.test(url.slice(realBaseUrl.length)));
    assert.ok(localeUrl, 'expected at least one locale-prefixed source URL to corrupt for this test');

    const corruptedUrl = localeUrl.endsWith('/') ? localeUrl : `${localeUrl}/`;
    const urlsAgainstMock = [rewriteOrigin(corruptedUrl, realBaseUrl, mockBaseUrl)];

    const failures = await checkUrls(urlsAgainstMock, { fetchImpl: fetch, retries: 0 });

    assert.equal(failures.length, 1, 'expected the corrupted trailing-slash URL to be detected as a failure');
    assert.equal(failures[0].status, 301, 'expected the mock CloudFront Function to respond 301 for the corrupted URL');
  });
});
