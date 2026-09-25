import {
  INFRA_PROJECT,
  isRemoteApp,
  REMOTES,
  type RemoteApp,
  SHELL_APP,
} from '../../site-config/site-config.js';

export interface DeployPlan {
  /** Remotes to build and upload, in a fixed order. */
  readonly remotes: readonly RemoteApp[];
  /** Whether to rebuild the shell and `cdk deploy`. Always runs after the remotes. */
  readonly shell: boolean;
}

/** A missing or all-zero base: a first push, or a branch created with this commit. */
export const isUnusableBase = (base: string | undefined): boolean =>
  !base || /^0+$/.test(base.trim());

/**
 * Turns `nx show projects --affected` into what to deploy (D23, D27).
 *
 * - A remote deploys when it is affected. A `libs/features/footer` change reaches
 *   only `footer`, and a `libs/ui/theme` change reaches every app, which is
 *   verification 1 and its negative control (R6). This function trusts the graph
 *   for both; the graph is what those verifications test.
 * - The shell deploys when the shell *or `infra`* is affected, because the
 *   Lambda is in the stack and a stack change is a `cdk deploy`.
 * - Libraries and `e2e` deploy nothing on their own; they arrive through the
 *   apps that depend on them.
 */
export const planDeploy = (affected: readonly string[]): DeployPlan => {
  const names = new Set(affected);
  return {
    remotes: REMOTES.filter((remote) => names.has(remote)),
    shell: names.has(SHELL_APP) || names.has(INFRA_PROJECT),
  };
};

/** Everything, for a first deploy or an unusable base. */
export const FULL_PLAN: DeployPlan = { remotes: REMOTES, shell: true };

/** Parses `--remote` input, which reaches this from a person typing. */
export const parseRemote = (name: string | undefined): RemoteApp => {
  if (name && isRemoteApp(name)) return name;
  throw new Error(`Unknown remote "${name ?? ''}". Expected one of: ${REMOTES.join(', ')}.`);
};
