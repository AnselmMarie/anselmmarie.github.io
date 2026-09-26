import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  type Call,
  describeCall,
  fakeContext,
  fakeRun,
} from '../../test-helpers/fake-run.test-helpers.js';
import { NEVER_CACHE } from '../aws-cli/aws-cli.js';
import { pointerSource } from '../remote-pointer/remote-pointer.js';
import { currentVersion, listVersions, releaseVersion, rollbackRemote } from './remote-release.js';

const OLD = 'aaaaaaaaaaaa';
const NEW = 'bbbbbbbbbbbb';

/** A bucket with footer versions OLD and NEW, and the pointer on NEW. */
const bucket = (call: Call): string => {
  const args = call.args.join(' ');
  if (args.includes('--query KeyCount')) {
    return /_remotes\/footer\/(remoteEntry\.js|aaaaaaaaaaaa\/|bbbbbbbbbbbb\/)/.test(args)
      ? '1'
      : '0';
  }
  if (args.includes('CommonPrefixes')) {
    return JSON.stringify([`_remotes/footer/${OLD}/`, `_remotes/footer/${NEW}/`]);
  }
  if (args.startsWith('s3 cp s3://')) return pointerSource(NEW);
  return '';
};

describe('releaseVersion', () => {
  it('uploads the pointer uncached, then invalidates exactly that path (D107, R12)', () => {
    const { run, calls } = fakeRun();
    const ctx = fakeContext(run);
    releaseVersion(ctx, 'footer', NEW);

    expect(calls.map(describeCall)).toEqual(['s3 cp', 'cloudfront create-invalidation']);
    expect(calls[0]?.args).toEqual(
      expect.arrayContaining(['s3://site-bucket/_remotes/footer/remoteEntry.js', NEVER_CACHE])
    );
    expect(calls[1]?.args).toEqual(
      expect.arrayContaining(['EDIST', '/_remotes/footer/remoteEntry.js'])
    );
  });

  it('uploads a pointer naming the version', () => {
    const { run, calls } = fakeRun();
    releaseVersion(fakeContext(run), 'footer', NEW);

    expect(readFileSync(calls[0]?.args[2] ?? '', 'utf8')).toBe(pointerSource(NEW));
  });
});

describe('rollbackRemote', () => {
  it('points the remote back at a version still in the bucket, and says from what', () => {
    const { run, calls } = fakeRun(bucket);
    const ctx = fakeContext(run);
    rollbackRemote(ctx, 'footer', OLD);

    const upload = calls.find((call) => call.args[1] === 'cp' && call.args[3]?.startsWith('s3://'));
    expect(readFileSync(upload?.args[2] ?? '', 'utf8')).toBe(pointerSource(OLD));
    expect(ctx.lines).toContain(`footer: rolled back from ${NEW} to ${OLD}`);
  });

  it('refuses a version that was never deployed, and writes nothing', () => {
    const { run, calls } = fakeRun(bucket);

    expect(() => rollbackRemote(fakeContext(run), 'footer', 'cccccccccccc')).toThrow(
      'footer has no version cccccccccccc'
    );
    expect(calls.some((call) => call.args[1] === 'cp')).toBe(false);
  });
});

describe('currentVersion', () => {
  it('reads the version out of the live pointer', () => {
    expect(currentVersion(fakeContext(fakeRun(bucket).run), 'footer')).toBe(NEW);
  });

  it('is null before a remote’s first deploy', () => {
    expect(currentVersion(fakeContext(fakeRun(() => '0').run), 'header')).toBeNull();
  });
});

describe('listVersions', () => {
  it('lists version directories and ignores anything else under the prefix', () => {
    const { run } = fakeRun(() =>
      JSON.stringify([
        `_remotes/footer/${OLD}/`,
        '_remotes/footer/stray/',
        `_remotes/footer/${NEW}/`,
      ])
    );

    expect(listVersions(fakeContext(run), 'footer')).toEqual([OLD, NEW]);
  });
});
