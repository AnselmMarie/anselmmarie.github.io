import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { describeCall, fakeContext, fakeRun } from '../../test-helpers/fake-run.test-helpers.js';
import { IMMUTABLE } from '../aws-cli/aws-cli.js';
import { assertBuiltFor, deployRemote, remoteDistDir } from './deploy-remote.js';

const VERSION = '0123456789ab';
const ORIGIN = `https://anselmmarie.com/_remotes/footer/${VERSION}`;

/** A workspace whose footer build was made for `builtFor`. */
const workspaceWithBuild = (builtFor: string, withEntry = true): string => {
  const root = mkdtempSync(join(tmpdir(), 'ws-'));
  const dist = remoteDistDir(root, 'footer');
  mkdirSync(join(dist, 'assets'), { recursive: true });
  if (withEntry) writeFileSync(join(dist, 'remoteEntry.js'), 'export const get = 1;');
  writeFileSync(join(dist, 'assets', 'vite-preload-helper-x.js'), `const base = "${builtFor}/";`);
  return root;
};

describe('assertBuiltFor', () => {
  it('accepts a build whose inlined base is this version’s directory', () => {
    const dist = remoteDistDir(workspaceWithBuild(ORIGIN), 'footer');

    expect(() => assertBuiltFor(dist, 'footer', VERSION)).not.toThrow();
  });

  it('refuses a build made for another version, such as a stale cached one', () => {
    const dist = remoteDistDir(
      workspaceWithBuild('https://anselmmarie.com/_remotes/footer/ffffffffffff'),
      'footer'
    );

    expect(() => assertBuiltFor(dist, 'footer', VERSION)).toThrow(`was not made for ${ORIGIN}`);
  });

  it('refuses a directory with no remoteEntry.js', () => {
    const dist = remoteDistDir(workspaceWithBuild(ORIGIN, false), 'footer');

    expect(() => assertBuiltFor(dist, 'footer', VERSION)).toThrow('no remoteEntry.js build');
  });
});

describe('deployRemote', () => {
  it('builds for the version, uploads it, and only then moves the pointer (D107)', () => {
    const { run, calls } = fakeRun();
    deployRemote(fakeContext(run, workspaceWithBuild(ORIGIN)), 'footer', VERSION);

    expect(calls.map(describeCall)).toEqual([
      'pnpm nx run footer:build',
      's3 sync',
      's3 cp',
      'cloudfront create-invalidation',
    ]);
  });

  it('builds with the versioned origin and no Nx cache', () => {
    const { run, calls } = fakeRun();
    deployRemote(fakeContext(run, workspaceWithBuild(ORIGIN)), 'footer', VERSION);

    expect(calls[0]?.args).toContain('--skip-nx-cache');
    expect(calls[0]?.env).toEqual({ PORTFOLIO_FOOTER_ORIGIN: ORIGIN });
  });

  it('uploads immutably to the version’s prefix, leaving out the standalone index.html', () => {
    const { run, calls } = fakeRun();
    deployRemote(fakeContext(run, workspaceWithBuild(ORIGIN)), 'footer', VERSION);

    expect(calls[1]?.args).toEqual(
      expect.arrayContaining([
        `s3://site-bucket/_remotes/footer/${VERSION}/`,
        IMMUTABLE,
        'index.html',
      ])
    );
  });

  it('uploads nothing when the build was made for another version', () => {
    const { run, calls } = fakeRun();
    const ctx = fakeContext(run, workspaceWithBuild('https://example.com/wrong'));

    expect(() => deployRemote(ctx, 'footer', VERSION)).toThrow('was not made for');
    expect(calls.map(describeCall)).toEqual(['pnpm nx run footer:build']);
  });
});
