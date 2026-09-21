# MFE Architecture — Implementation Plan

A TanStack Start shell on AWS Lambda, composing four independently deployed
React + Vite Module Federation remotes (Header, Footer, Homepage, Portfolio Item), styled
with shadcn/ui + Tailwind. Contentful is deliberately **not** in this plan; it gets its
own plan directory after the MVP.

**Status:** Slice 1 built, awaiting review · **Created:** 2026-09-20 · **Branch:** `feat/amarie/new-design`

**Why this exists:** the architecture is the portfolio piece; the site is the vehicle
([D33](./decisions-d33-d41.md#d33)). That is the tiebreaker wherever a later choice is between
demonstrating the architecture and shaving complexity.

## Design source

**The live v3 site**, on the `version-3` / `master` branches and deployed today at
`anselmmarie.github.io`. Nominated 2026-09-20 ([D34](./decisions-d33-d41.md#d34), closing
[Q1](./questions-closed.md#q1)).

**The content and images are ported from commit `39bbe56`** —
[D53](./decisions-d53.md#d53), 2026-09-21. `version-2` and `version-3` are that same commit,
and `origin/master` carries byte-identical content. ⚠️ **The local `master` branch is stale
and is not a source**: it is missing the Pokémon Pet Shop item entirely.

| Screen | Design | Status | Source |
|---|---|---|---|
| Header | live v3 site | ✅ exists | the deployed site + `master` |
| Footer | live v3 site | ✅ exists | the deployed site + `master` |
| Homepage | live v3 site | ✅ exists | the deployed site + `master` |
| Portfolio Item | live v3 site | ✅ exists | the deployed site + `master` |
| Shell layout | live v3 site | ✅ exists | the deployed site + `master` |
| Remote-failure fallbacks | — | **no equivalent** | invented — see below |

⚠️ **The design carries over; the implementation does not.** The v3 site is Next.js.
[D6](./decisions-d01-d16.md#d6) is unchanged — no v3 component is ported and nothing in this plan
reaches for Next.js. What is reused is what the site looks like.

**The fallbacks are the one exception**, and the only residue of Q1. A site with no remotes
has no remote-failure UI, so Slice 4 invents every fallback's visual treatment and flags
each one in its completion report, one line each, per
[plan-design-links.md](../../../.claude/rules/plan-design-links.md).

## First visible checkpoint

**Slice 1** — the shell rendering a real page.
**Where:** `apps/shell` at `http://localhost:3000/`.
**On screen:** a laid-out page from `libs/features/shell`, styled with Tailwind.
**Stubbed:** all content (hardcoded in the feature lib), every remote (none exist yet).
**Real by:** Slice 2 (design system), Slice 3 (first remote), Slice 6 (homepage content).

## Flow

**Flow:** frontend-only. The TanStack Start server layer exists as the shell's SSR runtime,
but there is no database and no Contentful in this plan. Data comes from fixtures.
(Maintainer's call, 2026-09-20 — see [D17](./decisions-d17-d32.md#d17).)

**Order:** shell (1) → ui libs (2) → federation/header (3) → error boundaries (4) →
footer (5) → homepage (6) → portfolio item (7) → deployment (8) → E2E (9)

**Placeholder data:** `libs/shared/fixtures/src/*.fixture.ts`, consumed only through
`use-content-stub.ts`, which lives in `libs/shared/fixtures` so every feature scope can
import it. ⚠️ **"Placeholder" is the label [plan-flow-order.md](../../../.claude/rules/plan-flow-order.md)
prescribes for the slot, not a claim about the copy** — per
[D41](./decisions-d33-d41.md#d41) these fixtures hold the site's real portfolio content. The
Contentful plan moves them; this one does not delete them.

**Base in parallel:** none. The backend half is out of scope, so there is no other half
for a base agent to scaffold.

⚠️ **Two deliberate deviations from
[plan-flow-order.md](../../../.claude/rules/plan-flow-order.md), recorded rather than
silent:**

- **The Layer column uses `fe` and `ops`, not the rule's `db` / `api` / `services` /
  `fe-form` / `fe-list` / `connect`.** Four of those name backend layers this plan does not
  have, and the form/list split presumes a data-entry shape no surface here takes — this is a
  portfolio site, not a CRUD app. `fe` and `ops` are the honest tokens. Flagged because the
  frontend-only exemption permits skipping backend *rows*, not inventing vocabulary.
- **No slice deletes the placeholder data**, which the rule's worked example expects. Per
  [D41](./decisions-d33-d41.md#d41) the fixtures hold the site's real published copy, so there
  is nothing to delete: the Contentful plan **moves** them. The rule asks which slice removes
  them; the answer is none, and that is a decision, not an omission.

## Slices

| # | Scope | Layer | Visible? | Files | Status |
|---|---|---|---|---|---|
| [1](./slices/01-workspace-and-shell.md) | Nx workspace, `apps/shell` + `libs/features/shell` + `libs/shared/*`, Vitest, CDK `infra` | fe | ✅ screen | ~66 | not started |
| [2](./slices/02-ui-libs.md) | `libs/ui/primitives` + `libs/ui/components` + `libs/ui/theme` | fe | ✅ screen | ~40 | not started |
| [3](./slices/03-federation-header.md) | `apps/header` + `libs/features/header`; shell consumes the remote | fe | ✅ screen | ~36 | not started |
| [4](./slices/04-error-boundaries.md) | `MfeErrorBoundary` + shell-owned fallbacks, bounded retry | fe | ✅ screen | ~22 | not started |
| [5](./slices/05-footer-mfe.md) | `apps/footer` + `libs/features/footer` | fe | ✅ screen | ~22 | not started |
| [6](./slices/06-homepage-mfe.md) | `apps/homepage` + `libs/features/homepage`, on fixtures | fe | ✅ screen | ~32 | not started |
| [7](./slices/07-portfolio-item-mfe.md) | `apps/portfolio-item` + feature lib + `/portfolio/$slug` | fe | ✅ screen | ~34 | not started |
| [8](./slices/08-independent-deployment.md) | GitHub Actions (`nx affected`) → CDK-described S3/CloudFront/Lambda, rollback | ops | — none | ~26 | not started |
| [9](./slices/09-e2e-composition.md) | Playwright over the composed app, incl. failure isolation | fe | — none | ~16 | not started |

Slices 8 and 9 are the plan's two invisible slices and they sit together at the end, so no
run of three can form. ⚠️ **Slice 9 was marked `✅ screen` until 2026-09-20** — it adds no
route and no component, and [plan-visible-first.md](../../../.claude/rules/plan-visible-first.md)
is explicit that a passing test suite is not a visible surface. Every slice is under the
250-file cap from [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md).

## The other files in this directory

- [model.md](./model.md) — the finalized architecture: stack, workspace shape, data flow,
  what reaches the browser versus what stays server-side, the Module Federation strategy,
  and the shadcn/Tailwind sharing strategy.
- [decisions.md](./decisions.md) — the **index** to D1 through D52, split into range files
  when the log passed its 500-line cap. The source of truth; each slice restates only the
  ones that bind it. Start at [D33](./decisions-d33-d41.md#d33): the project's purpose is the
  tiebreaker the rest were decided against. The ranges themselves:
  [D1–D16](./decisions-d01-d16.md) (architecture),
  [D17–D32](./decisions-d17-d32.md) (the plan's own, and the host change),
  [D33–D41](./decisions-d33-d41.md) and [D42–D47](./decisions-d42-d47.md) (the two rounds of
  questions closing), and [D48–D52](./decisions-d48-d52.md) (Q14's answer, and the four
  things building Slice 1 forced), and [D53](./decisions-d53.md) (where the portfolio
  content comes from).
- [open-questions.md](./open-questions.md) — the **two** still open:
  [Q2](./open-questions.md#q2), a spike gate Slice 3 answers by building rather than
  deciding, and [Q17](./open-questions.md#q17), how the ported HTML descriptions render.
  Q14 closed on 2026-09-20 as [D48](./decisions-d48-d52.md#d48).
- [questions-closed.md](./questions-closed.md) — the **fifteen** answered on 2026-09-20,
  in full, each with its closure note, with the index table to both halves. Split out of the
  file above when it passed the 500-line cap, then split again at Q9 when closing Q14 pushed
  it over: [Q9–Q16 are in their own file](./questions-closed-q9-q16.md).
- [parallelization.md](./parallelization.md) — dependency graph, shared-file table, the
  one wave, and per-slice file counts.
- [risks.md](./risks.md) — production considerations and failure modes.

## Standing references

- [docs/architecture/mfe-failure-and-fallback-behavior.md](../../architecture/mfe-failure-and-fallback-behavior.md)
  — failure isolation, error-boundary ownership, fallback strategy, retry bounds, and the
  immutable-deployment interaction. Implemented by Slice 4; not a plan doc, so it lives
  outside this directory and outlives it.

## Out of scope

**Contentful.** The whole data layer, its server functions, its secrets handling, and the
deletion of the fixtures are a separate plan, to be written when the MVP is standing. The
architecture doc's Contentful section already records the intended behavior. Nothing in
this plan may read a Contentful credential, and no slice here is blocked on one.
