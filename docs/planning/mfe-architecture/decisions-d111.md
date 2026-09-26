# Decision D111

<a id="d111"></a>
## D111 — the remote registry stays host-owned in `libs/shared/config`; no feature carries its own row

**Maintainer's call, 2026-09-25**, after reviewing
`libs/shared/config/src/remote-registry/remote-registry.ts` and asking whether each
feature should own its entry.

**The question.** Should `libs/features/header` (and the other three) declare their own
registry row, with the registry only collecting them?

**No. The registry stays where it is.** Where a remote is and which version to load is
the host's deployment config, not feature code:

- **The dependency would point the wrong way.** To collect rows from the feature libs,
  `shared-config` or the shell would have to import `@portfolio/feature-*`. The shell is
  meant to know a remote only by name, entry URL and exposed module, and to get its code
  at runtime ([D2](./decisions-d01-d16.md#d2), [D19](./decisions-d17-d32.md#d19)).
- **A feature lib doesn't know where it's served from.** `feature-header` is a React
  component. Its origin and live version come from the deploy
  ([D107](./decisions-d107-d109.md#d107)), not from the component.
- **The shared row was a deliberate seam.** Slice 4 created all four rows up front so
  Slices 5–7 wouldn't all edit one file at once ([D67](./decisions-d63-d67.md#d67)).
  That reason no longer applies, but nothing about the file got worse when it went away.

**What was considered and not adopted: a runtime `mf-manifest.json` + `registerRemotes`
registry.** It was proposed in the same review as the way to close
[D61](./decisions-d58-d62.md#d61)'s baked-URL gap. ⚠️ **That premise is out of date.**
D107's pointer modules already make [D12](./decisions-d01-d16.md#d12) true: the shell is
built against stable pointer URLs, and a remote deploy only rewrites the pointer. A
manifest path would replace a mechanism that works with one [D55](./decisions-d55.md#d55)
never proved, and it would conflict with the pointer design, which serves
`remoteEntry.js` and nothing else. Revisit only if the pointer approach fails.

**What is still wrong, recorded rather than fixed here.** The registry isn't the single
source for the facts it holds. Each one is also written out by hand elsewhere, and a
mismatch fails at runtime, not at build time:

| Fact | Where it is written |
|---|---|
| Dev origin / port per remote | the registry's `DEFAULT_*_ORIGIN`, `apps/shell/vite.config.ts`, each remote's own `vite.config.ts` |
| The origin env key | the registry's `readEnv` calls, both `vite.config.ts` files, `infra/src/site-config/site-config.ts` (`originEnvKey`) |
| The exposed module (`./Header`) | the remote's `exposes`, the registry's `exposedModule`, `apps/shell/src/remotes/remotes.d.ts`, the wrapper's `exposedModule` prop ([D106](./decisions-d106.md#d106)) |

The `vite.config.ts` copies can't import the registry: Nx loads those configs through
Node's ESM resolver, which can't resolve the unbuilt package (D61, consequence 1).
`remotes-exposed-module.spec.tsx` checks part of the exposed-module chain. Nothing checks
the origins.

**The registry's one live consumer reads `dev` in production.** Only `remoteVersion()`
in `apps/shell/src/remotes/` uses `REMOTE_REGISTRY`, for the error payload
([D64](./decisions-d63-d67.md#d64)). It reads `process.env`, which is empty in the
browser, so every browser-side report says `dev`. D107 already names this gap. Fixing it
means exposing the pointer's version to the page. That's a change to the registry's
`version` source, not to who owns the registry.

**Also stale:** the `remotes` comment in `apps/shell/vite.config.ts` still says the baked
URL breaks D12. After D107 it doesn't, because the baked URL is the pointer's. Correct it
the next time that file is edited.

**Binds:** `libs/shared/config/src/remote-registry/`, `apps/shell/src/remotes/`. No code
changes with this entry.
