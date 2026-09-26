import { expect, test } from '@playwright/test';

import { expectFallback, expectRemotesRendered } from './support/expect-composition.js';
import { blockRemoteEntry, serveThrowingRemote } from './support/fail-remote.js';
import { type RemoteName, remotesOn, SAMPLE_ITEM_PATH } from './support/remotes.js';

/**
 * Loading versus runtime failure (the architecture doc's *Loading and Runtime
 * Failures*): a `remoteEntry.js` that never arrives and a component that throws
 * while rendering reach the same boundary by different doors, and land in the
 * same fallback. The kind changes one line of copy and the diagnostic, nothing
 * else — so that line is what tells the two apart here.
 */

const CASES: readonly { name: RemoteName; path: string }[] = [
  { name: 'homepage', path: '/' },
  { name: 'portfolio-item', path: SAMPLE_ITEM_PATH },
];

/** The diagnostic `logMfeFailure` writes, e.g. `[mfe:homepage] render failure {…}`. */
const diagnosticsFor = (page: Parameters<typeof expectFallback>[0], name: RemoteName) => {
  const lines: string[] = [];
  page.on('console', (message) => {
    if (message.text().startsWith(`[mfe:${name}]`)) lines.push(message.text());
  });
  return lines;
};

for (const { name, path } of CASES) {
  test.describe(`${name} failure kinds`, () => {
    test('a missing remoteEntry.js lands in the fallback as a load failure', async ({ page }) => {
      const diagnostics = diagnosticsFor(page, name);
      await blockRemoteEntry(page, name);
      await page.goto(path);

      await expectFallback(page, name);
      await expect(page.getByTestId(`mfe-fallback-${name}`)).toContainText('did not load');
      expect(diagnostics.join('\n')).toContain('load failure');
    });

    test('a component that throws while rendering lands there as a render failure', async ({
      page,
    }) => {
      const diagnostics = diagnosticsFor(page, name);
      await serveThrowingRemote(page, name);
      await page.goto(path);

      await expectFallback(page, name);
      await expect(page.getByTestId(`mfe-fallback-${name}`)).toContainText(
        'could not be displayed'
      );
      expect(diagnostics.join('\n')).toContain('render failure');
      // Contained like a load failure: the rest of the route is untouched.
      await expectRemotesRendered(
        page,
        remotesOn(path).filter((other) => other !== name)
      );
    });
  });
}
