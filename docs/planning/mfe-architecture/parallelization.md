# Parallelization

Required by [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md).
Recording that slices *can* run concurrently is not permission to fan out — the maintainer
decides whether any of this actually runs in parallel.

## Dependency graph

```text
1 → 2 → 3 → 4 → {5, 6, 7} → 10 → 11 → {12, 13→14, 15, 16} → 8 → 9
```

⚠️ **Slices 8 and 9 run last despite their numbers**
([D80](./decisions-d76-d81.md#d80)): the redesign lands before deployment and E2E, and the
two keep their labels because renumbering would rewrite 97 references across 40 files,
including `apps/*/vite.config.ts`, `infra/`, `ci.yml` and `tools/eslint/`.

| Edge | The dependency |
|---|---|
| 1 → 2 | The ui libs need the workspace, the Tailwind pipeline, and the Vitest harness. |
| 2 → 3 | The Header is built from `libs/ui/components`, and the theme it is styled by must exist. ⚠️ **The second half of this reason was wrong** — it read *"`@portfolio/ui-*` must exist before it can be declared an MF shared dependency"*, and neither package can be one ([D60](./decisions-d58-d62.md#d60)). The edge holds on the first half alone. ⚠️ **It binds Slice 3's Header build, not its spike gate** — see [D54](./decisions-d54.md#d54) and the section below. |
| 3 → 4 | The boundary wraps a real remote. Writing it against no remote means the specs cannot be seen failing, which [prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md) forbids. ⚠️ **Harder than it reads, since 2026-09-21:** Slice 3 as built does not survive a downed remote — the whole route dies ([D62](./decisions-d58-d62.md#d62)). This is not only a sequencing preference; Slice 3 is not deployable without Slice 4. |
| 4 → {5,6,7} | Slice 4 pre-creates the seams the three remotes would otherwise all edit at once: registry entries, fallback slots, route-tree lines, `use-content-stub.ts`, **and the six-project scaffold plus the single `pnpm install`**. |
| {5,6,7} → 8 | Nothing to deploy independently until more than one remote exists. |
| {5,6,7} → 10 | The redesign re-skins what those three built. Re-skinning a remote that does not exist yet means writing it twice. |
| 10 → 11 | The content model is authored against the design's field set, and Slice 10 is where the design is first read end to end. Ordering them the other way means authoring fields nobody has checked against a token set. |
| 11 → {12,13,15,16} | Every wave slice reads the new types and fixtures. ⚠️ This is the edge the 2026-09-21 wave got wrong by treating `shared-types` / `shared-fixtures` as disjoint; see the correction above. |
| 13 → 14 | **Same Nx project** (`libs/features/homepage`). Not a content dependency — a file-set one. One agent runs them in sequence. |
| {12,…,16} → 8 | Deploying markup that is about to be replaced. |
| 8 → 9 | E2E asserts the composed, deployed app including failure isolation. |

## Shared-file table

Pre-existing files each slice modifies. New files under a new directory conflict with
nobody and are omitted.

| Slice | Shared files it modifies |
|---|---|
| 1 | — (creates the workspace) |
| 2 | `apps/shell/src/styles.css`, root `tsconfig`, `nx.json`, `pnpm-lock.yaml`, `apps/shell` imports |
| 3 | `libs/shared/config` remote registry (+ `read-env.ts`, barrel, spec), `apps/shell` vite config + route, `libs/ui/theme` (the `--spacing-header` token and a new `@source` line), root manifests |
| 4 | `libs/features/shell` barrel, the shell layout and route tree, `libs/shared/config`, **the whole of `libs/shared/types` and `libs/shared/fixtures`**, root `tsconfig` + `pnpm-lock.yaml` (the six-project scaffold) |
| 5 | `libs/shared/config` registry, shell layout, root manifests |
| 6 | `libs/shared/config` registry, shell route tree, **`libs/shared/types` + `libs/shared/fixtures` (co-owned with 7)**, root manifests |
| 7 | `libs/shared/config` registry, shell route tree, **`libs/shared/types` + `libs/shared/fixtures` (co-owned with 6)**, root manifests |
| 8 | `.github/workflows/`, the AWS infrastructure definitions, root `package.json` scripts, `libs/shared/config` (env-read remote URLs), `docs/` (the runbook) |
| 9 | `playwright.config.ts`, root `package.json` scripts, `.github/workflows/` (the E2E job added to Slice 8's workflow) |
| 10 | `libs/ui/theme/src/theme.css` (**rewritten**), `libs/ui/components` barrel + 5 new components, `libs/features/shell` layout + 3 regions + **all 5 fallbacks**, `apps/shell/src/styles.css`, root manifests **iff [Q20](./open-questions.md#q20) resolves to self-hosting** |
| 11 | `libs/shared/types/src/{portfolio-item,homepage-content}.ts` + barrel, all three `portfolio-items-*.fixture.ts`, `homepage.fixture.ts` |
| 12 | ⚠️ **`libs/shared/fixtures/src/site-sections.fixture.ts` + spec** and `libs/shared/types/src/site-section.ts` — the [D81](./decisions-d76-d81.md#d81) contract; plus `libs/features/shell/src/shell-header-region.tsx` and `fallbacks/header-fallback.tsx` |
| 13 | `libs/features/homepage/**` only |
| 14 | `libs/features/homepage/**` only — **the same files as 13** |
| 15 | `libs/features/portfolio-item/**`, plus **the `head` function only** of `apps/shell/src/routes/portfolio.$slug.tsx` |
| 16 | `libs/features/footer/**` only |

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

### The named per-file split for the wave

⚠️ **Settled by the coordinator on 2026-09-21, before any agent starts
([D67](./decisions-d63-d67.md#d67)).** Both packages below are **co-owned**: pre-creating a
barrel does not make the data modules inside it disjoint, so the split is by file and it is
named here. Every module also carries an `OWNER:` banner in its own header, so an agent
that opens the wrong file is told so by the file rather than by this table.

| File | Owner | State at the end of Slice 4 |
|---|---|---|
| `libs/shared/types/src/homepage-content.ts` | **Slice 6** | `HomepageContent` with `sections` only |
| `libs/shared/types/src/portfolio-item.ts` | **Slice 7** | `PortfolioItem` with `slug` + `title` only |
| `libs/shared/types/src/site-section.ts` | coordinator | done — `SiteSection` ([D63](./decisions-d63-d67.md#d63)) |
| `libs/shared/types/src/index.ts` | **coordinator only** | all five exports in place |
| `libs/shared/fixtures/src/homepage.fixture.ts` | **Slice 6** | seeded with `sections`; the copy is Slice 6's |
| `libs/shared/fixtures/src/portfolio-items.fixture.ts` | **Slice 7** | empty array + `portfolioItemBySlug` |
| `libs/shared/fixtures/src/site-sections.fixture.ts` | coordinator | done — `SITE_SECTIONS` |
| `libs/shared/fixtures/src/route-metadata.fixture.ts` | **Slice 7** | ⚠️ Slice 7 adds the per-slug rows (D48). **Slice 6's homepage title and description are already here** as `HOME_METADATA` — if Slice 6 wants that copy changed it **reports it**, it does not edit this file |
| `libs/shared/fixtures/src/use-content-stub.ts` | **coordinator only** | all three signatures stubbed — **no agent edits this** |
| `libs/shared/fixtures/src/index.ts` | **coordinator only** | all five exports in place |
| `libs/features/footer/**` · `apps/footer/**` | **Slice 5** | ✅ **runnable** — full app skeleton on 4175 + placeholder `Footer` ([D68](./decisions-d63-d67.md#d68)) |
| `libs/features/homepage/**` · `apps/homepage/**` | **Slice 6** | ✅ **runnable** — full app skeleton on 4176 + placeholder `Homepage` carrying the real D43 section ids |
| `libs/features/portfolio-item/**` · `apps/portfolio-item/**` | **Slice 7** | ✅ **runnable** — full app skeleton on 4177 + placeholder `PortfolioItem` |

**Closed to all three agents** — the coordinator built these and no wave agent edits them:
the remote registry and its spec, `apps/shell/**` (mounts, `remotes.d.ts`, both routes, the
`vite.config.ts` remotes map), `libs/features/shell/**`, `libs/ui/theme/src/theme.css`'s
`@source` lines, and every root manifest.

### ⚠️ Correction, 2026-09-21 — one named exception inside `apps/shell`, for Slice 7

The blanket "`apps/shell/**`" above **contradicted [Slice 7](./slices/07-portfolio-item-mfe.md)**,
which lists `src/routes/portfolio.$slug.tsx` among the files it fills in, and contradicted
that file's own header, which says *"created by Slice 4 as a seam, filled in by Slice 7."*
Two of the three statements had to be wrong; resolved by reading the file.

**Slice 7 may edit `apps/shell/src/routes/portfolio.$slug.tsx`, and only its `head`
function.** Slice 4 wired the route completely — the slug resolution, the not-found split,
the boundary mount, and a `title` / `og:title` / `og:url` head. What is missing is the part
that needs fixture data Slice 7 has not written yet: the per-item `description` and
`og:image` ([D48](./decisions-d48-d52.md#d48)). The component body, the imports and the
not-found branch stay as they are.

Everything else under `apps/shell/**` stays closed, to Slice 7 as much as to the others —
including `routeTree.gen.ts`, which is generated and must not be hand-edited or regenerated
by a wave agent. **Slices 5 and 6 touch no file in `apps/shell` at all**: the homepage
route's `head` already reads `HOME_METADATA`, so Slice 6's metadata deliverable is
discharged by Slice 4 unless the copy itself changes — and changing it is a report, not an
edit ([D67](./decisions-d63-d67.md#d67)).

A wave agent that finds it needs a change in any of those **reports it and stops**; it does
not make the edit. That is the whole point of settling the seams first.

### Workspace-manifest work is solo

Adding an Nx project mutates the root `tsconfig` references and `nx.json`, and installing
races on `pnpm-lock.yaml`. So the manifest mutation is pulled **out** of the parallel
slices: the coordinator scaffolds all six projects (`apps/footer`, `apps/homepage`,
`apps/portfolio-item`, and their three feature libs), registers them, adds the empty
registry and barrel entries, and runs `pnpm install` **once**. Only then do the agents
start, and each writes code into a project that already exists.

✅ **Done in Slice 4, 2026-09-21.** All six projects exist and are tagged
([D44](./decisions-d42-d47.md#d44)); `nx sync` registered the three feature libs in the root
`tsconfig.json`; `pnpm install` ran once and `pnpm-lock.yaml` carries the six new workspace
packages. ⚠️ **Superseded the same day by [D68](./decisions-d63-d67.md#d68):** the three apps now have
`tsconfig.json`, a full Vite + federation config and root references, because a remote that
cannot be started is not a scaffold. `pnpm nx dev <remote>` works for all four.

### If it fans out

Per [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md): **each agent
gets its own git worktree** (which needs
[branch-creation-approval.md](../../../.claude/rules/branch-creation-approval.md), then the
[worktree-safety.md](../../../.claude/rules/worktree-safety.md) checks and
[worktree-pnpm-install.md](../../../.claude/rules/worktree-pnpm-install.md)); each is told
its exact file set and that everything outside it is another agent's territory; and gates
run per agent on that agent's own projects.

Three agents at roughly 30 files each is well inside the 250-file cap.

## The second wave: slices 12, 13→14, 15, 16

The redesign's four remotes, and the plan's second genuinely parallel-safe group. The
app-skeleton / feature-lib split ([D27](./decisions-d17-d32.md#d27)) makes them so for the
same reason it did the first time: each agent owns `apps/<name>` and `libs/features/<name>`.

⚠️ **This wave is safe for a reason the first one was not, and the reason is Slice 11.**
The 2026-09-21 wave collided because slices 6 and 7 co-owned `libs/shared/types` and
`libs/shared/fixtures` while the plan claimed they were disjoint
([D67](./decisions-d63-d67.md#d67) settled the per-file split only after the problem
surfaced). Here the whole content model is **one solo slice that finishes before any agent
starts**, so the shared packages are read-only for the entire wave. That is the correction
applied rather than described.

### Three seams, each with exactly one owner

| Seam | Owner for the wave | Everyone else |
|---|---|---|
| `libs/shared/types` + `libs/shared/fixtures` | **nobody** — frozen by Slice 11 | read-only |
| `site-sections.fixture.ts` + `site-section.ts` | **Slice 12** ([D81](./decisions-d76-d81.md#d81)) | read-only, via `SITE_SECTIONS`, **never a literal** |
| `apps/shell/**` + `libs/features/shell/**` | **the coordinator**, in Slice 10 | closed — except the `head` function of `portfolio.$slug.tsx`, which is Slice 15's, and `shell-header-region.tsx` + `header-fallback.tsx`, which are Slice 12's |

⚠️ **`libs/ui/theme` and `libs/ui/components` are closed to every wave agent.** A slice that
finds it needs a sixth shared component or a tenth colour **reports it** and waits; it does
not add one. Two agents adding to the same barrel is the collision this table exists to
prevent, and unlike a type error it merges cleanly and silently.

### The pairing that is not parallel

**13 and 14 are the same Nx project.** They appear as one unit in the wave because one agent
runs them in sequence, 13 first. Running them as two concurrent agents in one tree would put
both inside `libs/features/homepage` — each agent's gates would see the other's
half-finished edits, which is the exact condition
[plan-parallelization.md](../../../.claude/rules/plan-parallelization.md) requires worktrees
for, and they would still both rewrite `homepage.tsx`.

### If it fans out

Four agents — header, homepage (13 then 14), portfolio-item, footer — at ~20, ~36, ~26 and
~6 files. Well inside the 250-file cap, per agent and in total. Same conditions as the first
wave: a worktree each ([branch-creation-approval.md](../../../.claude/rules/branch-creation-approval.md),
then [worktree-safety.md](../../../.claude/rules/worktree-safety.md) and
[worktree-pnpm-install.md](../../../.claude/rules/worktree-pnpm-install.md)), an exact file
set each, gates per agent on that agent's own projects.

⚠️ **Expect this wave to hand back findings about the design, not just code.** Four of the
five decisions the last wave produced were corrections to the plan, found by the agent sent
to build against it — and this plan's design table has already been wrong twice
([design-sources.md](./design-sources.md)). Budget a coordinator pass for closing them, the
way [D75](./decisions-d75.md#d75) closed the icon divergence that two agents reported and
neither was permitted to fix.

## No database slice

This plan has no database layer, so the unconditional solo-database rule never fires.
Worth stating rather than omitting: its absence here is a fact about the plan, not an
oversight.

## Estimated changed files per slice

| Slice | Files | Notes |
|---|---|---|
| 1 | ~66 | The largest. Workspace scaffold, four `libs/shared/*` packages, the shell, the test harness, **plus the CDK `infra` project** ([D37](./decisions-d33-d41.md#d37)) — defined, not deployed. |
| 2 | ~40 | **Unchanged at ~40, but now a ceiling rather than a floor.** [Q8](./questions-closed.md#q8) closed as [D38](./decisions-d33-d41.md#d38), so the ~15 Storybook files and their coverage gate are not built — the slice keeps its original size instead of growing past it. [Q7](./questions-closed.md#q7) closed as [D40](./decisions-d33-d41.md#d40) — on-demand primitives, so this number is a ceiling rather than a floor. |
| 3 | **37 as built** (27 new, 10 modified) | Estimated ~36. The spike was discarded before the slice, as planned. |
| 4 | **90 as built** (est. ~40) | ⚠️ **The estimate was 2.25× low, and the reasons are worth carrying into slices 5–7.** It counted the boundary and the scaffold and omitted three things: (a) **specs, which are 1:1 with sources here** — 13 of the 24 new `libs/features/shell` files are specs; (b) the **shell's mount points** — four `apps/shell/src/remotes/*` files, the `/portfolio/$slug` route and the regenerated `routeTree.gen.ts`, which the "seams" line described but never counted; (c) the **feature libs' own scaffolding** — `tsconfig.json`, `vitest.config.ts`, `test-setup.ts` and a barrel each, four files per lib rather than the three the row assumed. 81 of the 90 are code; 9 are plan docs. Well inside the 250-file cap. |
| 5 | ~22 | |
| 6 | ~32 | |
| 7 | ~34 | Carries the route and its fallback. |
| 8 | ~26 | Workflow, the CDK stack filled in, deploy scripts, **and the React-major CI check** ([D39](./decisions-d33-d41.md#d39)). |
| 9 | ~16 | Plus the per-remote computed-style assertions that stand in for the declined Storybook ([D38](./decisions-d33-d41.md#d38)). |
| 10 | ~34 | Theme, five shared components, the frame, five fallbacks. Solo. |
| 11 | ~14 | Types and fixtures only. No JSX. Solo. |
| 12 | ~20 | Two of them outside its own projects — the section fixture and the shell's header region. |
| 13 | ~16 | |
| 14 | ~20 | The largest of the wave: four sections with no existing counterpart. |
| 15 | ~26 | Twelve regions, plus the two invented blocks ([D78](./decisions-d76-d81.md#d78)). |
| 16 | ~6 | The same size Slice 5 turned out to be. |

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
