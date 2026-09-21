# Slice 9 — Playwright over the composed application

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 8
**Design:** not applicable — asserts behavior, not appearance

The last slice, and the only one that can verify the claim the whole architecture rests on:
that one MFE failing does not take down the others.

## Decisions that bind this slice

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

## Open questions blocking this slice

**None.** [Q6](../questions-closed.md#q6) closed on 2026-09-20 as
[D41](../decisions-d33-d41.md#d41): the fixtures carry real portfolio copy, so **the MVP is
publishable off this slice** and nothing here waits on Contentful.

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

- `playwright.config.ts`, and a web-server setup that boots the shell and all four remotes
- `e2e/` — the specs above, one file per concern
- Root `package.json` scripts
- `.github/workflows/` — the E2E job added to the CI workflow from Slice 8

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

The MVP is complete: a TanStack Start shell on Lambda composing four independently
deployed remotes, with failure isolation proven rather than asserted.

**Next:** the Contentful plan. Write it as its own directory under `docs/planning/`, with
its own slices, and do not start it from this plan. Per
[no-cross-plan-drift.md](../../../../.claude/rules/no-cross-plan-drift.md), a finished plan
is a full stop, not a springboard.
