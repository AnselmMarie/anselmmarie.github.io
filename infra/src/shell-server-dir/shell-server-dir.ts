import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/** Where `nx run shell:build` leaves the server, relative to `infra/`. */
export const DEFAULT_SHELL_SERVER_DIR = '../apps/shell/.output/server';

/** The Nitro preset a deployable build must have been made with (D31). */
export const LAMBDA_PRESET = 'aws-lambda';

/**
 * Resolves the shell's server build and refuses one that can't run on Lambda.
 *
 * ⚠️ **The preset check is the point.** `pnpm e2e:build` writes a
 * `node-server` build into the same `.output/` directory (D105). That build
 * exports no `handler`, so deploying it succeeds and then every request fails
 * in the host, which is the worst place to find out. `nitro.json` records the
 * preset, so the check reads it instead of trusting whichever build ran last.
 */
export const resolveShellServerDir = (dir: string | undefined, cwd = process.cwd()): string => {
  const serverDir = resolve(cwd, dir ?? DEFAULT_SHELL_SERVER_DIR);
  const manifest = join(dirname(serverDir), 'nitro.json');

  if (!existsSync(join(serverDir, 'index.mjs')) || !existsSync(manifest)) {
    throw new Error(
      `No shell server build at ${serverDir}. Build it first: pnpm nx run shell:build --skip-nx-cache`
    );
  }

  const { preset } = JSON.parse(readFileSync(manifest, 'utf8')) as { preset?: string };
  if (preset !== LAMBDA_PRESET) {
    throw new Error(
      `The shell build at ${serverDir} is preset "${preset}", not "${LAMBDA_PRESET}". ` +
        'An E2E build (NITRO_PRESET=node-server) cannot run on Lambda; rebuild the shell.'
    );
  }

  return serverDir;
};
