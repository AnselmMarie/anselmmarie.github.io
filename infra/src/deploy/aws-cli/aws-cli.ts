import { execFileSync } from 'node:child_process';

import { STACK_OUTPUTS } from '../../portfolio-stack.js';
import { STACK_NAME } from '../../site-config/site-config.js';

/**
 * Runs a command and returns its stdout. Injected everywhere, so the deploy
 * logic is tested against a recording fake and never against AWS.
 */
export type Run = (command: string, args: readonly string[], env?: NodeJS.ProcessEnv) => string;

export const IMMUTABLE = 'public, max-age=31536000, immutable';
export const ONE_DAY = 'public, max-age=86400';
/** D107 — a pointer must never be cached, anywhere: CloudFront, a proxy, the browser. */
export const NEVER_CACHE = 'no-cache, no-store, must-revalidate';

export const JS_CONTENT_TYPE = 'text/javascript; charset=utf-8';

/** Streams output to the terminal (builds), or captures it (queries). */
export const runCommand: Run = (command, args, env) =>
  execFileSync(command, args, {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 64 * 1024 * 1024,
  });

export interface SiteTarget {
  readonly bucket: string;
  readonly distributionId: string;
}

/** Reads the bucket and distribution from the deployed stack's outputs. */
export const readSiteTarget = (run: Run): SiteTarget => {
  const raw = run('aws', [
    'cloudformation',
    'describe-stacks',
    '--stack-name',
    STACK_NAME,
    '--query',
    'Stacks[0].Outputs',
    '--output',
    'json',
  ]);
  const outputs = JSON.parse(raw) as { OutputKey: string; OutputValue: string }[] | null;
  const value = (key: string): string => {
    const found = outputs?.find((output) => output.OutputKey === key)?.OutputValue;
    if (!found) throw new Error(`Stack ${STACK_NAME} has no output ${key}. Has it been deployed?`);
    return found;
  };
  return {
    bucket: value(STACK_OUTPUTS.bucketName),
    distributionId: value(STACK_OUTPUTS.distributionId),
  };
};

/** `aws s3 sync` with no `--delete`: an upload never removes an earlier version (D107). */
export const syncUp = (
  run: Run,
  from: string,
  to: string,
  cacheControl: string,
  excludes: readonly string[] = []
): void => {
  run('aws', [
    's3',
    'sync',
    from,
    to,
    '--cache-control',
    cacheControl,
    ...excludes.flatMap((pattern) => ['--exclude', pattern]),
    '--no-progress',
  ]);
};

export const invalidate = (run: Run, distributionId: string, paths: readonly string[]): void => {
  run('aws', [
    'cloudfront',
    'create-invalidation',
    '--distribution-id',
    distributionId,
    '--paths',
    ...paths,
  ]);
};

/**
 * Counts keys under a prefix rather than using `head-object`, which exits
 * non-zero for a missing key *and* for an expired login alike. Catching that
 * would report "no such version" when the real problem is credentials.
 */
export const countKeys = (run: Run, bucket: string, prefix: string): number => {
  const raw = run('aws', [
    's3api',
    'list-objects-v2',
    '--bucket',
    bucket,
    '--prefix',
    prefix,
    '--max-keys',
    '1',
    '--query',
    'KeyCount',
    '--output',
    'text',
  ]);
  return Number.parseInt(raw.trim(), 10) || 0;
};

/** The version directories under `_remotes/<remote>/`, via `--delimiter`. */
export const listPrefixes = (run: Run, bucket: string, prefix: string): string[] => {
  const raw = run('aws', [
    's3api',
    'list-objects-v2',
    '--bucket',
    bucket,
    '--prefix',
    prefix,
    '--delimiter',
    '/',
    '--query',
    'CommonPrefixes[].Prefix',
    '--output',
    'json',
  ]);
  return (JSON.parse(raw) as string[] | null) ?? [];
};

export const putText = (
  run: Run,
  bucket: string,
  key: string,
  file: string,
  cacheControl: string
): void => {
  run('aws', [
    's3',
    'cp',
    file,
    `s3://${bucket}/${key}`,
    '--cache-control',
    cacheControl,
    '--content-type',
    JS_CONTENT_TYPE,
    '--no-progress',
  ]);
};

/** Reads an object's body as text, via stdout (`-`). */
export const readText = (run: Run, bucket: string, key: string): string =>
  run('aws', ['s3', 'cp', `s3://${bucket}/${key}`, '-']);
