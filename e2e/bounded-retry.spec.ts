import { expect, test } from '@playwright/test';

import { expectFallback, expectRemoteRendered } from './support/expect-composition.js';
import { blockRemoteEntry } from './support/fail-remote.js';
import { type RemoteName, SAMPLE_ITEM_PATH } from './support/remotes.js';

/**
 * The bounded retry (Slice 4, R7): the page-level fallbacks offer "Try again",
 * it works once the remote is back, and it stops after its bound rather than
 * looping.
 *
 * `MAX_MFE_RETRIES` is 2 (`libs/features/shell/src/mfe-error-boundary/mfe-failure.ts`).
 * It is restated here rather than imported: the suite runs against a built,
 * possibly deployed site, and what it checks is the behaviour that shipped.
 */
const MAX_RETRIES = 2;

const RETRYABLE: readonly { name: RemoteName; path: string }[] = [
  { name: 'homepage', path: '/' },
  { name: 'portfolio-item', path: SAMPLE_ITEM_PATH },
];

const retryButton = (page: Parameters<typeof expectFallback>[0], name: RemoteName) =>
  page.getByTestId(`mfe-fallback-${name}`).getByRole('button', { name: 'Try again' });

for (const { name, path } of RETRYABLE) {
  test.describe(`${name} retry`, () => {
    test('"Try again" recovers the remote once it is reachable again', async ({ page }) => {
      const outage = await blockRemoteEntry(page, name);
      await page.goto(path);
      await expectFallback(page, name);

      await outage.restore();
      await retryButton(page, name).click();

      await expectRemoteRendered(page, name);
    });

    test('the retry stops at its bound and says so', async ({ page }) => {
      const outage = await blockRemoteEntry(page, name);
      await page.goto(path);

      for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
        await retryButton(page, name).click();
      }

      await expect(page.getByTestId(`mfe-retry-exhausted-${name}`)).toBeVisible();
      await expect(retryButton(page, name)).toHaveCount(0);
      // Bounded, not looping: at most the first load plus one per retry.
      expect(outage.requests()).toBeLessThanOrEqual(1 + MAX_RETRIES);
    });
  });
}

test('the header and footer fallbacks offer no retry — they are chrome', async ({ page }) => {
  await blockRemoteEntry(page, 'header');
  await blockRemoteEntry(page, 'footer');
  await page.goto('/');

  for (const name of ['header', 'footer'] as const) {
    await expectFallback(page, name);
    await expect(page.getByTestId(`mfe-fallback-${name}`).getByRole('button')).toHaveCount(0);
  }
});
