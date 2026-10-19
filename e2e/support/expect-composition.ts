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

/**
 * ai-chat D15 — a failed chat renders **nothing**: no remote and no shell
 * notice. A missing chat is an absent feature, not a broken page.
 */
const SILENT_REMOTES: readonly RemoteName[] = ['chat'];

/**
 * The failed remote's region shows the shell's fallback, and not the remote.
 * For a remote with no fallback (D15), neither is on the page.
 */
export const expectFallback = async (page: Page, name: RemoteName): Promise<void> => {
  if (SILENT_REMOTES.includes(name)) {
    await expect(page.getByTestId(fallbackTestId(name))).toHaveCount(0);
    await expect(page.getByTestId(remoteTestId(name))).toHaveCount(0);
    return;
  }
  await expect(page.getByTestId(fallbackTestId(name))).toBeVisible();
  await expect(page.getByTestId(remoteTestId(name))).toHaveCount(0);
};

/** The shell itself survived: its three regions are still in the document. */
export const expectShellIntact = async (page: Page): Promise<void> => {
  for (const region of ['shell-header-region', 'shell-content-region', 'shell-footer-region']) {
    await expect(page.getByTestId(region)).toBeVisible();
  }
};
