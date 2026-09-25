import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  originEnvKey,
  type RemoteApp,
  remoteBuildOrigin,
  versionPrefix,
} from '../../site-config/site-config.js';
import { IMMUTABLE, syncUp } from '../aws-cli/aws-cli.js';
import { type ReleaseContext, releaseVersion } from '../remote-release/remote-release.js';

export interface DeployContext extends ReleaseContext {
  readonly workspaceRoot: string;
}

export const remoteDistDir = (workspaceRoot: string, remote: RemoteApp): string =>
  join(workspaceRoot, 'apps', remote, 'dist');

/**
 * Builds a remote against its versioned directory (D42, D107).
 *
 * ⚠️ `--skip-nx-cache` is required, not a preference: the origin arrives as an
 * env var, which is not in Nx's task hash, so a cache hit would restore a build
 * made for a different `base`.
 */
export const buildRemote = (ctx: DeployContext, remote: RemoteApp, version: string): void => {
  ctx.log(`${remote}: building for ${remoteBuildOrigin(remote, version)}`);
  ctx.run('pnpm', ['nx', 'run', `${remote}:build`, '--skip-nx-cache'], {
    [originEnvKey(remote)]: remoteBuildOrigin(remote, version),
  });
};

/**
 * Refuses a build whose `base` is not this version's directory.
 *
 * The chunks import each other relatively, but Vite's preload helper inlines
 * the absolute `base`, so a build made for another version would preload from
 * the wrong directory. That is exactly the stale build `--skip-nx-cache`
 * prevents, checked where it would do damage: before the upload.
 */
export const assertBuiltFor = (distDir: string, remote: RemoteApp, version: string): void => {
  const expected = remoteBuildOrigin(remote, version);
  const assetsDir = join(distDir, 'assets');
  if (!existsSync(join(distDir, 'remoteEntry.js')) || !existsSync(assetsDir)) {
    throw new Error(`${remote}: no remoteEntry.js build in ${distDir}.`);
  }
  const mentionsBase = readdirSync(assetsDir)
    .filter((file) => file.endsWith('.js'))
    .some((file) => readFileSync(join(assetsDir, file), 'utf8').includes(expected));
  if (!mentionsBase) {
    throw new Error(`${remote}: the build in ${distDir} was not made for ${expected}.`);
  }
};

/**
 * Deploys one remote without touching the shell (D12): build, upload the
 * version, then release it. The upload comes first and the pointer last, so
 * there is no moment when the pointer names files that aren't there yet.
 *
 * `index.html` is the remote's standalone dev page and is not uploaded.
 */
export const deployRemote = (ctx: DeployContext, remote: RemoteApp, version: string): void => {
  buildRemote(ctx, remote, version);
  const distDir = remoteDistDir(ctx.workspaceRoot, remote);
  assertBuiltFor(distDir, remote, version);
  syncUp(
    ctx.run,
    distDir,
    `s3://${ctx.target.bucket}/${versionPrefix(remote, version)}/`,
    IMMUTABLE,
    ['index.html']
  );
  releaseVersion(ctx, remote, version);
};
