import { test } from '@playwright/test';

import {
  expectFallback,
  expectRemoteRendered,
  expectShellIntact,
} from './support/expect-composition.js';
import { blockRemoteEntry } from './support/fail-remote.js';
import { REMOTES, type RemoteName, remotesOn, SAMPLE_ITEM_PATH } from './support/remotes.js';

/**
 * D16 — the property the whole architecture rests on: one remote failing does
 * not take down the others.
 *
 * ⚠️ **Assert what is still there, not only what broke.** "The fallback
 * rendered" is half the claim. The half that matters is that every *other*
 * remote on the page still rendered, that the shell did not crash, and that the
 * visitor can still move to another route.
 *
 * ⚠️ **Seen failing, 2026-09-23** (prove-the-spec-can-fail.md). A spec that
 * blocks a remote and asserts the page still renders passes in a suite where
 * nothing was ever wrapped in a boundary. So the boundary was unwrapped from
 * `MfeRemoteMount`, the shell rebuilt, and all four tests went red at
 * `expectFallback`.
 */

/** The other route, to prove navigation survives the failure. */
const otherPath = (path: string): string => (path === '/' ? SAMPLE_ITEM_PATH : '/');

const expectRouteComposes = async (
  page: Parameters<typeof expectShellIntact>[0],
  path: string,
  failed: RemoteName
) => {
  await expectShellIntact(page);
  for (const name of remotesOn(path)) {
    await (name === failed ? expectFallback(page, name) : expectRemoteRendered(page, name));
  }
};

test.describe('one remote failing leaves the rest of the site working', () => {
  for (const { name, path } of REMOTES) {
    test(`${name} unreachable — its fallback renders and every other remote still does`, async ({
      page,
    }) => {
      await blockRemoteEntry(page, name);

      await page.goto(path);
      await expectRouteComposes(page, path, name);

      // Routing still works with the remote down, and the failure follows the
      // visitor: the next route composes around the same missing remote.
      const next = otherPath(path);
      await page.goto(next);
      await expectRouteComposes(page, next, name);
    });
  }
});
