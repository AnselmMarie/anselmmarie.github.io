# Parallelization

Required by [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md).
Recording that slices *can* run concurrently is not permission to fan out — the maintainer
decides whether any of this actually runs in parallel.

## Dependency graph

```text
1 → 2 → 3 → 4 → {5, 6, 7} → 8 → 9
```

| Edge | The dependency |
|---|---|
| 1 → 2 | The ui libs need the workspace, the Tailwind pipeline, and the Vitest harness. |
| 2 → 3 | The Header is built from `libs/ui/components`, and `@portfolio/ui-*` must exist before it can be declared an MF shared dependency. ⚠️ **This binds Slice 3's Header build, not its spike gate** — see [D54](./decisions-d54.md#d54) and the section below. |
| 3 → 4 | The boundary wraps a real remote. Writing it against no remote means the specs cannot be seen failing, which [prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md) forbids. |
| 4 → {5,6,7} | Slice 4 pre-creates the seams the three remotes would otherwise all edit at once: registry entries, fallback slots, route-tree lines, `use-content-stub.ts`, **and the six-project scaffold plus the single `pnpm install`**. |
| {5,6,7} → 8 | Nothing to deploy independently until more than one remote exists. |
| 8 → 9 | E2E asserts the composed, deployed app including failure isolation. |

## Shared-file table

Pre-existing files each slice modifies. New files under a new directory conflict with
nobody and are omitted.

