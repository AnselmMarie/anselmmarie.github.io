import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

import { runCommand } from '../aws-cli/aws-cli.js';
import { pointerSource, versionFromPointer, versionFromSha } from './remote-pointer.js';

const VERSION = '0123456789ab';

/**
 * Lays a remote out the way the bucket does (D107): the pointer beside a
 * versioned entry whose chunk is imported by RELATIVE path, as a real build's is.
 */
const layOutRemote = (): string => {
  const remoteDir = mkdtempSync(join(tmpdir(), 'remote-'));
  const versionDir = join(remoteDir, VERSION);
  mkdirSync(join(versionDir, 'assets'), { recursive: true });
  writeFileSync(join(versionDir, 'assets', 'chunk.js'), 'export const chunk = "from-chunk";\n');
  writeFileSync(
    join(versionDir, 'remoteEntry.js'),
    [
      "import { chunk } from './assets/chunk.js';",
      'export const get = () => ({ chunk, entryUrl: import.meta.url });',
      'export const init = () => "initialised";',
    ].join('\n')
  );
  writeFileSync(join(remoteDir, 'remoteEntry.js'), pointerSource(VERSION));
  return remoteDir;
};

/**
 * Imports the pointer in a plain Node ESM process and reports what it exposes.
 *
 * ⚠️ Not `await import()` in the spec: Vitest's module runner rewrites
 * `import.meta.url` and drops its query, which a browser and plain Node don't.
 * Testing there would test the runner, not the module.
 */
const importPointer = (query = ''): { init: string; chunk: string; entryUrl: string } => {
  const url = `${pathToFileURL(join(layOutRemote(), 'remoteEntry.js')).href}${query}`;
  const script = `const p = await import(${JSON.stringify(url)});
    process.stdout.write(JSON.stringify({ init: p.init(), ...p.get() }));`;
  return JSON.parse(runCommand('node', ['--input-type=module', '-e', script]));
};

describe('pointerSource', () => {
  it('re-exports the versioned entry, whose relative chunks still resolve (D107)', () => {
    const pointer = importPointer();

    expect(pointer.init).toBe('initialised');
    expect(pointer.chunk).toBe('from-chunk');
    expect(pointer.entryUrl).toMatch(new RegExp(`/${VERSION}/remoteEntry\\.js$`));
  });

  it('forwards its query to the versioned entry, so a retry refetches both (D106)', () => {
    expect(importPointer('?mf-retry=2').entryUrl).toMatch(/\/remoteEntry\.js\?mf-retry=2$/);
  });

  it('refuses anything that is not a 12-character version', () => {
    expect(() => pointerSource('../evil')).toThrow('is not a version');
    expect(() => pointerSource('0123456789AB')).toThrow('is not a version');
  });
});

describe('versionFromPointer', () => {
  it('reads back the version a pointer names', () => {
    expect(versionFromPointer(pointerSource(VERSION))).toBe(VERSION);
  });

  it('returns null for text that is not a pointer', () => {
    expect(versionFromPointer('export const get = 1;')).toBeNull();
  });
});

describe('versionFromSha', () => {
  it('takes the first 12 characters, lowercased', () => {
    expect(versionFromSha(' 0123456789ABCDEF0123\n')).toBe(VERSION);
  });

  it('refuses a short or non-hex SHA', () => {
    expect(() => versionFromSha('abc')).toThrow('is not a version');
  });
});
