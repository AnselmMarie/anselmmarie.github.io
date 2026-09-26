import { describe, expect, it, vi } from 'vitest';

import { fakeContext, fakeRun } from '../../test-helpers/fake-run.test-helpers.js';
import { FULL_PLAN } from '../deploy-plan/deploy-plan.js';
import * as remote from '../deploy-remote/deploy-remote.js';
import * as shell from '../deploy-shell/deploy-shell.js';
import { pointerSource } from '../remote-pointer/remote-pointer.js';
import * as release from '../remote-release/remote-release.js';
import { affectedProjects, dispatch, resolvePlan, runDeploy } from './deploy-run.js';

const VERSION = '0123456789ab';

describe('affectedProjects', () => {
  it('asks Nx for the affected projects between base and head', () => {
    const { run, calls } = fakeRun(() => '["footer"]');

    expect(affectedProjects(run, 'aaa', 'bbb')).toEqual(['footer']);
    expect(calls[0]?.args).toEqual([
      'nx',
      'show',
      'projects',
      '--affected',
      '--base=aaa',
      '--head=bbb',
      '--json',
    ]);
  });

  it('returns null for an unusable base without asking Nx', () => {
    const { run, calls } = fakeRun();

    expect(affectedProjects(run, '0000000', 'bbb')).toBeNull();
    expect(calls).toEqual([]);
  });
});

describe('resolvePlan', () => {
  it('deploys everything for --all', () => {
    expect(resolvePlan(fakeRun().run, 'aaa', 'bbb', true)).toBe(FULL_PLAN);
  });

  it('deploys everything when there is no usable base', () => {
    expect(resolvePlan(fakeRun().run, undefined, 'bbb', false)).toBe(FULL_PLAN);
  });

  it('deploys what is affected otherwise', () => {
    expect(resolvePlan(fakeRun(() => '["footer"]').run, 'aaa', 'bbb', false)).toEqual({
      remotes: ['footer'],
      shell: false,
    });
  });
});

describe('runDeploy', () => {
  it('deploys every remote first and the shell last', () => {
    const order: string[] = [];
    vi.spyOn(remote, 'deployRemote').mockImplementation((_ctx, name) => void order.push(name));
    vi.spyOn(shell, 'deployShell').mockImplementation(() => void order.push('shell'));
    runDeploy(fakeContext(fakeRun().run), FULL_PLAN, VERSION);

    expect(order).toEqual(['header', 'footer', 'homepage', 'portfolio-item', 'shell']);
    vi.restoreAllMocks();
  });

  it('says so, and runs nothing, when nothing deployable is affected', () => {
    const { run, calls } = fakeRun();
    const ctx = fakeContext(run);
    runDeploy(ctx, { remotes: [], shell: false }, VERSION);

    expect(ctx.lines).toEqual(['Nothing deployable is affected.']);
    expect(calls).toEqual([]);
  });
});

describe('dispatch', () => {
  it('lists versions and marks the one the pointer names', () => {
    const { run } = fakeRun(({ args }) => {
      if (args.includes('KeyCount')) return '1';
      if (args.includes('CommonPrefixes[].Prefix')) {
        return JSON.stringify(['_remotes/footer/aaaaaaaaaaaa/', `_remotes/footer/${VERSION}/`]);
      }
      return pointerSource(VERSION);
    });
    const ctx = fakeContext(run);
    dispatch(ctx, { kind: 'versions', remote: 'footer' });

    expect(ctx.lines).toEqual(['aaaaaaaaaaaa', `${VERSION}  ← current`]);
  });

  it('routes rollback to rollbackRemote', () => {
    const rollback = vi.spyOn(release, 'rollbackRemote').mockImplementation(() => undefined);
    const ctx = fakeContext(fakeRun().run);
    dispatch(ctx, { kind: 'rollback', remote: 'footer', version: VERSION });

    expect(rollback).toHaveBeenCalledWith(ctx, 'footer', VERSION);
    vi.restoreAllMocks();
  });
});
