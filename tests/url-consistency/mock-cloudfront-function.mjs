/**
 * Layer B helper for Issue #194's URL-consistency contract tests.
 *
 * A minimal HTTP server (Node's built-in `http` module only — no added npm
 * dependencies) that mimics the production CloudFront Function's redirect
 * behavior as mirrored in scripts/url-policy.mjs:
 *   - If the requested path would be redirected (`willRedirect`), respond
 *     301 with a `Location` header pointing at `redirectTargetPath`.
 *   - Otherwise respond 200.
 *
 * This lets verify-url-consistency.contract.test.mjs exercise the same
 * request→outcome behavior a real CloudFront distribution would produce,
 * without needing network access or a real deployment, so the contract
 * between "what scripts/url-policy.mjs believes" and "what a client would
 * observe" stays covered by a fast, deterministic test.
 */

import { createServer } from 'node:http';
import { redirectTargetPath, willRedirect } from '../../scripts/url-policy.mjs';

/**
 * Creates (but does not start) the mock CloudFront Function HTTP server.
 * Call `.listen(0)` on the result to bind an ephemeral port for tests.
 */
export function createMockCloudFrontServer() {
  return createServer((req, res) => {
    const path = req.url ?? '/';

    if (willRedirect(path)) {
      const target = redirectTargetPath(path);
      res.writeHead(301, { Location: target ?? '/' });
      res.end();
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  });
}

/**
 * Starts the mock server on an ephemeral port and resolves with
 * `{ server, baseUrl }` once listening. Caller is responsible for calling
 * `server.close()` when done.
 */
export function startMockCloudFrontServer() {
  return new Promise((resolve) => {
    const server = createMockCloudFrontServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address !== null ? address.port : address;
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}
