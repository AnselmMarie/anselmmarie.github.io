import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SITE_ORIGIN, SITE_ORIGIN } from './site.js';

describe('SITE_ORIGIN', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('falls back to the local dev server when the variable is unset', () => {
    expect(SITE_ORIGIN).toBe(DEFAULT_SITE_ORIGIN);
  });

  it('is an absolute origin, because og:url is ignored when it is relative', () => {
    expect(SITE_ORIGIN).toMatch(/^https?:\/\//);
  });

  it('reads the variable when the environment supplies one', async () => {
    vi.stubGlobal('process', { env: { PORTFOLIO_SITE_ORIGIN: 'https://anselmmarie.dev' } });
    vi.resetModules();

    const fresh = await import('./site.js');

    expect(fresh.SITE_ORIGIN).toBe('https://anselmmarie.dev');
  });

  it('survives an environment with no `process` at all', async () => {
    // The browser is that environment. This module ships to it (scope:shared),
    // and the root route's `head` runs on both sides — so a bare `process.env`
    // read here throws during client navigation, not during SSR, which is the
    // half nobody looks at.
    vi.stubGlobal('process', undefined);
    vi.resetModules();

    const fresh = await import('./site.js');

    expect(fresh.SITE_ORIGIN).toBe(DEFAULT_SITE_ORIGIN);
  });
});
