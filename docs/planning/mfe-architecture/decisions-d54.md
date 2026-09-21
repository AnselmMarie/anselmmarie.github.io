# Decision D54 — The Slice 3 spike gate runs in parallel with Slice 2

The index is [decisions.md](./decisions.md). Its own file for the same reason
[D53](./decisions-d53.md) has one: a single decision on a topic of its own — this plan's
execution order — rather than part of a round of questions closing.

<a id="d54"></a>**D54 — The [Slice 3](./slices/03-federation-header.md) spike gate is run
concurrently with [Slice 2](./slices/02-ui-libs.md), in its own worktree, by a second
agent.** Maintainer's call, 2026-09-21, after the plan was reviewed for fan-out.

## What was asked, and why the literal answer was no

The instruction was to fan out the next slices. The plan's dependency graph is
`1 → 2 → 3 → 4 → {5, 6, 7}` ([parallelization.md](./parallelization.md)), so the next three
slices are strictly sequential and **there is no parallel-safe pair among them.** The first
genuinely concurrent wave is 5/6/7, and it sits behind Slice 4's six-project scaffold.

Slice 2 also cannot be split across agents, for three separate reasons:

- all three of its packages mutate `tsconfig.base.json` and `pnpm-lock.yaml`, and
  workspace-manifest work is solo;
- shadcn's generated primitives import `cn` from `@portfolio/ui-components`, so
  `ui-primitives` and `ui-components` are not independent;
- the `libs/features/shell` rewire cannot start until the components it imports exist.

## The edge that was over-constrained

`2 → 3` is justified in the shared-file table as *"the Header is built from
`libs/ui/components`, and `@portfolio/ui-*` must exist before it can be declared an MF
shared dependency."* That is true, and it binds **Slice 3's Header build**. It does not bind
**Slice 3's spike gate**, whose four checks are:

1. federation coexists with TanStack Start's build, scoped to the client environment;
2. federation has not leaked into the SSR/Lambda bundle;
3. React resolves to a single instance across the boundary;
4. a remote-owned asset resolves from the remote's origin, not the page's
   ([D42](./decisions-d42-d47.md#d42)).

None of the four touches `libs/ui/*`. The spike is a throwaway remote rendering one string,
discarded before the real slice is built.

## Why it is worth doing early rather than merely possible

The spike answers [Q2](./questions-closed.md#q2), the plan's last architectural unknown, and
Slice 3 is the plan's own "riskiest slice" — a failure there invalidates slices 3 through 9
and sends the plan to one of Q2's three fallback positions. Buying that answer a slice
earlier costs nothing in ordering and changes what Slice 2 is worth building against.

⚠️ **The spike's result does not unblock Slice 3 proper.** Slice 3 still waits for Slice 2;
this decision moves the *question*, not the slice.

## How it runs

Ran in two git worktrees off `feat/amarie/new-design` (`d8da5d0`) — both **moved into the
branch and deleted on 2026-09-21** per
[worktree-session-wrapup.md](../../../.claude/rules/worktree-session-wrapup.md): Slice 2's
changes were applied to the working tree, the spike's were discarded as designed. Each had
its own
`pnpm install` per [worktree-pnpm-install.md](../../../.claude/rules/worktree-pnpm-install.md):
`claude/slice-2-ui-libs` and `claude/slice-3-spike`. Worktrees rather than the shared tree
because the two units both touch `apps/shell` — Slice 2 rewrites `src/styles.css`, the spike
edits `vite.config.ts` — and both would otherwise race the root manifests and see each
other's in-flight edits in the same Nx project's gates.

Neither agent may commit, stage, create a branch, or edit `docs/planning/**`. The
coordinator owns the plan docs and records both outcomes.

⚠️ **The base is `feat/amarie/new-design`, not `develop`.**
[worktree-safety.md](../../../.claude/rules/worktree-safety.md) requires `develop`; this
repo has no such branch (`origin/develop` does not resolve) and Slice 1 exists only on the
feature branch. Recorded rather than silently deviated from — and it is the same unresolved
base-branch question as [D47](./decisions-d42-d47.md#d47).
