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
- **[D28](../decisions-d17-d32.md#d28)** — and so this slice **corrects the architecture doc**,
  which still says `apps/shell/components/mfe-error-boundary/`. The correction is a path
  change plus one sentence: *"shell-owned" is about ownership, not directory* — the
  boundary is owned by the shell, consumed only by `apps/shell`, and never federated, all
  of which holds from a feature lib.

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
- `src/mfe-loader/` — the loading state, and the timeout that routes a hanging remote into
  the same failure path (see [R7](../risks.md#r7))
- `src/fallbacks/` — one per remote: header, footer, homepage, portfolio item. Per the
  doc's strategy: the header fallback preserves essential navigation, the footer may be
  minimal or omitted, the page-level fallbacks carry a retry action, and the portfolio
  fallback offers navigation back to the portfolio.
- Specs for all of the above

**Pre-created seams for the Slice 5–7 wave** — empty and ready, so three concurrent agents
do not all edit the same files:

- Registry entries for footer, homepage, and portfolio item in `libs/shared/config`
- Mount points in the shell layout and route tree
- `libs/shared/types` content shapes and `libs/shared/fixtures` barrels

**`docs/architecture/mfe-failure-and-fallback-behavior.md`** — the [D28](../decisions-d17-d32.md#d28)
path correction

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-shell,shell,shared-config
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
