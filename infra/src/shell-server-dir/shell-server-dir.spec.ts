import { dirname } from 'node:path';
import { describe, expect, it } from 'vitest';

import { fakeShellBuild } from '../test-helpers/synth-stack.test-helpers.js';
import { DEFAULT_SHELL_SERVER_DIR, resolveShellServerDir } from './shell-server-dir.js';

describe('resolveShellServerDir', () => {
  it('accepts an aws-lambda build and returns its absolute server directory', () => {
    const serverDir = fakeShellBuild();

    expect(resolveShellServerDir(serverDir)).toBe(serverDir);
  });

  it('resolves the default against infra/, where `cdk` runs', () => {
    const serverDir = fakeShellBuild();
    // Stand in for infra/ one level below a fake workspace root.
    const cwd = `${dirname(dirname(serverDir))}/infra`;

    expect(() => resolveShellServerDir(undefined, cwd)).toThrow(DEFAULT_SHELL_SERVER_DIR.slice(3));
  });

  it('refuses the E2E node-server build that shares the same .output directory (D105)', () => {
    expect(() => resolveShellServerDir(fakeShellBuild('node-server'))).toThrow(
      'is preset "node-server", not "aws-lambda"'
    );
  });

  it('refuses a directory with no server entry, naming the build command', () => {
    expect(() => resolveShellServerDir(fakeShellBuild('aws-lambda', false))).toThrow(
      'pnpm nx run shell:build'
    );
  });
});
