/**
 * The origin the shell builds absolute Open Graph URLs against (D48).
 *
 * Read from the environment rather than hardcoded, because it differs between
 * local development and the deployed CloudFront distribution (D31). Slice 8
 * supplies the deployed value; the fallback is the local dev server.
 *
 * The `typeof process` guard this needs lives in `read-env.ts`, shared with the
 * remote registry since Slice 3.
 */
import { readEnv } from '../read-env/read-env.js';

export const DEFAULT_SITE_ORIGIN = 'http://localhost:3000';

export const SITE_ORIGIN: string = readEnv('PORTFOLIO_SITE_ORIGIN') ?? DEFAULT_SITE_ORIGIN;
