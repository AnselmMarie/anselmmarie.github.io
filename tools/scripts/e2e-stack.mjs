#!/usr/bin/env node
/**
 * The E2E stack's ports, and the production build that bakes them in (Slice 9).
 *
 *   node tools/scripts/e2e-stack.mjs    # = pnpm e2e:build
 *
 * ⚠️ **The E2E stack does not use the dev ports.** A `vite dev` left running on
 * 3000 or 4174–4177 would otherwise be silently reused by Playwright's
 * `reuseExistingServer`, and the suite would pass against dev, which is exactly
 * what D101 says it must not test. So the stack gets its own ports, and because
 * the shell bakes remote origins into its bundle at build time (the D12 note in
 * `apps/shell/vite.config.ts`), the build has to be told them.
 *
 * `playwright.config.ts` imports this table, so the ports the build bakes in and
 * the ports the servers listen on cannot drift apart.
 *
 * ⚠️ **`--skip-nx-cache` is load-bearing.** Nx does not hash environment
 * variables into the build's cache key, so a cached build made with the dev
 * origins would be replayed here and point every remote at a port nothing
 * listens on.
 */
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const E2E_SHELL_PORT = 3100;

/** `envKey` is the variable the shell's and the remote's `vite.config.ts` read. */
export const E2E_REMOTES = [
  { app: 'header', envKey: 'PORTFOLIO_HEADER_ORIGIN', port: 4274 },
  { app: 'footer', envKey: 'PORTFOLIO_FOOTER_ORIGIN', port: 4275 },
  { app: 'homepage', envKey: 'PORTFOLIO_HOMEPAGE_ORIGIN', port: 4276 },
  { app: 'portfolio-item', envKey: 'PORTFOLIO_PORTFOLIO_ITEM_ORIGIN', port: 4277 },
];

/** `{ PORTFOLIO_HEADER_ORIGIN: 'http://localhost:4274', … }` */
export const e2eOriginEnv = () =>
  Object.fromEntries(E2E_REMOTES.map(({ envKey, port }) => [envKey, `http://localhost:${port}`]));

const build = () => {
  const projects = ['shell', ...E2E_REMOTES.map(({ app }) => app)].join(',');
  execFileSync(
    'pnpm',
    ['nx', 'run-many', '-t', 'build', `--projects=${projects}`, '--skip-nx-cache'],
    {
      stdio: 'inherit',
      // The shell's default preset is `aws_lambda` (D31); the stack serves it
      // as a plain Node server instead.
      env: { ...process.env, ...e2eOriginEnv(), NITRO_PRESET: 'node-server' },
    }
  );
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  build();
}
