# Slice 4 — Error boundaries, shell-owned fallbacks, bounded retry

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 3
**Design:** ⚠️ **the one slice with no reference.** [Q1](../questions-closed.md#q1) closed as
[D34](../decisions-d33-d41.md#d34) — the live v3 site is the visual reference for every other
surface — but a site with no remotes has no remote-failure UI, so the fallbacks have no v3
equivalent. Every fallback's visual treatment is **invented** and must be flagged in the
completion report, one line each.

This slice implements
[docs/architecture/mfe-failure-and-fallback-behavior.md](../../../architecture/mfe-failure-and-fallback-behavior.md)
in full. Read that document before starting; it is the specification and this file is only
the plan's view of it.

## Decisions that bind this slice

- **[D16](../decisions-d01-d16.md#d16)** — one error boundary per remote, owned by the shell, with
  a fallback that is **never federated**. A federated fallback can fail for the same reason
  its remote did.
- **[D27](../decisions-d17-d32.md#d27)** — the boundary and the fallbacks live in
  `libs/features/shell`, not in `apps/shell`.
- **[D28](../decisions-d17-d32.md#d28)** — ✅ **already applied; verify, do not rewrite.** The
  architecture doc was corrected when it was committed (`031b8fc`) and already reads
  `libs/features/shell/src/mfe-error-boundary/`, with the *"shell-owned" is about ownership,
  not directory* sentence beside it. This slice's obligation is to **build at that path** and
  confirm the doc still matches — not to edit the doc. (Slice 4 claimed the edit was
  outstanding until 2026-09-21; it was not.)
- **[D44](../decisions-d42-d47.md#d44)** — ⚠️ **this slice scaffolds six projects and must tag
  every one of them.** `apps/footer|homepage|portfolio-item` are `type:app`;
  `libs/features/footer|homepage|portfolio-item` are `type:feature`; each pair shares
  `scope:footer` / `scope:homepage` / `scope:portfolio-item`. An untagged project is
  unconstrained and the boundary rule passes trivially — so six untagged projects would hand
  the wave three agents with no boundary enforcement at all.
- **[D43](../decisions-d42-d47.md#d43)** — ⚠️ **the shell re-applies `location.hash` once a
  remote mounts, and that is this slice's code.** A cold deep link to `/#work` looks for an
  element that does not exist yet, because the Homepage remote loads after hydration
  ([D36](../decisions-d33-d41.md#d36)) — the browser does not retry, and it scrolls nowhere,
  silently. D43 names the shell as "the layer that knows" precisely because it already wraps
  each remote in a boundary ([D16](../decisions-d01-d16.md#d16)). It lives in `src/mfe-loader/`
  below. [Slice 6](./06-homepage-mfe.md) owns only the section `id`s and their
  `scroll-margin-top`; it cannot own this half, because the shell layout is a seam this slice
  pre-creates and Slice 6 is one of three concurrent agents.

- **[D34](../decisions-d33-d41.md#d34)** — the v3 site is the reference *for the surfaces that
  exist there*, which the fallbacks do not. This slice inherits the residue of Q1: the
  behavior is fully specified by the architecture doc; the appearance is not specified
  anywhere. Build it, and flag every invented control.

## Open questions blocking this slice

**None.** [Q1](../questions-closed.md#q1) closed on 2026-09-20 as
[D34](../decisions-d33-d41.md#d34), which left this slice's fallbacks as the only invented UI in the
plan — see the Design line above. That is a flagging obligation, not a blocker.

## What is on screen at the end

Four things a reviewer can do by hand:

1. Stop the header's dev server, reload — the header's fallback renders and the rest of the
   page is untouched.
2. Force a render-time throw inside the header — the same fallback, and the page survives.
3. Click **try again** — the remote reloads and, on success, the boundary resets and the
   real header appears.
4. Click it repeatedly — the retry is bounded and the UI says so. It does not loop.

**Stubbed:** error reporting logs to the console with the full diagnostic payload the doc
requires (MFE name, version, route, error type and message, runtime info, timestamp,
correlation id). Shipping it to a real service is not in this plan.

## Files this slice creates and modifies

**`libs/features/shell`**

- `src/mfe-error-boundary/` — the boundary, its props (`mfe`, `version`, `fallback`), the
  reset logic, and the diagnostic logger
- `src/mfe-loader/` — the loading state; the timeout that routes a hanging remote into the
  same failure path (see [R7](../risks.md#r7)); and **the `location.hash` re-apply on mount**
  required by [D43](../decisions-d42-d47.md#d43), with a spec that fails when it is removed
- `src/fallbacks/` — one per remote: header, footer, homepage, portfolio item. Per the
  doc's strategy: the header fallback preserves essential navigation, the footer may be
  minimal or omitted, the page-level fallbacks carry a retry action, and the portfolio
  fallback offers navigation back to the portfolio.
- Specs for all of the above

**Pre-created seams for the Slice 5–7 wave** — empty and ready, so three concurrent agents
do not all edit the same files. [parallelization.md](../parallelization.md) names four, and
the fourth is the one with teeth:

1. **Registry entries** for footer, homepage and portfolio item in `libs/shared/config`,
   pointing at remotes that do not exist yet.
2. **Mount points** in the shell layout and route tree, including the
   `/portfolio/$slug` route slot Slice 7 fills.
3. **`libs/shared/types` and `libs/shared/fixtures`** — ⚠️ **the whole of both packages, not
   just their barrels.** Slices 6 and 7 each write content shapes and fixture data into these
   two projects, so they are **co-owned for the wave** and the coordinator settles the file
   split before any agent starts: one module per surface, named here, so no two agents open
   the same file. `use-content-stub.ts` is part of this — it lives in `libs/shared/fixtures`,
   both slices read it, and **only the coordinator writes it**, with both read signatures
   stubbed up front.
4. **⚠️ The workspace manifests, and the scaffold they carry.** The coordinator creates all
   six projects — `apps/footer`, `apps/homepage`, `apps/portfolio-item` and their three
   feature libs — with their `project.json` (tagged, per D44 above), `package.json` and
   tsconfig; registers them in `tsconfig.base.json`; and runs `pnpm install` **once**.
   Without this, each of the three agents creates its own Nx project and all three mutate
   the root tsconfig references and `pnpm-lock.yaml` concurrently — the exact collision
   [plan-parallelization.md](../../../../.claude/rules/plan-parallelization.md) makes
   manifest work solo to prevent.

⚠️ **Seams 3 and 4 are why this slice cannot be skipped or thinned** if the wave is to run at
all. A "just the boundary" Slice 4 leaves the fan-out to collide.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-shell,shell,shared-config,shared-types,shared-fixtures
```

⚠️ **[prove-the-spec-can-fail.md](../../../../.claude/rules/prove-the-spec-can-fail.md)
binds hard here.** Every spec written for the boundary must be **seen failing** before this
slice is reported: remove the boundary, or the reset, or the retry bound, confirm the edit
actually landed with `git diff`, and watch the assertion go red. A boundary spec that has
only ever been green is the exact case that rule exists for — it is trivially easy to write
one that passes whether or not the boundary is there.

The completion report says, per spec, `seen failing` with the revert made and the assertion
that went red.

## Notes for whoever builds this

- **The fallback must not import a remote.** Not transitively either. A fallback reaching
  into `@portfolio/feature-header` defeats the entire point.
- **Loading failure and render failure are different states** and arrive through different
  paths — a missing `remoteEntry.js` never reaches a React error boundary. Both end at the
  same fallback, but the loader has to route the first one there deliberately.
- **Bound the retry in the UI, not only in code.** After the last attempt, the fallback
  says so rather than silently ignoring clicks.
