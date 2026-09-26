import { expect, type Page } from '@playwright/test';

import { fallbackTestId, type RemoteName, remoteTestId } from './remotes.js';

/**
 * The remote rendered itself: its root is visible and no fallback stands in
 * for it. Checking both halves matters, because the header's fallback also
 * draws a nav, and a page that shows *something* in every region is not proof
 * that every remote loaded.
 */
export const expectRemoteRendered = async (page: Page, name: RemoteName): Promise<void> => {
  await expect(page.getByTestId(remoteTestId(name)).first()).toBeVisible();
  await expect(page.getByTestId(fallbackTestId(name))).toHaveCount(0);
};

export const expectRemotesRendered = async (
  page: Page,
  names: readonly RemoteName[]
): Promise<void> => {
  for (const name of names) {
    await expectRemoteRendered(page, name);
  }
};

/** The failed remote's region shows the shell's fallback, and not the remote. */
export const expectFallback = async (page: Page, name: RemoteName): Promise<void> => {
  await expect(page.getByTestId(fallbackTestId(name))).toBeVisible();
  await expect(page.getByTestId(remoteTestId(name))).toHaveCount(0);
};

/** The shell itself survived: its three regions are still in the document. */
export const expectShellIntact = async (page: Page): Promise<void> => {
  for (const region of ['shell-header-region', 'shell-content-region', 'shell-footer-region']) {
    await expect(page.getByTestId(region)).toBeVisible();
  }
};
