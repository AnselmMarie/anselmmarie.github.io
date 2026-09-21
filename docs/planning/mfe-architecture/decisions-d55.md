# Decision D55 — Federation composes with TanStack Start, and how

The index is [decisions.md](./decisions.md). This is the spike gate's answer to
[Q2](./questions-closed.md#q2), the plan's last architectural unknown, so it gets its own
file: the **configuration it proves** is the artifact [Slice 3](./slices/03-federation-header.md)
builds from, and it must outlive the throwaway worktree it was found in.

<a id="d55"></a>**D55 — `@module-federation/vite` and TanStack Start's build do coexist, with
federation scoped to the client environment only. Q2 closes in favour of the composed
approach; none of its three fallback positions is needed.** Found by building, 2026-09-21,
by the spike agent under [D54](./decisions-d54.md#d54) and independently re-verified by the
coordinator.

## What was proven, and how

| Check | Result | The evidence |
|---|---|---|
| Federation coexists with Start's build | ✅ | The shell builds and runs; the remote loads. |
| Federation stays out of the SSR/Lambda bundle | ✅ | Under the **real `aws-lambda` preset** (`.output/nitro.json` → `"preset": "aws-lambda"`), the server bundle has **no** `loadRemote`, `initSharing`, `__federation__` or `@module-federation` code, and no `header/Widget` import. The only server-side hits are three **client asset filenames** carrying `mf_owner` inside the asset manifest — strings the server emits as `<script>` tags, not executable code. The client bundle matches the same grep, which is the control proving the grep works. |
| The shell still SSRs its own page | ✅ | The complete SSR payload contains the `<h1>`, the header region and `shell-content-region`, **plus the remote's `ClientOnly` fallback and zero bytes of the remote's own content** — exactly [D8](./decisions-d01-d16.md#d8)/[D9](./decisions-d01-d16.md#d9)/[D36](./decisions-d33-d41.md#d36). |
| A single React instance | ✅ | The remote's hook-bearing counter increments 0→3 by real clicks, and survives a shell-driven re-render plus a `resize` event. No duplicate-React warnings, no remount. |
| A remote-owned asset resolves from the remote's origin | ✅ | With the remote on `:4174` and the shell on `:3000`, every remote chunk — `remoteEntry.js`, `Widget-*.js`, the shared-React virtual modules — was fetched from `http://localhost:4174/…`. |

⚠️ **Measure the SSR payload with a single complete capture.** The response is streamed (it
carries React's `<!--$-->` Suspense marker), so two separate `curl` calls return two
different prefixes and a `grep` on the short one reports the body as missing. That produced a
false "the shell does not SSR its body" reading during verification, corrected the same turn.

## The configuration this buys — Slice 3 builds from it

Two mechanics are non-obvious, and both were found by failing first.

**1. `applyToEnvironment` must be overridden. It is not optional.** Every internal plugin
`federation()` returns hard-codes `applyToEnvironment() { return true; }` — read from the
package's compiled output. The plugin has its own SSR *detection*, which changes how it
behaves for an SSR consumer, but it does **not** skip the SSR environment. Left unscoped it
participates in the server build. Mapping over the returned array is what keeps it out:

```ts
const mfPlugins = federation({
  name: 'shell',
  remotes: {
    header: { type: 'module', name: 'header', entry: 'http://localhost:4174/remoteEntry.js' },
  },
  shared: {
    react: { singleton: true, strictVersion: false },
    'react-dom': { singleton: true, strictVersion: false },
  },
  dts: false,
}).map((plugin) => ({
  ...plugin,
  applyToEnvironment: (environment: { name: string }) => environment.name === 'client',
}));
```

The plugin goes **after** `tanstackStart()`, `nitro()` and `viteReact()` in the array.

**2. A remote must be declared in the object form with `type: 'module'`.** The shorthand
string `'header@http://localhost:4174/remoteEntry.js'` fails at runtime with
`Uncaught SyntaxError: Cannot use import statement outside a module`, because the plugin
emits an ESM `remoteEntry.js` while the runtime injects a classic `<script>` tag unless told
the remote is ESM. Observed, not inferred.

**3. `ClientOnly` from `@tanstack/react-router` is the load-bearing piece** for keeping
federation out of the SSR bundle. Its server branch renders the `fallback` instead of
`children`, so the `lazy(() => import('header/Widget'))` subtree is compiled out of the
server chunk entirely rather than merely never executed. `React.lazy` + `Suspense` alone
defers the import; `ClientOnly` is what removes it.

**4. The remote sets `base` to its own origin** ([D42](./decisions-d42-d47.md#d42)), with
`server`/`preview` on `strictPort` and `cors: true`, and `build.target: 'esnext'`.

**5. A remote needs a `tsconfig.json` at its root**, or the federation dts sub-plugin crashes
the dev server on startup (`Cannot read file 'tsconfig.json'`) — even with `dts` unset. Ship
the tsconfig, or set `dts: false` on the remote too.

## Versions it was proven against

`@module-federation/vite` 1.22.1 · `vite` 8.3.0 · `react` / `react-dom` 19.3.0 ·
`@tanstack/react-start` 1.168.56 · `@tanstack/react-router` 1.170.38 ·
`@vitejs/plugin-react` 6.1.1 · `nitro` 3.0.260903-beta.

## ⚠️ What the spike did NOT prove

These travel forward to Slice 3, which is trusting this decision.

- **Dev-mode remote against a production-built shell does not work.** It hits
  `@vitejs/plugin-react can't detect preamble`, because the remote's `remoteHmr` proxy expects
  the host to also be a Vite dev server serving `/@react-refresh`. All-dev works and
  all-built works; that one mixed combination does not. It matters only if Slice 3's local
  workflow wants a built shell against a dev remote.
- **An actual Lambda invocation was never run.** The `aws-lambda` *build* was inspected and is
  clean, and the scoping mechanics operate at the Vite environment level, before Nitro's
  preset-specific packaging — but nothing here invoked the handler on AWS. Slice 8 is where
  that is first true.
- **The `mf-manifest.json` runtime-resolution path is untested.** A direct `remoteEntry.js`
  URL was used. This satisfies [D19](./decisions-d17-d32.md#d19) — the URL is read at runtime,
  not baked into the shell's bundle — but the manifest variant's extra capabilities are
  unproven.
- **One remote, one shared set, no router singleton.** Multi-remote interaction, which is the
  Slice 5–7 wave, is untested.
- **No specs**, by design: throwaway spike code, excluded by the task's own brief.
