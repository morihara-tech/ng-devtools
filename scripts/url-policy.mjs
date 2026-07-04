/**
 * Single source of truth for the CloudFront Function redirect rules that sit
 * in front of this site (see morihara-tech/build-tools#58 / build-tools#59,
 * aws/devtools/devtools-frontsite.cf.yml). The Function itself lives in a
 * separate repository and is NOT importable from here, so this module
 * mirrors its two redirect rules with regexes so that Layer A
 * (scripts/verify-url-consistency.mjs), Layer B
 * (tests/url-consistency/mock-cloudfront-function.mjs) and Layer C
 * (scripts/verify-production-urls.mjs) can all reason about "will this path
 * 301?" without re-implementing the policy three times.
 *
 * Keep this file in sync with build-tools#59 whenever the CloudFront
 * Function's redirect rules change. If the two ever drift, this repo's CI
 * will pass while production 301s in ways this repo doesn't expect (or vice
 * versa) — so treat a change to that Function as a signal to update this
 * file too.
 *
 * Rules mirrored (see build-tools#59 for the canonical implementation):
 *   1. uri === '/' (root, i.e. an empty/`/`-only path) → 301 to `/ja`.
 *   2. Any path under a locale prefix (`/ja` or `/en`, at any depth, e.g.
 *      `/ja/json-formatter`) that has a trailing slash → 301 to the same
 *      path with the trailing slash stripped.
 */

const LOCALE_PREFIX_PATTERN = /^\/(ja|en)(\/|$)/;

/**
 * Normalizes a URL or path-like string down to just its path component
 * (no origin, no query string, no hash), so callers can pass either a full
 * URL (e.g. "https://devtools.morihara.tech/ja/") or a bare path (e.g.
 * "/ja/").
 */
function toPath(urlOrPath) {
  let path = urlOrPath;
  // Strip a scheme+host prefix if present, e.g. "https://example.com/ja" → "/ja".
  const originMatch = path.match(/^[a-z]+:\/\/[^/]+(\/.*)?$/i);
  if (originMatch) {
    path = originMatch[1] ?? '/';
  }
  // Drop query string / hash.
  path = path.split('?')[0].split('#')[0];
  return path;
}

/**
 * Rule 1: the CloudFront Function treats both `/` and the empty string as
 * "root", redirecting to `/ja`.
 */
function isRootPath(path) {
  return path === '/' || path === '';
}

/**
 * Rule 2: any locale-prefixed path (`/ja`, `/en`, and any depth below them,
 * e.g. `/ja/json-formatter/`) that carries a trailing slash gets redirected
 * to the same path with the trailing slash removed. This intentionally
 * covers `/ja/` and `/en/` themselves as well as deeper pages.
 */
function isLocalePathWithTrailingSlash(path) {
  return LOCALE_PREFIX_PATTERN.test(path) && path.length > 1 && path.endsWith('/');
}

/**
 * Returns true if the given URL or path would be 301-redirected by the
 * CloudFront Function.
 */
export function willRedirect(urlOrPath) {
  const path = toPath(urlOrPath);
  return isRootPath(path) || isLocalePathWithTrailingSlash(path);
}

/**
 * Returns the path the CloudFront Function would redirect `urlOrPath` to,
 * or `null` if `urlOrPath` would not be redirected (i.e. `willRedirect` is
 * false for it).
 */
export function redirectTargetPath(urlOrPath) {
  const path = toPath(urlOrPath);

  if (isRootPath(path)) {
    return '/ja';
  }

  if (isLocalePathWithTrailingSlash(path)) {
    return path.slice(0, -1);
  }

  return null;
}
