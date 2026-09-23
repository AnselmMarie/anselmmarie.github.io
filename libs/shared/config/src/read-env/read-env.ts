/**
 * Reads an environment variable from code that is bundled for **both** the
 * Lambda and the browser.
 *
 * ⚠️ **The `typeof` guard is load-bearing, not defensive noise.** Everything in
 * `libs/shared/config` is `scope:shared` and reaches the client — the remote
 * registry beside this file is read client-side by design (D19). A bare
 * `process.env` reference throws `ReferenceError: process is not defined` in
 * the browser.
 *
 * Extracted from `site.ts` in Slice 3, when the remote registry became the
 * second consumer — D29's threshold exactly.
 */
export const readEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') return undefined;
  return process.env?.[key];
};
