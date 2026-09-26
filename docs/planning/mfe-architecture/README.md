# MFE Architecture — Implementation Plan

A TanStack Start shell on AWS Lambda, composing four independently deployed React + Vite
Module Federation remotes (Header, Footer, Homepage, Portfolio Item), styled with
shadcn/ui + Tailwind. Contentful is deliberately **not** in this plan; it gets its own plan
directory after the MVP.

**Why this exists:** the architecture is the portfolio piece; the site is the vehicle
([D33](./decisions-d33-d41.md#d33)). That is the tiebreaker wherever a later choice is
between demonstrating the architecture and shaving complexity.

**Created:** 2026-09-20 · **Branch:** `feat/amarie/build-out`

## Status

| | |
|---|---|
| **Merged** | Slices 1–2 (`7b3bf60`, PR #42) · Slices 3–4 (`bfb75b9`, PR #43) · Slices 5–7 (`d4387c3`, PR #44) · Slices 10–14 + 16 (`ab5c139`, PR #45) · Slice 15 (`6073c9f`, PR #46) · Slice 9 (`cd03959`, PR #48) |
| **Merged, outside the slices** | `8aba011`, PR #47 — Experience bullets from the resume, header nav on shadcn `NavigationMenu`, primitives moved from Radix to Base UI, Experience on shadcn `Accordion`, loading skeletons for the remotes |
| **On `master`** | The composed site works end to end: four live remotes, eight portfolio items with their real images, `/portfolio/<slug>` resolving, an unknown slug answering not-found, and a stopped remote showing its fallback while the others keep rendering |
| **Redesign on `master`** | Slices 10–15: the new palette, type scale and card frame; the header; the whole homepage; and the detail page, all against the 2026-09-22 exports. Slices 11–14 landed as one change ([D92](./decisions-d88-d100.md#d92)). The anchor contract was verified end to end before merge: all five nav links scroll, four landing at exactly 84px ([D100](./decisions-d88-d100.md#d100)) |
| **Done, maintainer's call** | Slices 16 and 17, 2026-09-23 ([D104](./decisions-d104.md#d104)). ⚠️ Slice 16's footer-down check never ran and moves to Slice 9; Slice 17's issue list was never written down |
| **Built, awaiting review** | Slice 8 (deployment): the CDK stack, the deploy/rollback CLI, the `ci.yml` deploy job and three CI checks ([D107–D110](./decisions-d107-d109.md)). Nothing deployed yet; verifications 3 and 4 need the live stack |

⚠️ **The design changed on 2026-09-22.** Two new exports replace the look of every surface
— see [design-sources.md](./design-sources.md) and
[D76](./decisions-d76-d81.md#d76). Slices 10–16 are that work, and they run **before**
deployment and E2E ([D80](./decisions-d76-d81.md#d80)).

⚠️ **Three of the five decisions the 5–7 wave produced were corrections to this plan, not
discoveries about the code** — a wrong item count, a design row claiming a footer v3 never
had, and a file list assigned to a slice forbidden to touch it. Each was found by the agent
sent to build against it. That is the pattern to carry into the redesign wave.

⚠️ **Slices 11–14 repeated it: eight of their thirteen decisions are plan corrections**
([D88–D100](./decisions-d88-d100.md)) — an omitted `year` field, a skills section the field
list never mentioned, a file split the 200-line cap would not hold, a slice that called
itself additive while removing three fields, a variant spec pointed at a component that
takes `children`, and a theme that claimed the design had one breakpoint when it has two.
⚠️ **Most were found by running the gates the slices themselves prescribed**, not by reading
the plan.

## First visible checkpoint

**Slice 1** — the shell rendering a real page. **Where:** `apps/shell` at
`http://localhost:3000/`. **On screen:** a laid-out page from `libs/features/shell`, styled
with Tailwind. **Stubbed:** all content, every remote. **Real by:** Slice 2 (design system),
Slice 3 (first remote), Slice 6 (homepage content).

**The redesign's checkpoint is Slice 10**, which reframes the whole page on its own.

## Flow

**Flow:** frontend-only. The TanStack Start server layer exists as the shell's SSR runtime,
but there is no database and no Contentful in this plan. Data comes from fixtures.
(Maintainer's call, 2026-09-20 — [D17](./decisions-d17-d32.md#d17).)

**Order:** shell (1) → ui libs (2) → federation/header (3) → error boundaries (4) →
footer (5) → homepage (6) → portfolio item (7) → **design foundation (10) → content model
(11) → header (12) → homepage A (13) → homepage B (14) → detail (15) → footer strip (16)** →
**UI/navigation fixes (17)** → E2E (9) → deployment (8)
([D101–D102](./decisions-d101-d102.md), 2026-09-23)

**Placeholder data:** `libs/shared/fixtures/src/**/*.fixture.ts`, consumed only through
`use-content-stub/use-content-stub.ts`. ⚠️ **"Placeholder" is the label
[plan-flow-order.md](../../../.claude/rules/plan-flow-order.md) prescribes for the slot, not
a claim about the copy** — per [D41](./decisions-d33-d41.md#d41) these fixtures hold the
site's real content. The Contentful plan moves them; this one does not delete them.

**Base in parallel:** none. The backend half is out of scope, so there is no other half for
a base agent to scaffold.

⚠️ **Three deliberate deviations from
[plan-flow-order.md](../../../.claude/rules/plan-flow-order.md), recorded rather than
silent:**

- **The Layer column uses `fe` and `ops`**, not the rule's `db` / `api` / `services` /
  `fe-form` / `fe-list` / `connect`. Four of those name backend layers this plan does not
  have, and the form/list split presumes a data-entry shape no surface here takes.
- **No slice deletes the placeholder data.** Per [D41](./decisions-d33-d41.md#d41) the
  fixtures hold real published copy, so there is nothing to delete.
- **The slice index is ordered by execution, not by number** — 9 then 8 sit last while
  keeping their labels ([D80](./decisions-d76-d81.md#d80)). Renumbering would rewrite 97
  references across 40 files, most of them in source.

## Slices

Listed in **execution order**. The `#` column is the label, not the position.

| # | Scope | Layer | Visible? | Files | Status |
|---|---|---|---|---|---|
| [1](./slices/01-workspace-and-shell.md) | Nx workspace, `apps/shell` + `libs/features/shell` + `libs/shared/*`, Vitest, CDK `infra` | fe | ✅ screen | ~66 | ✅ merged (`7b3bf60`) |
| [2](./slices/02-ui-libs.md) | `libs/ui/primitives` + `libs/ui/components` + `libs/ui/theme` | fe | ✅ screen | ~40 | ✅ merged (`7b3bf60`) |
| [3](./slices/03-federation-header.md) | `apps/header` + `libs/features/header`; shell consumes the remote | fe | ✅ screen | 37 | ✅ merged (`bfb75b9`) |
| [4](./slices/04-error-boundaries.md) | `MfeErrorBoundary` + shell-owned fallbacks, bounded retry, **and every wave seam** | fe | ✅ screen | **90 as built** (est. ~40) | ✅ merged (`bfb75b9`) |
| [5](./slices/05-footer-mfe.md) | `apps/footer` + `libs/features/footer` | fe | ✅ screen | **6 as built** (est. ~22) | ✅ merged (`d4387c3`) |
| [6](./slices/06-homepage-mfe.md) | `apps/homepage` + `libs/features/homepage`, on fixtures | fe | ✅ screen | **14 as built** (est. ~32) | ✅ merged (`d4387c3`) |
| [7](./slices/07-portfolio-item-mfe.md) | `apps/portfolio-item` + feature lib + `/portfolio/$slug` | fe | ✅ screen | **27 as built** (est. ~34) | ✅ merged (`d4387c3`) |
| [10](./slices/10-design-foundation.md) | Palette, type, the page frame, five shared components. **Solo** | fe | ✅ screen | **32 as built** (est. ~34) | ✅ merged (`ab5c139`) |
| [11](./slices/11-content-model.md) | Types + fixtures for the new field set. **Solo** | fe | — none | **21 as built** (est. ~14) | ✅ merged (`ab5c139`) |
| [12](./slices/12-header-redesign.md) | Floating nav, mobile overlay, **the `SITE_SECTIONS` contract** | fe | ✅ screen | **26 as built** (est. ~20) | ✅ merged (`ab5c139`) |
| [13](./slices/13-homepage-hero-work.md) | Specs strip, hero, the Work grid | fe | ✅ screen | **13 as built** (est. ~16) | ✅ merged (`ab5c139`) |
| [14](./slices/14-homepage-experience-contact.md) | Experience accordion, Skills, About, Contact | fe | ✅ screen | **10 as built** (est. ~20) | ✅ merged (`ab5c139`) |
| [15](./slices/15-portfolio-detail-redesign.md) | The detail page, **plus the two blocks the design omits** | fe | ✅ screen | ~31 | ✅ merged (`6073c9f`) |
| [16](./slices/16-footer-strip.md) | The footer strip, and its degradation | fe | ✅ screen | ~6 | ✅ done ([D104](./decisions-d104.md#d104)); footer-down check → 9 |
| [17](./slices/17-ui-navigation-fixes.md) | The remaining UI and navigation issues | fe | ✅ screen | unknown | ✅ done ([D104](./decisions-d104.md#d104)) |
| [9](./slices/09-e2e-composition.md) | Playwright over a local production build, incl. failure isolation | fe | — none | **28 as built** (est. ~16) | ✅ merged (`cd03959`) |
| [8](./slices/08-independent-deployment.md) | GitHub Actions (`nx affected`) → CDK-described S3/CloudFront/Lambda, rollback, gated on 9 | ops | — none | **~48 as built** (est. ~26) | built, awaiting review |

Slice 11 is the redesign's one invisible slice and it sits between two visible ones. Slices
9 and 8 are the other two and they sit together at the end, after the visible Slice 17, so **no run of three can form**.
⚠️ **Slice 9 was marked `✅ screen` until 2026-09-20** — it adds no route and no component,
and [plan-visible-first.md](../../../.claude/rules/plan-visible-first.md) is explicit that a
passing test suite is not a visible surface. Every slice is under the 250-file cap.

## The other files in this directory

- [design-sources.md](./design-sources.md) — where each surface's design comes from, what
  is invented, and the two contradictions found inside the new exports themselves. **Read
  this before building any UI.**
- [model.md](./model.md) — the finalized architecture: stack, workspace shape, data flow,
  what reaches the browser versus what stays server-side, the Module Federation strategy,
  and the shadcn/Tailwind sharing strategy.
- [decisions.md](./decisions.md) — the **index** to D1–D110, split into range files when the
  log passed its 500-line cap. The source of truth; each slice restates only the ones that
  bind it. Start at [D33](./decisions-d33-d41.md#d33): the project's purpose is the
  tiebreaker the rest were decided against. Most recently
  [D107–D110](./decisions-d107-d109.md#d107): how Slice 8 deploys.
- [open-questions.md](./open-questions.md) — **none are open.** A slice that finds a new
  blocked field raises it there rather than deciding alone.
- [questions-closed.md](./questions-closed.md) — all twenty-three answered, in full, each
  with its closure note, across three files: Q1–Q8 here, Q9–Q17 and Q20 in
  [the second](./questions-closed-q9-q16.md), Q18/Q19/Q21–Q23 in
  [the third](./questions-closed-q18-q21.md). Both splits were forced by the 500-line cap;
  ⚠️ neither filename records its range, so that existing links keep resolving.
- [parallelization.md](./parallelization.md) — dependency graph, shared-file table, **both
  waves**, and per-slice file counts.
- [risks.md](./risks.md) — production considerations and failure modes.

## Standing references

- [docs/architecture/mfe-failure-and-fallback-behavior.md](../../architecture/mfe-failure-and-fallback-behavior.md)
  — failure isolation, error-boundary ownership, fallback strategy, retry bounds, and the
  immutable-deployment interaction. Implemented by Slice 4; not a plan doc, so it lives
  outside this directory and outlives it.
- [docs/architecture/deploy-and-rollback.md](../../architecture/deploy-and-rollback.md) —
  the deploy runbook: first-time setup, rollback, and the cold-cache check. Built by Slice 8.

## Out of scope

**Contentful.** The whole data layer, its server functions, its secrets handling, and the
deletion of the fixtures are a separate plan, to be written when the MVP is standing. The
architecture doc's Contentful section already records the intended behavior. Nothing in this
plan may read a Contentful credential, and no slice here is blocked on one.
