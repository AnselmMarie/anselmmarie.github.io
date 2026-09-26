import { describe, expect, it } from 'vitest';

import { describeCall, fakeContext, fakeRun } from '../../test-helpers/fake-run.test-helpers.js';
import { IMMUTABLE, ONE_DAY } from '../aws-cli/aws-cli.js';
import { deployShell, shellBuildEnv } from './deploy-shell.js';

describe('shellBuildEnv', () => {
  it('points the shell at every remote’s stable pointer directory, never a version (D107)', () => {
    expect(shellBuildEnv()).toEqual({
      PORTFOLIO_HEADER_ORIGIN: 'https://anselmmarie.com/_remotes/header',
      PORTFOLIO_FOOTER_ORIGIN: 'https://anselmmarie.com/_remotes/footer',
      PORTFOLIO_HOMEPAGE_ORIGIN: 'https://anselmmarie.com/_remotes/homepage',
      PORTFOLIO_PORTFOLIO_ITEM_ORIGIN: 'https://anselmmarie.com/_remotes/portfolio-item',
    });
  });
});

describe('deployShell', () => {
  it('builds, uploads static files, and only then switches the Lambda', () => {
    const { run, calls } = fakeRun();
    deployShell(fakeContext(run));

    expect(calls.map(describeCall)).toEqual([
      'pnpm nx run shell:build',
      's3 sync',
      's3 sync',
      'pnpm --filter @portfolio/infra exec',
    ]);
  });

  it('builds the Lambda preset explicitly, with no Nx cache', () => {
    const { run, calls } = fakeRun();
    deployShell(fakeContext(run));

    expect(calls[0]?.args).toContain('--skip-nx-cache');
    expect(calls[0]?.env).toEqual(expect.objectContaining({ NITRO_PRESET: 'aws_lambda' }));
  });

  it('caches hashed files for a year and unhashed images for a day', () => {
    const { run, calls } = fakeRun();
    deployShell(fakeContext(run));

    expect(calls[1]?.args).toEqual(expect.arrayContaining([IMMUTABLE, '--exclude', 'images/*']));
    expect(calls[2]?.args).toEqual(expect.arrayContaining(['s3://site-bucket/images/', ONE_DAY]));
  });

  it('hands cdk the server build it just made', () => {
    const { run, calls } = fakeRun();
    const ctx = fakeContext(run);
    deployShell(ctx);

    expect(calls[3]?.args).toEqual(expect.arrayContaining(['cdk', 'deploy']));
    expect(calls[3]?.env?.SHELL_SERVER_DIR).toBe(`${ctx.workspaceRoot}/apps/shell/.output/server`);
  });
});
