import { join } from 'node:path';

import {
  originEnvKey,
  REMOTES,
  SHELL_APP,
  shellRemoteOrigin,
} from '../../site-config/site-config.js';
import { IMMUTABLE, ONE_DAY, syncUp } from '../aws-cli/aws-cli.js';
import type { DeployContext } from '../deploy-remote/deploy-remote.js';

/** The shell is always built against the stable pointers (D107), never a version. */
export const shellBuildEnv = (): NodeJS.ProcessEnv =>
  Object.fromEntries(REMOTES.map((remote) => [originEnvKey(remote), shellRemoteOrigin(remote)]));

export const shellOutputDir = (workspaceRoot: string): string =>
  join(workspaceRoot, 'apps', SHELL_APP, '.output');

/**
 * Deploys the shell: build, upload its static files, then `cdk deploy`.
 *
 * - `NITRO_PRESET` is set explicitly, so a leftover value in the environment
 *   can't produce the E2E `node-server` build (the stack refuses one anyway).
 * - Static files go up **before** the Lambda switches, so the new HTML never
 *   references an asset that isn't there yet. Old assets stay (no `--delete`),
 *   so a page rendered by the old Lambda keeps working.
 * - Image names aren't hashed, so they are cached for a day rather than a year.
 */
export const deployShell = (ctx: DeployContext): void => {
  ctx.log('shell: building against the remote pointers');
  ctx.run('pnpm', ['nx', 'run', `${SHELL_APP}:build`, '--skip-nx-cache'], {
    ...shellBuildEnv(),
    NITRO_PRESET: 'aws_lambda',
  });

  const publicDir = join(shellOutputDir(ctx.workspaceRoot), 'public');
  const bucketRoot = `s3://${ctx.target.bucket}/`;
  syncUp(ctx.run, publicDir, bucketRoot, IMMUTABLE, ['images/*']);
  syncUp(ctx.run, join(publicDir, 'images'), `${bucketRoot}images/`, ONE_DAY);

  ctx.log('shell: cdk deploy');
  ctx.run(
    'pnpm',
    ['--filter', '@portfolio/infra', 'exec', 'cdk', 'deploy', '--require-approval', 'never'],
    {
      SHELL_SERVER_DIR: join(shellOutputDir(ctx.workspaceRoot), 'server'),
    }
  );
};
