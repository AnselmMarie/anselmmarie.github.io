# Decision D57 — Nx drives the workspace through its own plugins, not 28 shell commands

The index is [decisions.md](./decisions.md). Its own file because it changes how **every**
project in the workspace is built, checked and cached, and because the migration turned up
four traps that are each silent on their own.

<a id="d57"></a>**D57 — the workspace adopts Nx's official plugins with inferred targets,
and TypeScript moves to project references (the "TS solution" setup). Libraries stay
source-only.** Maintainer's call, 2026-09-21.

## What was wrong

[D18](./decisions-d17-d32.md#d18) required every project to be a registered Nx project with
`typecheck`, `lint` and `test` targets, and Slice 1 satisfied that literally: ten
`project.json` files, **28 hand-written `nx:run-commands` entries**, each shelling out to
`tsc` / `eslint` / `vitest` with a `cwd`. Only `nx` core was installed — no `@nx/js`,
`@nx/vite` or `@nx/eslint`.

So Nx was a **task runner over shell scripts**, not a build system:

- every target's command was duplicated per project, and drifted (`--passWithNoTests` on two
  projects, `--no-error-on-unmatched-pattern` on one, bare `vitest run` on the rest);
- `typecheck` ran `tsc --noEmit -p tsconfig.json` **per project, from scratch**, with no
  incremental reuse between a library and the app that consumes it;
- cross-package types resolved through the `paths` map in `tsconfig.base.json`, so a
  package's public type surface was whatever its source happened to export — there was no
  compilation boundary between packages at all;
- `enforceBuildableLibDependency: true` in `eslint.config.mjs` was asserting nothing,
  because no project had a build.

## What changed

**Plugins, registered in `nx.json`.** `@nx/js/typescript`, `@nx/vite/plugin` and
`@nx/eslint/plugin` now infer `typecheck`, `test` and `lint` for every project from the
`tsconfig.json`, `vitest.config.ts` and ESLint config that already existed. The
`project.json` files are down to name, type, source root and **tags** — the tags matter,
because [Slice 1](./slices/01-workspace-and-shell.md) records that the module-boundary
constraints are *silently inert* for an untagged project.

**TypeScript project references.** `tsconfig.base.json` gains `composite: true` and **loses
its `paths` map**; a root `tsconfig.json` lists every project; each project's `tsconfig.json`
carries `references` to its dependencies. `nx sync` generates those references from the Nx
dependency graph and `nx sync:check` fails when they drift — both are new root scripts.
Cross-package resolution now goes through the pnpm workspace symlinks and each package's
`exports`, which is what the plugins expect.

**Libraries stay source-only.** `@nx/js/typescript` is configured with `build: false`, so no
library gains a build target and consumers keep importing TypeScript source. `typecheck`
runs `tsc --build --emitDeclarationOnly`, which emits declarations into each project's
gitignored `out-tsc/` purely so the next project in the graph can be checked against them.

## What inference could NOT do, and stays explicit

Two targets remain `nx:run-commands`, and this is the correct outcome rather than a shortcut:

- **`shell:build` and `shell:dev`.** `@nx/vite` only infers a build when the resolved Vite
  config has `build.lib`, `build.rollupOptions.input`, or an `index.html` at the project
  root. TanStack Start has none of the three, and its real output is `.output` / `.nitro`,
  not the `dist` Nx would have assumed — so an inferred build target would also have cached
  against the wrong directory. Declared by hand, with the correct `outputs`.
- **`infra:synth`.** `cdk synth` has no Nx plugin. Unchanged.

## Four traps this turned up

1. ⚠️ **`noEmit: true` silently disables the typecheck target.** `@nx/js/typescript` replaces
   the command with an `echo` explaining itself when the project or any of its references
   sets `noEmit` — the target still exists, still "passes", and checks nothing. Every
   project's `noEmit` was removed in favour of `--emitDeclarationOnly`.
2. ⚠️ **The inferred test command is a bare `vitest`, which watches** unless `CI` is set. The
   fix belongs in the config now that the config is the source of truth, so every
   `vitest.config.ts` gains `watch: false` (and `passWithNoTests: true` for the two projects
   that have no specs yet, replacing the old CLI flags).
3. ⚠️ **`@nx/vite@21.6.11` declares `vite@^5–7` and `vitest@^1–3`; this workspace runs vite
   8.3.0 and vitest 5.0.1.** pnpm reports both as unmet peers. Inference and all three gates
   work regardless, but this is an unsupported combination and the next `@nx/vite` upgrade
   should be treated as load-bearing rather than routine.
4. ⚠️ **`@nx/vite` loads each Vite config from the workspace root**, and TanStack Start
   resolves its router entry relative to Vite's `root`, which defaults to `process.cwd()`.
   Graph construction failed outright (`Could not resolve entry for router entry`) until
   `apps/shell/vite.config.ts` pinned `root: import.meta.dirname`.

## One thing that got quieter

`ui-theme` has no `lint` target any more. It holds a single `theme.css` and no lintable
source, so `@nx/eslint` infers nothing for it; its old target ran ESLint with
`--no-error-on-unmatched-pattern`, i.e. it was already a no-op. Nothing is lost, but the
project now reports **zero targets**, and that should not be read as a misconfiguration.

## Verification

All ten projects, from a cold cache: `sync:check` up to date · `typecheck`, `lint`, `test`
green for 9 projects (`ui-theme` has no targets) · `shell:build` produces
`apps/shell/.output` · `check:file-size` and `biome check` clean · a second run served
**27/27 tasks from cache**.

The gates were proved able to **fail**, per
[prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md) — each
revert confirmed with `git diff` before the run:

| Control | Result |
|---|---|
| Wrong return type in `shared-utils/src/cn.ts` | `shared-utils:typecheck` → `TS2322` |
| `ui-primitives` imports a non-existent export from `@portfolio/shared-utils` | `ui-primitives:typecheck` → `TS2305`, **and the `^typecheck` dependency ran first** — proving the reference chain carries types across packages rather than falling back to `any` |
| Nested ternary added to `shared-utils` | `shared-utils:lint` → `no-nested-ternary` |
| `shared-utils` imports `@portfolio/ui-primitives` | `shared-utils:lint` → `@nx/enforce-module-boundaries` |
| Failing assertion added to a `shared-utils` spec | `shared-utils:test` → 1 failed, **and terminated with `CI` unset**, confirming trap 2's fix |

The dev server was checked in a browser after the `root` change: `http://localhost:3000/`
renders the shell with its theme intact and no console errors.

## What this does NOT change

- **[D18](./decisions-d17-d32.md#d18)** still holds — every project is still a registered Nx
  project with those three targets. Only the mechanism moved.
- **[D50](./decisions-d48-d52.md#d50)** still holds: `project.json` keeps the bare name.
- **[D44](./decisions-d42-d47.md#d44)** is unchanged — ESLint still owns the module
  boundaries via `@nx/eslint-plugin`, which stays installed for exactly that rule.
- **[D38](./decisions-d33-d41.md#d38)** is untouched; nothing here renders a component.
