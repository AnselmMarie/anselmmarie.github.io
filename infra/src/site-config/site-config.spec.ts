import { describe, expect, it } from 'vitest';

import {
  isRemoteApp,
  originEnvKey,
  pointerKey,
  remoteBuildOrigin,
  shellRemoteOrigin,
  versionPrefix,
} from './site-config.js';

describe('site-config', () => {
  it('names the env var every vite.config.ts reads, hyphens and all', () => {
    // apps/*/vite.config.ts reads these exact names; a mismatch builds against localhost.
    expect(originEnvKey('footer')).toBe('PORTFOLIO_FOOTER_ORIGIN');
    expect(originEnvKey('portfolio-item')).toBe('PORTFOLIO_PORTFOLIO_ITEM_ORIGIN');
  });

  it('builds a remote into its versioned directory and the shell against the pointer (D107)', () => {
    expect(remoteBuildOrigin('footer', 'abc')).toBe('https://anselmmarie.com/_remotes/footer/abc');
    expect(shellRemoteOrigin('footer')).toBe('https://anselmmarie.com/_remotes/footer');
  });

  it('keys the pointer beside the version directories', () => {
    expect(pointerKey('homepage')).toBe('_remotes/homepage/remoteEntry.js');
    expect(versionPrefix('homepage', 'abc')).toBe('_remotes/homepage/abc');
  });

  it('recognises only the four remotes', () => {
    expect(isRemoteApp('portfolio-item')).toBe(true);
    expect(isRemoteApp('shell')).toBe(false);
  });
});
