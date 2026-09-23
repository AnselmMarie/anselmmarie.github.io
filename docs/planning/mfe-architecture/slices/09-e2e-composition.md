# Slice 9 — Playwright over the composed application

**Status:** not started · **Visible?** — none · **Depends on:** Slices 15, 16, 17 · **Runs before:** Slice 8 ([D101](../decisions-d101-d102.md#d101))
**Design:** not applicable — asserts behavior, not appearance

The second-to-last slice ([D101](../decisions-d101-d102.md#d101)), and the only one that can
verify the claim the whole architecture rests on: that one MFE failing does not take down
the others. It runs before deployment, so [Slice 8](./08-independent-deployment.md)'s first
deploy is already gated on it.

## Decisions that bind this slice

- **[D101](../decisions-d101-d102.md#d101)** — ⚠️ **this slice runs before Slice 8**,
  against a local production build of the shell and all four remotes, not a deployment.
  Its E2E job goes into the existing `.github/workflows/ci.yml`. CloudFront caching
  ([R12](../risks.md#r12)) is out of reach here and stays in Slice 8.
- **[D102](../decisions-d101-d102.md#d102)** — [Slice 17](./17-ui-navigation-fixes.md)'s
  fixes land first, so the suite asserts the fixed navigation, not the current one.
- **[D20](../decisions-d17-d32.md#d20)** — Playwright arrives here, once there is a composition to
  test. Vitest has covered every slice since Slice 1; this covers the thing Vitest
  structurally cannot.
- **[D16](../decisions-d01-d16.md#d16)** — failure isolation is the property under test.
- **[D38](../decisions-d33-d41.md#d38)** — ⚠️ **Storybook was declined, and this slice absorbs what
  it would have caught.** Nothing in the plan renders a component against a real stylesheet
  before now. So the specs below assert a **computed style** on at least one
  shared-design-system component per remote, not merely that the element is present — an
  element can be present and completely unpainted, which is exactly how
  [R3](../risks.md#r3) fails.
- **[D51](../decisions-d48-d52.md#d51)** — ⚠️ **R3 is a demonstrated failure in this repo, not
  a theoretical one.** It fired in Slice 1: `libs/features/shell` is a symlinked workspace
  package, Tailwind 4 skips `node_modules` when auto-detecting sources, and the page rendered
  **completely unstyled with a green build**. It was found by looking at the screen — which
  is the capability this slice is standing in for. Every remote whose classes depend on an
  `@source` line in `libs/ui/theme` is one forgotten line away from the same thing, so the
  computed-style assertion is the only automated check in the plan that catches it.

## Open questions blocking this slice

**None.** [Q6](../questions-closed.md#q6) closed on 2026-09-20 as
[D41](../decisions-d33-d41.md#d41): the fixtures carry real portfolio copy, so nothing here
waits on Contentful. Since [D101](../decisions-d101-d102.md#d101), the MVP is published by
Slice 8, after this suite is green.

⚠️ Which raises this slice's stakes rather than lowering them. Its green run is the last
gate before a public site, so a spec that asserts presence without asserting the page was
actually painted (see D38 above) is the difference between shipping and shipping broken.

## What this slice delivers

Playwright specs over the real composed app, covering:

1. **The happy path** — the page loads, all four remotes render, navigation from the
   homepage listing to a portfolio item works.
2. **Styling actually applied** — a computed-style assertion per remote on a component
   drawn from the shared design system, per [D38](../decisions-d33-d41.md#d38). This is the check
   that stands in for the Storybook that was not built.
3. **Failure isolation, per remote** — block a remote's `remoteEntry.js` at the network
   layer and assert: its fallback renders, **and the other three still render**, and
   routing still works, and the shell did not crash. Four specs, one per remote. This is
   the assertion no unit test can make, and it is the reason this slice exists.
4. **Bounded retry** — the retry control appears, works when the remote comes back, and
   stops after its bound rather than looping.
5. **Loading versus runtime failure** — a missing `remoteEntry.js` and a render-time throw
   both land in the same fallback by different paths.

## Files this slice creates and modifies

- `playwright.config.ts`, and a web-server setup that **builds** the shell and all four
  remotes and serves the production output. There is no deployment to point at yet
  ([D101](../decisions-d101-d102.md#d101)). Keep the base URL configurable, so Slice 8 can
  run the same suite against the deployed site.
- `e2e/` — the specs above, one file per concern
- Root `package.json` scripts
- `.github/workflows/ci.yml` — an E2E job added to the existing gates workflow. Slice 8
  later makes its deploy jobs depend on this job

## Gates

```bash
pnpm nx run-many -t typecheck lint test
pnpm playwright test
```

⚠️ The isolation specs must be **seen failing**
([prove-the-spec-can-fail.md](../../../../.claude/rules/prove-the-spec-can-fail.md)):
remove a boundary from `libs/features/shell`, confirm the edit landed with `git diff`, and
watch the corresponding spec go red. A spec that blocks a remote and asserts the page still
renders will pass in a suite where nothing was ever wrapped in a boundary at all. It is one
of the easiest false-green tests to write, which is exactly why it gets the negative
control.

## Notes for whoever builds this

- **Block at the network layer**, not by stopping a dev server. Route interception is
  deterministic and runs in CI; a stopped process is neither.
- **Assert what is still there**, not only what broke. "The header fallback rendered" is
  half the claim; "and the homepage, portfolio, and footer still rendered" is the half that
  matters.
- Run against a production-like build, not the dev servers. Module Federation behaves
  differently in dev, and dev is not what ships.

## After this slice

[Slice 8](./08-independent-deployment.md) deploys the site, with this suite as its gate.
That slice, not this one, closes the MVP ([D101](../decisions-d101-d102.md#d101)).
