import { describe, expect, it } from 'vitest';

import { parseCommand } from './cli-args.js';

const HEAD = '0123456789abcdef0123456789abcdef01234567';

describe('parseCommand', () => {
  it('parses a deploy, deriving the version from --head', () => {
    expect(parseCommand(['deploy', '--base', 'aaa', '--head', HEAD])).toEqual({
      kind: 'deploy',
      base: 'aaa',
      head: HEAD,
      version: '0123456789ab',
      all: false,
    });
  });

  it('parses --all', () => {
    expect(parseCommand(['deploy', '--head', HEAD, '--all'])).toMatchObject({
      all: true,
      base: undefined,
    });
  });

  it('requires --head for a deploy', () => {
    expect(() => parseCommand(['deploy'])).toThrow('deploy needs --head');
  });

  it('parses a rollback', () => {
    expect(parseCommand(['rollback', 'footer', 'aaaaaaaaaaaa'])).toEqual({
      kind: 'rollback',
      remote: 'footer',
      version: 'aaaaaaaaaaaa',
    });
  });

  it('refuses a rollback to something that is not a version', () => {
    expect(() => parseCommand(['rollback', 'footer', 'latest'])).toThrow('is not a version');
  });

  it('refuses a rollback of an unknown remote', () => {
    expect(() => parseCommand(['rollback', 'shell', 'aaaaaaaaaaaa'])).toThrow(
      'Unknown remote "shell"'
    );
  });

  it('parses versions', () => {
    expect(parseCommand(['versions', 'header'])).toEqual({ kind: 'versions', remote: 'header' });
  });

  it('shows the usage for an unknown command', () => {
    expect(() => parseCommand(['ship'])).toThrow('Usage:');
  });
});
