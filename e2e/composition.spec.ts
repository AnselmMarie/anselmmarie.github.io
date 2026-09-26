import { expect, test } from '@playwright/test';

import { expectRemotesRendered, expectShellIntact } from './support/expect-composition.js';
import { REMOTES_ON_PATH, SAMPLE_ITEM_PATH, SAMPLE_SLUG } from './support/remotes.js';

/**
 * The happy path: every remote composes, and the homepage's listing leads to a
 * portfolio item that composes too.
 */

test.describe('the composed site', () => {
  test('the homepage composes the header, the homepage and the footer', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto('/');

    await expectShellIntact(page);
    await expectRemotesRendered(page, REMOTES_ON_PATH.home);
    expect(pageErrors).toEqual([]);
  });

  test('the homepage lists the sample item, and following it opens that item', async ({ page }) => {
    await page.goto('/');

    const card = page.locator(`a[href="${SAMPLE_ITEM_PATH}"]`);
    await expect(card, `the homepage no longer links ${SAMPLE_ITEM_PATH}`).toHaveCount(1);

    await card.click();

    await expect(page).toHaveURL(SAMPLE_ITEM_PATH);
    await expectRemotesRendered(page, REMOTES_ON_PATH.item);
    await expect(
      page.getByTestId('portfolio-item-hero').getByRole('heading', { level: 1 })
    ).toBeVisible();
  });

  test('a portfolio item composes the header, the item and the footer on a cold load', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(SAMPLE_ITEM_PATH);

    await expectShellIntact(page);
    await expectRemotesRendered(page, REMOTES_ON_PATH.item);
    // D73: the shell hands the resolved item to the remote. The server-rendered
    // title and the remote's heading must describe the same item.
    await expect(page).toHaveTitle(new RegExp(SAMPLE_SLUG, 'i'));
    expect(pageErrors).toEqual([]);
  });

  test('an unknown slug is a shell-level not-found, never a remote fallback (D66)', async ({
    page,
  }) => {
    await page.goto('/portfolio/no-such-item');

    await expect(page.getByTestId('portfolio-not-found')).toBeVisible();
    await expect(page.getByTestId('mfe-fallback-portfolio-item')).toHaveCount(0);
    await expect(page.getByTestId('portfolio-item-remote')).toHaveCount(0);
  });
});
