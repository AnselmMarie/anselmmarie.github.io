# Decision D106

<a id="d106"></a>
## D106 — a retry reloads the remote through the federation host, at a new entry URL; Q23 closes

**Maintainer's call, 2026-09-23:** fix Q23 inside Slice 9. Closes
[Q23](./questions-closed-q18-q21.md#q23).

**Three caches held a failed load.** Slice 9's E2E suite found them one at a time, and
each fix on its own left the retry specs red:

1. **`React.lazy`** caches the rejection. Slice 4 had already handled this: a new `lazy`
   per attempt.
2. **The compiled import.** `@module-federation/vite` turns `import('homepage/Homepage')`
   into a virtual module whose `__mf_remote_pending` export is created once, when the
   module is evaluated. After a failure it stays the same rejected promise for the life of
   the page.
3. **The browser's module map.** A `type: 'module'` remote's entry is loaded with
   `import(url)`, and a failed module fetch is remembered for that URL. Clearing the
   runtime's own `globalLoading` cache with `registerRemotes(…, { force: true })` still
   produced no new request.

**The fix.** On a retry, `MfeRemoteMount` skips the compiled import and calls
`reloadRemote` (`libs/features/shell/src/mfe-loader/reload-remote.ts`). That function
re-registers the remote with `force: true` at a new URL, `remoteEntry.js?mf-retry=<attempt>`,
then calls `host.loadRemote('<registered name>/<exposed module>')`, the same call the
compiled module makes. The mount learns the exposed module from a new optional
`exposedModule` prop, and all four wrappers in `apps/shell/src/remotes/` pass it. The first
attempt, and any render with no federation host (unit tests), still use the import.

**Two traps it records:**

- **The plugin registers remotes under mangled names**
  (`__mfe_internal__shell__mf_owner__<hash>__homepage`), keeping the import name as
  `alias`. A lookup on `name` alone found nothing and made the first version of the fix a
  silent no-op.
- **The host is found through the global instance registry** (`getInstance(finder)`),
  not the module-local `getInstance()`, since nothing guarantees `feature-shell`'s copy of
  the runtime is the one the plugin initialised.

**Cost.** `@module-federation/runtime` becomes a direct dependency of `feature-shell`,
pinned at **2.9.0** to match `@module-federation/vite`'s own. ⚠️ Both parts of the fix
depend on runtime internals: the shape of the compiled import, and `alias` on
registrations. A `@module-federation/vite` upgrade can break them silently. Slice 9's
`"Try again" recovers the remote` specs are the check that catches it.

**Binds:** `libs/features/shell/src/mfe-loader/`, `apps/shell/src/remotes/`,
[slices/09-e2e-composition.md](./slices/09-e2e-composition.md).