| Slice | Shared files it modifies |
|---|---|
| 1 | — (creates the workspace) |
| 2 | `apps/shell/src/styles.css`, root `tsconfig`, `nx.json`, `pnpm-lock.yaml`, `apps/shell` imports |
| 3 | `libs/shared/config` remote registry, `apps/shell` route tree, root manifests, `libs/ui/components` barrel |
| 4 | `libs/features/shell` barrel, the shell layout and route tree, `libs/shared/config`, **the whole of `libs/shared/types` and `libs/shared/fixtures`**, root `tsconfig` + `pnpm-lock.yaml` (the six-project scaffold) |
| 5 | `libs/shared/config` registry, shell layout, root manifests |
| 6 | `libs/shared/config` registry, shell route tree, **`libs/shared/types` + `libs/shared/fixtures` (co-owned with 7)**, root manifests |
| 7 | `libs/shared/config` registry, shell route tree, **`libs/shared/types` + `libs/shared/fixtures` (co-owned with 6)**, root manifests |
| 8 | `.github/workflows/`, the AWS infrastructure definitions, root `package.json` scripts, `libs/shared/config` (env-read remote URLs), `docs/` (the runbook) |
| 9 | `playwright.config.ts`, root `package.json` scripts, `.github/workflows/` (the E2E job added to Slice 8's workflow) |

Specs count as files a slice touches. A slice editing a registry almost always edits that
registry's spec too, and that spec is shared.

## The spike gate runs against the graph, deliberately

⚠️ **Added 2026-09-21 as [D54](./decisions-d54.md#d54).** The `2 → 3` edge above is real for
Slice 3's Header build and **over-constrains Slice 3's spike gate**, which is therefore run
concurrently with Slice 2 rather than after it.

The spike's four checks — client-scoped federation in Start's build, no federation in the
SSR/Lambda bundle, a single React instance, and a remote-owned asset resolving from the
remote's origin — touch no `libs/ui/*` file. The spike is a throwaway remote rendering one
string and it is discarded before the real slice starts, so it has no shared-file set worth
tabulating: its only output is a report.

It is worth moving because it answers [Q2](./questions-closed.md#q2), the plan's last
architectural unknown, and a failure sends slices 3 through 9 to one of Q2's three fallback
positions. ⚠️ **A passing spike does not unblock Slice 3 proper**, which still waits for
Slice 2. This moves the question, not the slice.

**Why worktrees and not the shared tree.** The two units both touch `apps/shell` — Slice 2
rewrites `src/styles.css`, the spike edits `vite.config.ts` — so they are in the same Nx
project and each agent's gates would see the other's in-flight edits. Both would also race
`pnpm-lock.yaml` (the spike installs `@module-federation/vite`; Slice 2 installs Tailwind and
shadcn). Two worktrees off `feat/amarie/new-design`, each with its own `pnpm install`.
The spike's worktree is discarded, so there is nothing to reconcile from it.

## The one wave: slices 5, 6, 7

The three remotes are the only genuinely parallel-safe group in this plan, and the
app-skeleton / feature-lib split ([D27](./decisions-d17-d32.md#d27)) is what makes them so: each
agent owns `apps/<name>` and `libs/features/<name>`, which no other agent touches.

⚠️ **That is true of the apps and feature libs, and it was overstated for everything else.**
Corrected 2026-09-21: **Slices 6 and 7 both write `libs/shared/types` and
`libs/shared/fixtures`** — the same two Nx projects, the same barrels — and both read
`use-content-stub.ts`, a **single file only one of them was ever permitted to author**. Those
two projects are therefore **co-owned for the wave**, not disjoint, and pre-creating a barrel
does not make the data modules inside it disjoint. The coordinator settles the per-file split
before any agent starts and writes `use-content-stub.ts` itself, with both read signatures
stubbed. Without that, the wave collides on its first run.

Their shared-file sets overlap in exactly four places, all of which are **pre-created by
the coordinator before any fan-out**:

1. `libs/shared/config` — the remote registry. All three entries added, pointing at
   not-yet-built remotes.
2. `apps/shell` route tree and layout — the mount points for footer, homepage, and
   portfolio item.
3. `libs/shared/types` and `libs/shared/fixtures` — ⚠️ **co-owned, not merely seeded.** Both
   barrels, **and `use-content-stub.ts` written by the coordinator** with the homepage and
   per-slug read signatures stubbed, **and a named per-file split** saying which module each
   of slices 6 and 7 may open. A barrel alone is not enough.
4. Root manifests — `nx.json`, root `tsconfig`, `pnpm-lock.yaml`.

### Workspace-manifest work is solo

Adding an Nx project mutates the root `tsconfig` references and `nx.json`, and installing
races on `pnpm-lock.yaml`. So the manifest mutation is pulled **out** of the parallel
slices: the coordinator scaffolds all six projects (`apps/footer`, `apps/homepage`,
`apps/portfolio-item`, and their three feature libs), registers them, adds the empty
registry and barrel entries, and runs `pnpm install` **once**. Only then do the agents
start, and each writes code into a project that already exists.

### If it fans out

Per [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md): **each agent
gets its own git worktree** (which needs
[branch-creation-approval.md](../../../.claude/rules/branch-creation-approval.md), then the
[worktree-safety.md](../../../.claude/rules/worktree-safety.md) checks and
[worktree-pnpm-install.md](../../../.claude/rules/worktree-pnpm-install.md)); each is told
its exact file set and that everything outside it is another agent's territory; and gates
run per agent on that agent's own projects.

Three agents at roughly 30 files each is well inside the 250-file cap.

## No database slice

This plan has no database layer, so the unconditional solo-database rule never fires.
Worth stating rather than omitting: its absence here is a fact about the plan, not an
oversight.

## Estimated changed files per slice

| Slice | Files | Notes |
|---|---|---|
| 1 | ~66 | The largest. Workspace scaffold, four `libs/shared/*` packages, the shell, the test harness, **plus the CDK `infra` project** ([D37](./decisions-d33-d41.md#d37)) — defined, not deployed. |
| 2 | ~40 | **Unchanged at ~40, but now a ceiling rather than a floor.** [Q8](./questions-closed.md#q8) closed as [D38](./decisions-d33-d41.md#d38), so the ~15 Storybook files and their coverage gate are not built — the slice keeps its original size instead of growing past it. [Q7](./questions-closed.md#q7) closed as [D40](./decisions-d33-d41.md#d40) — on-demand primitives, so this number is a ceiling rather than a floor. |
| 3 | ~36 | Includes the spike, which is discarded before the slice is reported. Plus the shared-dependency config under [D39](./decisions-d33-d41.md#d39). |
| 4 | ~40 | ~22 for the boundary and fallbacks, plus the six-project scaffold for the wave (~18 more: three apps, three feature libs, their `project.json`/`package.json`/tsconfig). ⚠️ The architecture-doc edit this row used to carry is **already applied** in `031b8fc`; Slice 4 verifies the path rather than rewriting it. |
| 5 | ~22 | |
| 6 | ~32 | |
| 7 | ~34 | Carries the route and its fallback. |
| 8 | ~26 | Workflow, the CDK stack filled in, deploy scripts, **and the React-major CI check** ([D39](./decisions-d33-d41.md#d39)). |
| 9 | ~16 | Plus the per-remote computed-style assertions that stand in for the declined Storybook ([D38](./decisions-d33-d41.md#d38)). |

Every slice is under the cap, so no slice needs splitting on size alone.

**Revised 2026-09-21** after the plan was audited against the working tree: the shared-file
table gained the rows it was under-reporting for slices 4, 8 and 9, the wave's disjointness
claim was corrected for slices 6 and 7, and Slice 4's estimate rose from ~22 to ~40 because
the six-project scaffold was never counted.

**Revised 2026-09-20** when the eight open questions closed. The one estimate that moved is
Slice 1 (CDK arrives early, so the shell is never scaffolded against a placeholder adapter).
Slice 2's number is unchanged — the Storybook decline stopped it growing rather than
shrinking it, which is what [Slice 2](./slices/02-ui-libs.md) means by keeping its original
size. The earlier
note — *"if Slice 2 crosses 40 files once Q7 and Q8 are answered, split the Storybook setup
out as its own slice"* — is moot: there is no Storybook setup to split.
