import type { RemoteEntry, RemoteName, RemoteRegistry } from '@portfolio/shared-types';

/**
 * Where the shell resolves each remote at runtime (D19).
 *
 * ⚠️ **Empty in Slice 1, and that is the whole point.** No remote exists yet.
 * The Header lands at Slice 3 and the other three across Slices 5 to 7, each
 * adding its own entry here. The module exists now so those slices extend a
 * file rather than create one during a parallel wave, which is what
 * `plan-parallelization.md` pre-creates seams to avoid.
 *
 * The URL is read from the environment and never imported, so a remote can be
 * redeployed without rebuilding the shell — the property D12 rests on.
 */
export const REMOTE_REGISTRY: RemoteRegistry = {};

/**
 * Looks a remote up by name. Returns `undefined` when it has no entry, which
 * is the normal state for a remote whose slice has not been built yet — the
 * caller renders the same fallback it would for a remote that failed to load
 * (D16, Slice 4).
 */
export const remoteEntryFor = (name: RemoteName): RemoteEntry | undefined => REMOTE_REGISTRY[name];
