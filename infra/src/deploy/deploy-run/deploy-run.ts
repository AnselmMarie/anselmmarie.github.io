import type { Run } from '../aws-cli/aws-cli.js';
import type { Command } from '../cli-args/cli-args.js';
import {
  type DeployPlan,
  FULL_PLAN,
  isUnusableBase,
  planDeploy,
} from '../deploy-plan/deploy-plan.js';
import { type DeployContext, deployRemote } from '../deploy-remote/deploy-remote.js';
import { deployShell } from '../deploy-shell/deploy-shell.js';
import { currentVersion, listVersions, rollbackRemote } from '../remote-release/remote-release.js';

/**
 * `nx show projects --affected`, read as JSON (D23). D50: the names are bare.
 *
 * ⚠️ An unusable base returns `null` rather than guessing, and the caller then
 * deploys everything. `affected` against a wrong base checks nothing and reports
 * green, the failure `ci.yml`'s gates already avoid by not using it.
 */
export const affectedProjects = (
  run: Run,
  base: string | undefined,
  head: string
): string[] | null => {
  if (isUnusableBase(base)) return null;
  const raw = run('pnpm', [
    'nx',
    'show',
    'projects',
    '--affected',
    `--base=${base}`,
    `--head=${head}`,
    '--json',
  ]);
  return JSON.parse(raw) as string[];
};

export const resolvePlan = (
  run: Run,
  base: string | undefined,
  head: string,
  all: boolean
): DeployPlan => {
  if (all) return FULL_PLAN;
  const affected = affectedProjects(run, base, head);
  return affected ? planDeploy(affected) : FULL_PLAN;
};

/**
 * Runs a plan: every remote first, the shell last, so a remote the new shell
 * references is already live when it goes out (Slice 8's own note). One failure
 * stops the run. The remotes already released stay released, which is fine:
 * each is independently deployable, and rollback is per remote.
 */
export const runDeploy = (ctx: DeployContext, plan: DeployPlan, version: string): void => {
  if (plan.remotes.length === 0 && !plan.shell) {
    ctx.log('Nothing deployable is affected.');
    return;
  }
  ctx.log(
    `Deploying ${[...plan.remotes, ...(plan.shell ? ['shell'] : [])].join(', ')} @ ${version}`
  );
  for (const remote of plan.remotes) deployRemote(ctx, remote, version);
  if (plan.shell) deployShell(ctx);
};

/** Runs one parsed CLI command. */
export const dispatch = (ctx: DeployContext, command: Command): void => {
  if (command.kind === 'deploy') {
    runDeploy(ctx, resolvePlan(ctx.run, command.base, command.head, command.all), command.version);
  } else if (command.kind === 'rollback') {
    rollbackRemote(ctx, command.remote, command.version);
  } else {
    const current = currentVersion(ctx, command.remote);
    for (const version of listVersions(ctx, command.remote)) {
      ctx.log(`${version}${version === current ? '  ← current' : ''}`);
    }
  }
};
