import { expect, test } from '@playwright/test';

import { computed, resolveToken } from './support/computed-style.js';
import { SAMPLE_ITEM_PATH } from './support/remotes.js';

/**
 * D38 + D51: the check that stands in for the Storybook that was not built.
 *
 * ⚠️ **Presence is not enough.** R3 fired in Slice 1: Tailwind skipped a
 * symlinked workspace package and the page rendered completely unstyled with a
 * green build. An element can be present and entirely unpainted, so every
 * assertion here reads a computed style that only a generated class produces.
 *
 * ⚠️ **Each remote is checked on a utility that only its own lib uses.**
 * `libs/ui/theme` `@source`s every feature lib into every remote's stylesheet,
 * so a generic utility (`grid`, `rounded-full`, `font-mono`) survives a missing
 * `@source` line as long as any *other* lib also uses it. The first draft of
 * this file asserted only generic utilities, and stayed green with the footer's
 * `@source` line deleted. The values below are arbitrary-value classes found in
 * exactly one feature lib: remove that lib's line and its spec goes red.
 *
 * The theme-token checks stay alongside them: they catch the token layer, which
 * the unique utilities do not exercise.
 */

test.describe('the shared design system is applied inside every remote', () => {
  test('header — the NavigationMenu lays out as a row', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('[data-testid="header-remote"] [data-slot="navigation-menu-list"]');

    await expect(list).toBeVisible();
    expect(await computed(list, 'display')).toBe('flex');
  });

  test('header — the mobile menu bars get their header-only height', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const bar = page
      .getByTestId('header-remote')
      .getByRole('button', { name: 'Open menu' })
      .locator('span')
      .first();

    // `h-[1.5px]`, used only in libs/features/header. Unstyled, the bar is `auto`.
    expect(await computed(bar, 'height')).toBe('1.5px');
  });

  test('homepage — the About section splits into two columns, on theme grounds', async ({
    page,
  }) => {
    await page.goto('/');
    const remote = page.getByTestId('homepage-remote');

    // `frame:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]`, used only in the homepage.
    const columns = await computed(remote.locator('#about > div'), 'gridTemplateColumns');
    expect(columns.split(' ')).toHaveLength(2);

    const trigger = remote.locator('[data-slot="accordion-trigger"]').first();
    expect(await computed(trigger, 'display')).toBe('grid');
    expect(await computed(remote.locator('#work'), 'backgroundColor')).toBe(
      await resolveToken(page, 'color', '--color-surface')
    );
    expect(await computed(remote.locator('#contact'), 'backgroundColor')).toBe(
      await resolveToken(page, 'color', '--color-ink')
    );
  });

  test('footer — the strip is set in tracked mono', async ({ page }) => {
    await page.goto('/');
    const strip = page.getByTestId('footer-remote');

    await expect(strip).toBeVisible();
    // `tracking-[0.14em]`, used only in libs/features/footer.
    expect(await computed(strip, 'letterSpacing')).not.toBe('normal');
    expect(await computed(strip, 'fontFamily')).toBe(
      await resolveToken(page, 'fontFamily', '--font-mono')
    );
  });

  test('portfolio item — the hero heading and the closing block carry their styles', async ({
    page,
  }) => {
    await page.goto(SAMPLE_ITEM_PATH);
    const remote = page.getByTestId('portfolio-item-remote');
    const heading = remote.getByTestId('portfolio-item-hero').getByRole('heading', { level: 1 });

    // `leading-[0.95]`, used only in libs/features/portfolio-item. Asserted as a
    // ratio, not as "not normal": preflight gives every element an inherited
    // `line-height: 1.5`, so an unstyled heading is not `normal` either.
    const lineHeight = Number.parseFloat(await computed(heading, 'lineHeight'));
    const fontSize = Number.parseFloat(await computed(heading, 'fontSize'));
    expect(lineHeight / fontSize).toBeCloseTo(0.95, 2);
    expect(await computed(heading, 'fontFamily')).toBe(
      await resolveToken(page, 'fontFamily', '--font-display')
    );
    expect(await computed(remote.getByTestId('portfolio-item-next-block'), 'backgroundColor')).toBe(
      await resolveToken(page, 'color', '--color-ink')
    );
  });
});
