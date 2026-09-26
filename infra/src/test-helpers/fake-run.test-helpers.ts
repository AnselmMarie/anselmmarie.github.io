import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { Run } from '../deploy/aws-cli/aws-cli.js';
import type { DeployContext } from '../deploy/deploy-remote/deploy-remote.js';

export interface Call {
  readonly command: string;
  readonly args: readonly string[];
  readonly env?: NodeJS.ProcessEnv;
}

/** A `Run` that records every call and answers from `respond`. Never reaches AWS. */
export const fakeRun = (respond: (call: Call) => string = () => '') => {
  const calls: Call[] = [];
  const run: Run = (command, args, env) => {
    const call = { command, args: [...args], env };
    calls.push(call);
    return respond(call);
  };
  return { run, calls };
};

/** `aws s3 sync` → `s3 sync`, for asserting the order of steps compactly. */
export const describeCall = ({ command, args }: Call): string =>
  command === 'aws' ? `${args[0]} ${args[1]}` : `${command} ${args.slice(0, 3).join(' ')}`;

export const fakeContext = (
  run: Run,
  workspaceRoot = mkdtempSync(join(tmpdir(), 'ws-'))
): DeployContext & { lines: string[] } => {
  const lines: string[] = [];
  return {
    run,
    target: { bucket: 'site-bucket', distributionId: 'EDIST' },
    tmpDir: mkdtempSync(join(tmpdir(), 'deploy-tmp-')),
    workspaceRoot,
    log: (line) => lines.push(line),
    lines,
  };
};
