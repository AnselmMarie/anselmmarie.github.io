import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  pointerKey,
  REMOTES_PREFIX,
  type RemoteApp,
  VERSION_PATTERN,
  versionPrefix,
} from '../../site-config/site-config.js';
import {
  countKeys,
  invalidate,
  listPrefixes,
  NEVER_CACHE,
  putText,
  type Run,
  readText,
  type SiteTarget,
} from '../aws-cli/aws-cli.js';
import {
  assertVersion,
  pointerSource,
  versionFromPointer,
} from '../remote-pointer/remote-pointer.js';

export interface ReleaseContext {
  readonly run: Run;
  readonly target: SiteTarget;
  /** Where the pointer file is written before upload. */
  readonly tmpDir: string;
  readonly log: (line: string) => void;
}

/**
 * Points a remote at a version (D107), which is what both a deploy and a
 * rollback are. The pointer is uploaded uncached and then invalidated, so the
 * next page load reads it from S3 rather than from an edge that saw the old one
 * (R12). The invalidation is part of the operation, not a step to remember.
 */
export const releaseVersion = (ctx: ReleaseContext, remote: RemoteApp, version: string): void => {
  assertVersion(version);
  const file = join(ctx.tmpDir, `${remote}-remoteEntry.js`);
  writeFileSync(file, pointerSource(version));
  putText(ctx.run, ctx.target.bucket, pointerKey(remote), file, NEVER_CACHE);
  invalidate(ctx.run, ctx.target.distributionId, [`/${pointerKey(remote)}`]);
  ctx.log(`${remote}: pointer → ${version}`);
};

/** The version a remote's pointer names now, or `null` before its first deploy. */
export const currentVersion = (ctx: ReleaseContext, remote: RemoteApp): string | null => {
  if (countKeys(ctx.run, ctx.target.bucket, pointerKey(remote)) === 0) return null;
  return versionFromPointer(readText(ctx.run, ctx.target.bucket, pointerKey(remote)));
};

/** Every version of a remote still in the bucket, which is every one ever deployed. */
export const listVersions = (ctx: ReleaseContext, remote: RemoteApp): string[] =>
  listPrefixes(ctx.run, ctx.target.bucket, `${REMOTES_PREFIX}/${remote}/`)
    .map((prefix) => prefix.split('/').at(-2) ?? '')
    .filter((name) => VERSION_PATTERN.test(name));

/**
 * The documented rollback: an explicit operation naming a known-good version,
 * never an automatic switch on failure (the architecture doc's rollback rule).
 * Refuses a version whose entry isn't in the bucket, because pointing at it
 * would take the remote down and report success.
 */
export const rollbackRemote = (ctx: ReleaseContext, remote: RemoteApp, version: string): void => {
  assertVersion(version);
  const entry = `${versionPrefix(remote, version)}/remoteEntry.js`;
  if (countKeys(ctx.run, ctx.target.bucket, entry) === 0) {
    throw new Error(`${remote} has no version ${version} in the bucket (${entry} is missing).`);
  }
  const from = currentVersion(ctx, remote);
  releaseVersion(ctx, remote, version);
  ctx.log(`${remote}: rolled back from ${from ?? 'nothing'} to ${version}`);
};
