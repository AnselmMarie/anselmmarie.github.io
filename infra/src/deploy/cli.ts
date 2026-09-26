import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { readSiteTarget, runCommand } from './aws-cli/aws-cli.js';
import { parseCommand } from './cli-args/cli-args.js';
import { dispatch } from './deploy-run/deploy-run.js';

/**
 * The deploy and rollback entry point (Slice 8, D107). Runs from `infra/`:
 *
 *   pnpm --filter @portfolio/infra exec tsx src/deploy/cli.ts deploy --base <sha> --head <sha>
 *
 * The runbook, docs/architecture/deploy-and-rollback.md, covers every command.
 * Process wiring only; everything it calls is specced against a fake `Run`.
 */
try {
  const command = parseCommand(process.argv.slice(2));
  dispatch(
    {
      run: runCommand,
      target: readSiteTarget(runCommand),
      tmpDir: mkdtempSync(join(tmpdir(), 'portfolio-deploy-')),
      workspaceRoot: resolve(import.meta.dirname, '../../..'),
      log: (line) => process.stdout.write(`${line}\n`),
    },
    command
  );
} catch (error: unknown) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
