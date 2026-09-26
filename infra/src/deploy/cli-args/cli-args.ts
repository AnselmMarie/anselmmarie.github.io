import { parseArgs } from 'node:util';

import type { RemoteApp } from '../../site-config/site-config.js';
import { parseRemote } from '../deploy-plan/deploy-plan.js';
import { assertVersion, versionFromSha } from '../remote-pointer/remote-pointer.js';

export type Command =
  | { kind: 'deploy'; base: string | undefined; version: string; head: string; all: boolean }
  | { kind: 'rollback'; remote: RemoteApp; version: string }
  | { kind: 'versions'; remote: RemoteApp };

export const USAGE = [
  'Usage:',
  '  deploy --head <sha> [--base <sha>] [--all]   deploy what changed between base and head',
  '  rollback <remote> <version>                  point a remote at an earlier version',
  '  versions <remote>                            list a remote’s versions and the current one',
].join('\n');

/** Parses the CLI's arguments. Input from a person, so every field is checked (D107). */
export const parseCommand = (argv: readonly string[]): Command => {
  const { positionals, values } = parseArgs({
    args: [...argv],
    allowPositionals: true,
    options: {
      base: { type: 'string' },
      head: { type: 'string' },
      all: { type: 'boolean', default: false },
    },
  });
  const [kind, remote, version] = positionals;

  if (kind === 'deploy') {
    if (!values.head) throw new Error(`deploy needs --head.\n${USAGE}`);
    return {
      kind,
      base: values.base,
      head: values.head,
      version: versionFromSha(values.head),
      all: values.all ?? false,
    };
  }
  if (kind === 'rollback') {
    assertVersion(version ?? '');
    return { kind, remote: parseRemote(remote), version: version ?? '' };
  }
  if (kind === 'versions') return { kind, remote: parseRemote(remote) };

  throw new Error(`Unknown command "${kind ?? ''}".\n${USAGE}`);
};
