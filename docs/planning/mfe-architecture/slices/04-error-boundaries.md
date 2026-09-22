# Slice 4 — Error boundaries, shell-owned fallbacks, bounded retry

**Status:** ✅ **built 2026-09-21, awaiting review** — 90 files (estimated ~40) · **Visible?** ✅ screen ·
**Depends on:** Slice 3

> **Built.** The boundary, loader, four fallbacks and the not-found are in
> `libs/features/shell`; all four wave seams are pre-created and the six projects are
> scaffolded, tagged and installed. Five decisions came out of it:
> [D63–D67](../decisions-d63-d67.md). The per-file split for the wave is in
> [parallelization.md](../parallelization.md#the-named-per-file-split-for-the-wave)
> ([D67](../decisions-d63-d67.md#d67)).

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

### Correction, same day: the scaffolded apps could not be run

⚠️ **Found by the maintainer, not by the gates**, in two rounds — and the second round
changed this slice's scope ([D68](../decisions-d63-d67.md#d68)).

**Round 2 — *"I can't run footer, homepage and portfolio-item by itself."*** Removing the
targets made the failure honest but left three directories that could not be started. Slice
4 now ships all four remotes **runnable**: full app skeletons (`vite.config.ts` from
`apps/header` per [D55](../decisions-d55.md), `index.html`, `main.tsx`, `bootstrap.tsx`,
`styles.css`, targets) plus a **placeholder component** at the real name in each feature
lib. `pnpm nx dev <remote>` works for all four on its `strictPort` port, and
`.claude/launch.json` carries all five apps.

⚠️ **Three placeholders are now on the composed page.** Each one's spec asserts
`"Slice N fills this"`, which fails the moment the real component lands — the guard against
a placeholder shipping unnoticed.

**Round 1 was the original defect, and is kept because the failure mode repeats:**

⚠️ **Found by the maintainer, not by the gates** — *"footer is not loading correctly. This
localhost page can't be found."*

Slice 4 first scaffolded `apps/footer|homepage|portfolio-item` with `dev` / `build` /
`preview` targets copied from `apps/header`. With no `vite.config.ts` behind them,
`nx dev footer` started Vite on its defaults: it found no `index.html`, bound a **random
free port** instead of 4175, printed a URL, and **exited 0**. The port the shell's registry
actually points at was never bound, so both that URL and 4175 gave *"This localhost page
can't be found"*.

Every gate passed throughout. `typecheck`, `lint`, `test` and `check:file-size` have
nothing to say about a target that starts a server serving nothing — which is the same
shape as [R3](../risks.md#r3) and the `i18n` example the rules keep citing: **a green run
and a broken surface**.

**Fixed** by writing the configs properly (see Round 2 above). Each app carries a
`README.md` with its port, its override env var, and what its slice still owns.

⚠️ **The footer region on the composed page was never broken.** It rendered its shell-owned
fallback, correctly, throughout — there was no Footer remote to load. The defect was
entirely in the scaffold's dev ergonomics.

### What was actually seen, 2026-09-21

⚠️ **The list above says "the header's" throughout because it was written when the Header
was the only remote. As built, the observable surface is larger and one item was checked on
a different remote than the list names.** Stated exactly:

- ✅ **Failure isolation, live** — at `http://localhost:3000/` with the Header remote up and
  the Footer and Homepage origins dead: the **real** Header rendered
  (`[data-testid="header-remote"]`) while `mfe-fallback-footer` and `mfe-fallback-homepage`
  rendered in their own regions. Three regions, three independent outcomes, one page.
- ✅ **The bounded retry, live** — clicking **Try again** on the homepage fallback twice
  replaced the button with *"We have stopped retrying. Reload the page to try again."*
- ✅ **The diagnostic payload, live** — the console carried
  `[mfe:homepage] load failure {mfe, version: dev, route: /, kind: load, errorType, …}` plus
  the component stack, for each failed remote.
- ✅ **`/portfolio/cosmikata`** rendered the shell-level not-found beside the real Header,
  with `<title>` `Project — Anselm Marie` from the route's `head`
  ([D48](../decisions-d48-d52.md#d48)).
- ✅ **Four live remotes, after [D68](../decisions-d63-d67.md#d68)** — with all five servers
  up, `/` rendered `header-remote`, `homepage-remote` and `footer-remote` with **no fallback
  on the page at all**. Federation composes end to end.
- ✅ **[D43](../decisions-d42-d47.md#d43) verified live, both halves.** A cold load of
  `/#other-projects` scrolled on arrival — `scrollY` 190 of a 190px maximum, with the
  section's `scroll-margin-top` computing to `64px` from the shared theme token. ⚠️ It reads
  as doing nothing on a full-height window, because the placeholder page is shorter than the
  viewport and there is nowhere to scroll; check it in a short window.
- ⚠️ **The header fallback was NOT seen in the browser.** It is covered by its own specs and
  by the identical code path the footer and homepage fallbacks exercised — but "seen on
  screen" is a stronger claim than this slice can make for that one fallback, so it is not
  made. With D68 it is now one `Ctrl-C` away: stop `nx dev header` and reload.
- ⚠️ **A successful retry restoring a real remote was verified in a spec, not in the
  browser.** The spec counts the import calls ([D65](../decisions-d63-d67.md#d65)), which is
  the assertion that distinguishes a working retry from the cached-rejection trap. D68 makes
  the live version reachable too: stop a remote, reload, restart it, click **Try again**.

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
