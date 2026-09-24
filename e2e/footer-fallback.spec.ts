import { expect, test } from '@playwright/test';

import { computed, resolveToken, textContrast } from './support/computed-style.js';
import { blockRemoteEntry } from './support/fail-remote.js';
import { SAMPLE_ITEM_PATH } from './support/remotes.js';

/**
 * D104 — the footer-down check Slice 16 existed for and never ran.
 *
 * D79 split one visual section across two remotes: the dark block above belongs
 * to the page (the homepage's `#contact`, the item's "deeper walkthrough"), and
 * the strip beneath it belongs to the footer. With the footer down, the risk is
 * a page that ends on a bare rule and reads as truncated. So this asserts the
 * fallback's *look*, not just its presence:
 *
 * - it sits in the footer region, on the same ink ground the strip does,
 * - its text is legible on that ground,
 * - and the region keeps roughly the strip's height, so the page does not end
 *   short.
 */

/** A fallback line may be shorter than the strip, but not collapsed. */
const MIN_HEIGHT_RATIO = 0.75;

/** WCAG AA for normal text. */
const MIN_CONTRAST = 4.5;

for (const path of ['/', SAMPLE_ITEM_PATH]) {
  test(`footer down on ${path} — the fallback reads as a deliberate footer`, async ({
    browser,
  }) => {
    const healthy = await browser.newPage();
    await healthy.goto(path);
    await expect(healthy.getByTestId('footer-remote')).toBeVisible();
    const healthyBox = await healthy.getByTestId('shell-footer-region').boundingBox();
    await healthy.close();

    const page = await browser.newPage();
    await blockRemoteEntry(page, 'footer');
    await page.goto(path);

    const region = page.getByTestId('shell-footer-region');
    const fallback = region.getByTestId('mfe-fallback-footer');
    await expect(fallback).toBeVisible();

    expect(await computed(region, 'backgroundColor')).toBe(
      await resolveToken(page, 'color', '--color-ink')
    );
    expect(await textContrast(fallback)).toBeGreaterThanOrEqual(MIN_CONTRAST);

    const box = await region.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual((healthyBox?.height ?? 0) * MIN_HEIGHT_RATIO);

    await page.close();
  });
}
