import { getInstance } from '@module-federation/runtime';
import type { Remote } from '@module-federation/runtime/types';

import type { RemoteName } from '@portfolio/shared-types';

/** The query parameter that gives a retried entry a URL the browser has not seen. */
export const RETRY_PARAM = 'mf-retry';

/** A registration is the remote if either its import name (`alias`) or its `name` matches. */
const isRemote = (remote: Remote, name: RemoteName): boolean =>
  ('alias' in remote && remote.alias === name) || remote.name === name;

/**
 * Loads a remote's exposed module again, from scratch, for a retry (Q23, Slice 9).
 *
 * ⚠️ **Three caches hold a failed load, and a retry has to get past all three.**
 * Slice 9's E2E suite found each one in turn; unit specs stub the federated
 * import and can see none of them.
 *
 * 1. **`React.lazy`** caches the rejection. `MfeRemoteMount` already builds a
 *    new `lazy` per attempt for this.
 * 2. **The compiled import.** `@module-federation/vite` turns
 *    `import('homepage/Homepage')` into a virtual module whose
 *    `__mf_remote_pending` export is created once, when the module is
 *    evaluated. After a failure it is the same rejected promise for the life
 *    of the page. So a retry skips the import and asks the host instead:
 *    `host.loadRemote(…)`, the call that module makes itself.
 * 3. **The browser's module map.** A `type: 'module'` remote's entry is loaded
 *    with `import(url)`, and a failed module fetch is remembered for that URL.
 *    Re-importing the same URL fails without a request. So the entry is
 *    re-registered at a new URL (`?mf-retry=<attempt>`), and
 *    `registerRemotes(…, { force: true })` also drops the runtime's own cached
 *    load (`globalLoading`, in `@module-federation/runtime-core`).
 *
 * The query only changes `remoteEntry.js`'s URL. Its chunks resolve against the
 * remote's absolute `base` (D42), so they are untouched.
 *
 * ⚠️ **The host is found through the global registry, by the remote it
 * registers.** A bare `getInstance()` reads a variable local to one copy of the
 * runtime module, and nothing guarantees this lib's copy is the one the plugin
 * initialised. And it matches on `alias`: the plugin registers every remote
 * under a mangled `name` (`__mfe_internal__shell__mf_owner__<hash>__homepage`)
 * and keeps the import name as `alias`.
 *
 * Returns `null` when there is no federation host that registers the remote
 * (unit tests, a standalone render), so the caller can fall back to its import.
 *
 * @param exposedModule The exposed name without `./`, e.g. `Homepage`.
 */
export const reloadRemote = <TModule>(
  name: RemoteName,
  exposedModule: string,
  attempt: number
): Promise<TModule> | null => {
  const host = getInstance((instance) =>
    instance.options.remotes.some((remote) => isRemote(remote, name))
  );
  const remote = host?.options.remotes.find((candidate) => isRemote(candidate, name));

  if (!host || !remote || !('entry' in remote)) return null;

  const entry = new URL(remote.entry, globalThis.location?.href);
  entry.searchParams.set(RETRY_PARAM, String(attempt));
  host.registerRemotes([{ ...remote, entry: entry.href }], { force: true });

  return host.loadRemote<TModule>(`${remote.name}/${exposedModule}`).then((module) => {
    if (!module) throw new Error(`Error loading remote ${name}: no ${exposedModule} module`);
    return module;
  });
};
