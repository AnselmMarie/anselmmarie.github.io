import type { RemoteEntry, RemoteName, RemoteRegistry } from '@portfolio/shared-types';

import { readEnv } from '../read-env/read-env.js';

/**
 * Where the shell resolves each remote (D19).
 *
 * ⚠️ **All four rows exist as of Slice 4; three of them point at remotes that
 * have not been built.** That is the seam, not an oversight: slices 5, 6 and 7
 * run concurrently and would otherwise all add a row to this file at once
 * (parallelization.md). Each of those slices *fills in* its remote — it does
 * not create its entry.
 *
 * Until then a request to one of those origins fails, which is exactly the
 * path Slice 4's boundary and fallbacks handle. A registry row for a remote
 * that is down is indistinguishable from one for a remote that does not exist
 * yet, and that symmetry is what makes the fan-out safe.
 */

/** Dev origins. Each matches `strictPort` in the corresponding app. */
export const DEFAULT_HEADER_ORIGIN = 'http://localhost:4174';
export const DEFAULT_FOOTER_ORIGIN = 'http://localhost:4175';
export const DEFAULT_HOMEPAGE_ORIGIN = 'http://localhost:4176';
export const DEFAULT_PORTFOLIO_ITEM_ORIGIN = 'http://localhost:4177';

/**
 * Which deployment of each remote the shell references (D12, and the
 * architecture doc's *Immutable Deployment Interaction*). `dev` locally;
 * Slice 8 injects the real per-environment identifier.
 */
const versionFor = (remote: string): string => readEnv(`PORTFOLIO_${remote}_VERSION`) ?? 'dev';

export const HEADER_ORIGIN: string = readEnv('PORTFOLIO_HEADER_ORIGIN') ?? DEFAULT_HEADER_ORIGIN;
export const FOOTER_ORIGIN: string = readEnv('PORTFOLIO_FOOTER_ORIGIN') ?? DEFAULT_FOOTER_ORIGIN;
export const HOMEPAGE_ORIGIN: string =
  readEnv('PORTFOLIO_HOMEPAGE_ORIGIN') ?? DEFAULT_HOMEPAGE_ORIGIN;
export const PORTFOLIO_ITEM_ORIGIN: string =
  readEnv('PORTFOLIO_PORTFOLIO_ITEM_ORIGIN') ?? DEFAULT_PORTFOLIO_ITEM_ORIGIN;

export const REMOTE_REGISTRY: RemoteRegistry = {
  header: {
    name: 'header',
    entryUrl: `${HEADER_ORIGIN}/remoteEntry.js`,
    // The specifier `apps/header`'s `exposes` map declares. The two are one
    // string in two files; a typo here is a runtime 404, not a type error.
    exposedModule: './Header',
    version: versionFor('HEADER'),
  },
  footer: {
    name: 'footer',
    entryUrl: `${FOOTER_ORIGIN}/remoteEntry.js`,
    exposedModule: './Footer',
    version: versionFor('FOOTER'),
  },
  homepage: {
    name: 'homepage',
    entryUrl: `${HOMEPAGE_ORIGIN}/remoteEntry.js`,
    exposedModule: './Homepage',
    version: versionFor('HOMEPAGE'),
  },
  'portfolio-item': {
    name: 'portfolio-item',
    entryUrl: `${PORTFOLIO_ITEM_ORIGIN}/remoteEntry.js`,
    exposedModule: './PortfolioItem',
    version: versionFor('PORTFOLIO_ITEM'),
  },
};

/**
 * Looks a remote up by name. Still returns `undefined` for an unknown name,
 * which the `RemoteRegistry` type keeps honest — the registry is a
 * `Partial<Record<…>>` and the type is what stops a caller assuming otherwise.
 */
export const remoteEntryFor = (name: RemoteName): RemoteEntry | undefined => REMOTE_REGISTRY[name];
