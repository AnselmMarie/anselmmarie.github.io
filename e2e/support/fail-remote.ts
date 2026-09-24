import type { Page, Route } from '@playwright/test';

import { type RemoteName, remoteEntryUrl } from './remotes.js';

/**
 * Failure injection, at the network layer (the slice's own note: route
 * interception is deterministic and runs in CI; a stopped process is neither).
 */

/**
 * Matches the remote's `remoteEntry.js` whatever its query string. A retry asks
 * for `remoteEntry.js?mf-retry=<n>` (`reload-remote.ts`, Q23), and an outage
 * does not care about query strings: an exact-URL match would let every retry
 * through to a server that is supposed to be down.
 */
const entryMatcher = (name: RemoteName) => {
  const entry = new URL(remoteEntryUrl(name));
  return (url: URL): boolean => url.origin === entry.origin && url.pathname === entry.pathname;
};

export interface RemoteEntryTap {
  /** How many times the page has asked for the remote's `remoteEntry.js`. */
  readonly requests: () => number;
  /** Stop failing: later requests reach the real server. */
  readonly restore: () => Promise<void>;
}

/**
 * Makes the remote unreachable: every request for its `remoteEntry.js` is
 * aborted, as a DNS failure or a dead CDN origin would be. This is the *load*
 * failure path — the rejected `import()` that `React.lazy` re-throws.
 */
export const blockRemoteEntry = async (page: Page, name: RemoteName): Promise<RemoteEntryTap> => {
  const url = entryMatcher(name);
  let count = 0;
  const handler = async (route: Route) => {
    count += 1;
    await route.abort('connectionrefused');
  };

  await page.route(url, handler);

  return {
    requests: () => count,
    restore: () => page.unroute(url, handler),
  };
};

/**
 * A stand-in `remoteEntry.js` that loads cleanly and whose exposed component
 * throws when it renders. This is the *render* failure path: the module
 * arrived, and the component is what broke.
 *
 * It implements the Module Federation container contract (`init` + `get`)
 * the shell's runtime calls, and nothing else. The error message is chosen to
 * match none of `classify-mfe-failure.ts`'s load patterns.
 */
const THROWING_REMOTE_ENTRY = `
export const init = () => {};
export const get = () => () => ({
  default: () => { throw new Error('e2e: the remote component threw while rendering'); },
});
`;

export const serveThrowingRemote = async (page: Page, name: RemoteName): Promise<void> => {
  await page.route(entryMatcher(name), (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      // The entry is a cross-origin module script, so it needs CORS like the real one.
      headers: { 'access-control-allow-origin': '*' },
      body: THROWING_REMOTE_ENTRY,
    })
  );
};
