import { describe, expect, it } from 'vitest';

import { fakeRun } from '../../test-helpers/fake-run.test-helpers.js';
import {
  countKeys,
  IMMUTABLE,
  listPrefixes,
  readSiteTarget,
  readText,
  runCommand,
  syncUp,
} from './aws-cli.js';

const outputs = JSON.stringify([
  { OutputKey: 'SiteBucketName', OutputValue: 'site-bucket' },
  { OutputKey: 'DistributionId', OutputValue: 'EDIST' },
]);

describe('readSiteTarget', () => {
  it('reads the bucket and distribution from the stack outputs', () => {
    const { run, calls } = fakeRun(() => outputs);

    expect(readSiteTarget(run)).toEqual({ bucket: 'site-bucket', distributionId: 'EDIST' });
    expect(calls[0]?.args).toEqual(expect.arrayContaining(['describe-stacks', 'PortfolioStack']));
  });

  it('names the missing output when the stack has not been deployed', () => {
    const { run } = fakeRun(() => 'null');

    expect(() => readSiteTarget(run)).toThrow('has no output SiteBucketName');
  });
});

describe('syncUp', () => {
  it('uploads with the cache header and excludes, and never deletes (D107)', () => {
    const { run, calls } = fakeRun();
    syncUp(run, 'dist', 's3://b/x/', IMMUTABLE, ['index.html']);

    expect(calls[0]?.args).toEqual([
      's3',
      'sync',
      'dist',
      's3://b/x/',
      '--cache-control',
      IMMUTABLE,
      '--exclude',
      'index.html',
      '--no-progress',
    ]);
    expect(calls[0]?.args).not.toContain('--delete');
  });
});

describe('countKeys', () => {
  it('parses the count the query prints', () => {
    expect(countKeys(fakeRun(() => '1\n').run, 'b', 'k')).toBe(1);
  });

  it('reads the "None" an empty prefix prints as zero', () => {
    expect(countKeys(fakeRun(() => 'None\n').run, 'b', 'k')).toBe(0);
  });

  it('lets an AWS error (an expired login) throw rather than reading it as missing', () => {
    const { run } = fakeRun(() => {
      throw new Error('ExpiredToken');
    });

    expect(() => countKeys(run, 'b', 'k')).toThrow('ExpiredToken');
  });
});

describe('listPrefixes', () => {
  it('returns the common prefixes', () => {
    const { run } = fakeRun(() => '["_remotes/footer/0123456789ab/"]');

    expect(listPrefixes(run, 'b', '_remotes/footer/')).toEqual(['_remotes/footer/0123456789ab/']);
  });

  it('returns an empty list for the null an empty prefix prints', () => {
    expect(listPrefixes(fakeRun(() => 'null').run, 'b', 'p')).toEqual([]);
  });
});

describe('readText', () => {
  it('streams the object to stdout', () => {
    const { run, calls } = fakeRun(() => 'body');

    expect(readText(run, 'b', 'k')).toBe('body');
    expect(calls[0]?.args).toEqual(['s3', 'cp', 's3://b/k', '-']);
  });
});

describe('runCommand', () => {
  it('returns stdout and passes extra env to the child', () => {
    const out = runCommand('node', ['-e', 'process.stdout.write(process.env.PROBE ?? "")'], {
      PROBE: 'seen',
    });

    expect(out).toBe('seen');
  });
});
