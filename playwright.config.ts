import { defineConfig, devices } from '@playwright/test';

import { E2E_REMOTES, E2E_SHELL_PORT, e2eOriginEnv } from './tools/scripts/e2e-stack.mjs';

/**
 * Slice 9 — Playwright over the composed application (D20, D101).
 *
 * ⚠️ **It runs against a production build, never the dev servers.** Module
 * Federation behaves differently under `vite dev` (see the `hostInitInjectLocation`
 * note in `apps/shell/vite.config.ts`), and dev is not what ships. Build first:
 *
 *   pnpm e2e:build   # the shell as a node-server + all four remotes, on E2E ports
 *   pnpm e2e         # serves that output and runs the suite
 *
 * The stack runs on its own ports (`tools/scripts/e2e-stack.mjs`), so a dev
 * server left running cannot be picked up by mistake.
 *
 * **`E2E_BASE_URL` points the suite at a deployed site instead** (D101: Slice 8
 * runs this same suite as its rollback check). When it is set, no local server
 * starts and the remote origins must come from the `PORTFOLIO_*_ORIGIN`
 * variables, the same ones the shell's build reads.
 */

const IS_DEPLOYED = Boolean(process.env.E2E_BASE_URL);
const IS_CI = Boolean(process.env.CI);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${E2E_SHELL_PORT}`;

// Specs read the origins from the environment (`e2e/support/remotes.ts`), and
// Playwright's workers inherit it. Locally, fill in the stack's; a deployed run
// supplies its own, so nothing here overrides a value that is already set.
if (!IS_DEPLOYED) {
  for (const [key, origin] of Object.entries(e2eOriginEnv())) {
    process.env[key] ??= origin;
  }
}

const localServers = [
  ...E2E_REMOTES.map(({ app, port }) => ({
    command: `pnpm exec vite preview --port ${port} --strictPort`,
    cwd: `apps/${app}`,
    url: `http://localhost:${port}/remoteEntry.js`,
    reuseExistingServer: !IS_CI,
  })),
  {
    command: 'node apps/shell/.output/server/index.mjs',
    env: { PORT: String(E2E_SHELL_PORT) },
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
  },
];

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 1 : 0,
  reporter: IS_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: IS_DEPLOYED ? undefined : localServers,
});
