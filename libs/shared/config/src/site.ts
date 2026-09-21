/**
 * The origin the shell builds absolute Open Graph URLs against (D48).
 *
 * Read from the environment rather than hardcoded, because it differs between
 * local development and the deployed CloudFront distribution (D31). Slice 8
 * supplies the deployed value; the fallback is the local dev server.
 *
 * ⚠️ **The `typeof` guard is load-bearing, not defensive noise.** This module
 * is `scope:shared`, so it is bundled into the browser as well as the Lambda —
 * the remote registry beside it is read client-side by design (D19). A bare
 * `process.env` reference throws `ReferenceError: process is not defined` in
 * the browser, and it would throw during the root route's `head`, which runs on
 * both sides.
 */
const readEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') return undefined;
  return process.env?.[key];
};

export const DEFAULT_SITE_ORIGIN = 'http://localhost:3000';

export const SITE_ORIGIN: string = readEnv('PORTFOLIO_SITE_ORIGIN') ?? DEFAULT_SITE_ORIGIN;
