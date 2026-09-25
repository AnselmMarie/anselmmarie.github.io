/**
 * The deployment's fixed facts (D107–D109). Every construct and the deploy CLI
 * read them from here, so the domain, the account and the path layout are each
 * stated once.
 */

/** D109 — the account and region, deployed with the `ansPortfolio` SSO profile. */
export const AWS_ACCOUNT = '694951015005';
export const AWS_REGION = 'us-east-1';

export const STACK_NAME = 'PortfolioStack';

/** D109 — the apex serves the site; `www` 301-redirects to it. */
export const APEX_DOMAIN = 'anselmmarie.com';
export const WWW_DOMAIN = `www.${APEX_DOMAIN}`;
export const SITE_ORIGIN = `https://${APEX_DOMAIN}`;

/** D109 — the only GitHub ref whose workflow runs may assume the deploy role. */
export const GITHUB_REPOSITORY = 'AnselmMarie/anselmmarie.github.io';
export const GITHUB_DEPLOY_REF = 'refs/heads/master';

/**
 * Fixed rather than generated, so `ci.yml` can state the role's ARN outright.
 * ⚠️ `.github/workflows/ci.yml` repeats this name; change both together.
 */
export const GITHUB_DEPLOY_ROLE_NAME = 'portfolio-github-deploy';

/** The four federated remotes, by Nx project name (D50: bare, unscoped). */
export const REMOTES = ['header', 'footer', 'homepage', 'portfolio-item'] as const;
export type RemoteApp = (typeof REMOTES)[number];

export const SHELL_APP = 'shell';
export const INFRA_PROJECT = 'infra';

/** D107 — every remote lives under this bucket prefix and URL path. */
export const REMOTES_PREFIX = '_remotes';

/** The stable pointer's key, e.g. `_remotes/footer/remoteEntry.js`. */
export const pointerKey = (remote: RemoteApp): string =>
  `${REMOTES_PREFIX}/${remote}/remoteEntry.js`;

/** A version's key prefix, e.g. `_remotes/footer/0123456789ab`. */
export const versionPrefix = (remote: RemoteApp, version: string): string =>
  `${REMOTES_PREFIX}/${remote}/${version}`;

/**
 * The env var each remote's `vite.config.ts` reads for its `base` (D42), and the
 * shell's reads for its `remotes` map. One name, two meanings: a remote is built
 * against its versioned directory, the shell against the stable pointer's.
 */
export const originEnvKey = (remote: RemoteApp): string =>
  `PORTFOLIO_${remote.toUpperCase().replaceAll('-', '_')}_ORIGIN`;

/** What a remote is built against: `https://anselmmarie.com/_remotes/footer/<version>`. */
export const remoteBuildOrigin = (remote: RemoteApp, version: string): string =>
  `${SITE_ORIGIN}/${versionPrefix(remote, version)}`;

/** What the shell is built against: `https://anselmmarie.com/_remotes/footer`. */
export const shellRemoteOrigin = (remote: RemoteApp): string =>
  `${SITE_ORIGIN}/${REMOTES_PREFIX}/${remote}`;

/** A version is a 12-character lowercase commit-SHA prefix. */
export const VERSION_PATTERN = /^[0-9a-f]{12}$/;

export const isRemoteApp = (name: string): name is RemoteApp =>
  (REMOTES as readonly string[]).includes(name);
