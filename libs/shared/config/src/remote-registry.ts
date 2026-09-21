import type { RemoteEntry, RemoteName, RemoteRegistry } from '@portfolio/shared-types';

import { readEnv } from './read-env.js';

/**
 * Where the shell resolves each remote (D19).
 *
 * Slice 3 fills the Header's row. Footer, Homepage and Portfolio Item are
 * added by Slices 5 to 7 — Slice 4 pre-creates their entries so three
 * concurrent agents extend this file rather than racing to create it.
 */

/** The Header remote's dev origin. Matches `strictPort` in `apps/header`. */
export const DEFAULT_HEADER_ORIGIN = 'http://localhost:4174';

export const HEADER_ORIGIN: string = readEnv('PORTFOLIO_HEADER_ORIGIN') ?? DEFAULT_HEADER_ORIGIN;

export const REMOTE_REGISTRY: RemoteRegistry = {
  header: {
    name: 'header',
    entryUrl: `${HEADER_ORIGIN}/remoteEntry.js`,
    // The specifier `apps/header`'s `exposes` map declares. The two are one
    // string in two files; a typo here is a runtime 404, not a type error.
    exposedModule: './Header',
  },
};

/**
 * Looks a remote up by name. Returns `undefined` when it has no entry, which
 * is the normal state for a remote whose slice has not been built yet — the
 * caller renders the same fallback it would for a remote that failed to load
 * (D16, Slice 4).
 */
export const remoteEntryFor = (name: RemoteName): RemoteEntry | undefined => REMOTE_REGISTRY[name];
