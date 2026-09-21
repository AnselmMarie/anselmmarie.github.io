# Questions Closed

The fifteen questions answered on 2026-09-20 — plus [Q2](#q2), which closed on 2026-09-21
by being built rather than decided — in full, each with the closure note recorded when it
was answered. Split out of [open-questions.md](./open-questions.md) when that file
passed the 500-line cap.

⚠️ **Split in two on 2026-09-20** at the 500-line cap: Q1 through Q8 are below, and
[Q9 through Q16 are in their own file](./questions-closed-q9-q16.md). The index table
covers both. The cut is at Q9 so every Q1–Q8 link already written keeps resolving.

**This is history, not a to-do list.** The decision each one produced is the binding record
— see [decisions.md](./decisions.md). These entries are kept because a decision reads
differently next to the question it answered, and because a reversal needs to see what was
originally weighed.

| Q | Closed by | One line |
|---|---|---|
| [Q1](#q1) | [D34](./decisions-d33-d41.md#d34) | The live v3 site is the visual reference |
| [Q2](#q2) | [D55](./decisions-d55.md#d55) | Federation composes with Start, scoped to the client |
| [Q3](#q3) | [D35](./decisions-d33-d41.md#d35) | AWS; the repo name constrains nothing |
| [Q4](#q4) | [D39](./decisions-d33-d41.md#d39) | Singleton React, non-strict, plus a CI major check |
| [Q5](#q5) | [D31](./decisions-d17-d32.md#d31) | Remotes on S3 behind CloudFront |
| [Q6](#q6) | [D41](./decisions-d33-d41.md#d41) | Fixtures carry real copy; the MVP is publishable |
| [Q7](#q7) | [D40](./decisions-d33-d41.md#d40) | shadcn primitives on demand |
| [Q8](#q8) | [D38](./decisions-d33-d41.md#d38) | No Storybook; Slice 9 asserts computed style |
| [Q9](./questions-closed-q9-q16.md#q9) | [D36](./decisions-d33-d41.md#d36) | All four surfaces federated, client-rendered |
| [Q10](./questions-closed-q9-q16.md#q10) | [D37](./decisions-d33-d41.md#d37) | AWS CDK |
| [Q11](./questions-closed-q9-q16.md#q11) | [D44](./decisions-d42-d47.md#d44) | ESLint for boundaries, Biome for formatting |
| [Q12](./questions-closed-q9-q16.md#q12) | [D42](./decisions-d42-d47.md#d42) | Content images via props; UI assets with the remote |
| [Q13](./questions-closed-q9-q16.md#q13) | [D43](./decisions-d42-d47.md#d43) | Anchor nav, so no router is shared |
| [Q14](./questions-closed-q9-q16.md#q14) | [D48](./decisions-d48-d52.md#d48) | Metadata is server-rendered; content is not |
| [Q15](./questions-closed-q9-q16.md#q15) | [D46](./decisions-d42-d47.md#d46) | cosmikata tooling pruned; 15 rules archived |
| [Q16](./questions-closed-q9-q16.md#q16) | [D45](./decisions-d42-d47.md#d45) | Node 22 via `.nvmrc` |

---

<a id="q1"></a>
## Q1 — There is no design for any surface ✅ closed → [D34](./decisions-d33-d41.md#d34)

**Raised:** 2026-09-20 · **Blocks:** the visual half of Slices 4, 5, 6, 7

No design link was supplied for the Header, Footer, Homepage, Portfolio Item, or the shell
layout and its fallbacks. [plan-design-links.md](../../../.claude/rules/plan-design-links.md)
is explicit that building anyway means **inventing the UI**, which is the maintainer's
decision to make rather than a gap to fill quietly.

Options: draw the designs first; nominate the live v3 site as the visual reference; or
proceed and accept invented UI.

If the answer is "proceed", every control each slice invents is **flagged in that slice's
completion report, one line each**, so review knows what it is looking at.

**Closed 2026-09-20 → [D34](./decisions-d33-d41.md#d34).** The answer is the third option in a
form the question did not offer: **the live v3 site is the visual reference.** Nothing is
invented from nothing, and the design table in [README.md](./README.md) now names that
source per surface.

Two things survive the closure and must not be read as settled:

- **The v3 implementation is not reused.** It is Next.js, [D6](./decisions-d01-d16.md#d6) still
  forbids that, and no component is ported. What carries over is the appearance.
- **The fallback states have no v3 equivalent**, because a site with no remotes has no
  remote-failure UI. Slice 4 still invents those, and still flags each one in its
  completion report, one line each.

---

<a id="q2"></a>
## Q2 — Does `@module-federation/vite` compose with TanStack Start? (closed)

**Closed:** 2026-09-21 → **[D55](./decisions-d55.md#d55)**. ⚠️ **Answered by building, not by
deciding** — the spike gate in [Slice 3](./slices/03-federation-header.md), run early and in
parallel with Slice 2 under [D54](./decisions-d54.md#d54). All four checks passed: federation
coexists with Start's build; it stays out of the `aws-lambda` server bundle when scoped with
`applyToEnvironment`; React resolves to one instance; and a remote-owned asset resolves from
the remote's own origin. None of the three fallback positions below was needed.
[D55](./decisions-d55.md#d55) carries the verbatim configuration, the versions, and the four
things the spike did **not** prove.

**Raised:** 2026-09-20 · **Partially answered:** 2026-09-20 · **Blocks:** Slice 3, and
therefore 5, 6, 7

**What is now settled** → [D30](./decisions-d17-d32.md#d30), [D31](./decisions-d17-d32.md#d31). Cloudflare
confirmed that Module Federation cannot run server-side on `workerd` (no `eval` /
`new Function`, no dynamic `import()` of a remote URL), while client-side federation works
normally. That blocked only federated SSR, which [D9](./decisions-d01-d16.md#d9) had already
declined — and the host has since moved to AWS anyway, so the `workerd` constraint no
longer applies to this plan at all.

**What is still open.** The plugin-coexistence half. The `@cloudflare/vite-plugin`
conflict is gone with the host, but TanStack Start still owns the Vite config and the
Lambda build output, and `@module-federation/vite` still participates in that build.
Federation must be **scoped to the client environment only** and must not transform the SSR
build. Nothing has proven that, and no amount of planning will.

**Answer path:** the spike gate in [Slice 3](./slices/03-federation-header.md), which was
**run early, in parallel with Slice 2** ([D54](./decisions-d54.md#d54)) — its four checks
touched no `libs/ui/*` file, so the question did not have to wait for the design system. The
instruction at the time was: if the two do not compose, **stop and report** rather than
building three more remotes on a broken seam. Fallback positions, in order of preference: load remotes purely client-side outside
Start's build graph; host the MF runtime in a client-only boundary; or back out to monorepo
imports (cheap, because of [D27](./decisions-d17-d32.md#d27)) and revisit.

---

<a id="q3"></a>
## Q3 — This is a GitHub Pages repository. Where does the site actually live? ✅ closed → [D35](./decisions-d33-d41.md#d35)

**Raised:** 2026-09-20 · **Blocks:** Slice 8

The repo is `anselmmarie.github.io`, which GitHub serves as a Pages site today. Pages
cannot execute a Lambda-backed SSR server, so the shell cannot be served the way this site
currently is.

Needs a decision on: whether `anselmmarie.github.io` stays the address at all or the site
moves to a custom domain fronted by CloudFront; what happens to the current Pages
deployment during the transition; and whether the old site stays reachable until the new
one is ready. Note that a `*.github.io` domain cannot be pointed at CloudFront, so keeping
the current address and moving to AWS are mutually exclusive.

**Closed 2026-09-20 → [D35](./decisions-d33-d41.md#d35).** The question conflated a repository
name with a deployment target. The site is served from AWS ([D31](./decisions-d17-d32.md#d31));
GitHub Pages is simply not used; the repository keeps its name and that constrains nothing.

The `*.github.io` observation was correct and irrelevant — there was never a plan to point
that domain at CloudFront. Choosing the actual domain is
[Slice 8](./slices/08-independent-deployment.md) mechanics. The old Pages site stays on
`master` until the new one is ready, and nothing here depends on when it is switched off.

---

<a id="q4"></a>
## Q4 — React singleton strictness across remotes ✅ closed → [D39](./decisions-d33-d41.md#d39)

**Raised:** 2026-09-20 · **Blocks:** Slice 3

`react` and `react-dom` are shared, but MF offers a range: `singleton: true` with
`strictVersion`, singleton without strict versioning, or tolerated duplicates.

Strict is correct and should be the default — two React copies in one page break hooks and
context in ways that surface as unrelated-looking bugs far from the cause. The cost is that
a remote deployed against a different React major fails loudly at load rather than
degrading. That tradeoff is the decision.

**Closed 2026-09-20 → [D39](./decisions-d33-d41.md#d39).** `singleton: true`,
**`strictVersion: false`**, the React version pinned once at the workspace root, and a CI
check that every app resolves the same React major.

This is not the lenient option, and the framing above — strict versus tolerated duplicates
— missed the third arrangement. Strict versioning and the root pin protect against the same
defect ([R2](./risks.md#r2)); they differ in *where the mismatch surfaces*. Strict makes it
a remote that refuses to load in a visitor's browser. The pin plus the CI check makes it a
red build. The CI check is the load-bearing half — without it, `strictVersion: false` is a
disabled guard — and it is Slice 8's to implement.

---

<a id="q5"></a>
## Q5 — Where are the remote bundles hosted? ✅ closed → [D31](./decisions-d17-d32.md#d31)

**Raised:** 2026-09-20 · **Closed:** 2026-09-20

**S3 behind CloudFront.** Each remote builds to static assets plus a `remoteEntry.js` and
is served from S3.

What still has to be worked out inside [Slice 8](./slices/08-independent-deployment.md),
as mechanics rather than as an open decision: the key prefix that makes each deploy
immutably versioned, the CloudFront cache and invalidation behavior for `remoteEntry.js`
(which must not be cached at a version-stable URL, or a rollback will not take effect), and
whether the remotes share one bucket and distribution or get one each.

---

<a id="q6"></a>
## Q6 — Is fixture content acceptable to ship publicly? ✅ closed → [D41](./decisions-d33-d41.md#d41)

**Raised:** 2026-09-20 · **Blocks:** Slice 9 and any public launch before the Contentful plan

The MVP renders from `libs/shared/fixtures`. If the site goes live in that state, the
fixture copy is the site's visible content and it is in a public repo.

Either the fixtures are real portfolio copy — in which case they are fine, and the
Contentful plan is about editing convenience rather than content — or the MVP stays
unpublished until Contentful lands. Worth answering early, because it changes how much care
the fixture content deserves.

**Closed 2026-09-20 → [D41](./decisions-d33-d41.md#d41).** The first branch: **real portfolio
copy**, ported from the live v3 site that [D34](./decisions-d33-d41.md#d34) already makes the visual
reference. The MVP is publishable off Slice 9, the Contentful plan narrows to editing
convenience, and the fixture content is reviewed as content rather than skimmed as a stub.

⚠️ One reading to guard against: [D22](./decisions-d17-d32.md#d22) still requires each report to say
its content comes from fixtures. After this decision that names the **source**, not a
warning that the content is fake.

---

<a id="q7"></a>
## Q7 — Which shadcn primitives are pulled in up front? ✅ closed → [D40](./decisions-d33-d41.md#d40)

**Raised:** 2026-09-20 · **Blocks:** Slice 2

`shadcn add` is cheap to re-run, so the risk is not under-picking. Pulling in a broad set
speculatively means `libs/ui/primitives` carries components nothing imports, and under
[Q8](#q8) each might owe a story.

Also needs answering: which primitives get a `libs/ui/components` wrapper rather than being
consumed directly. The default is direct consumption; a wrapper earns its place when
project-specific behavior or defaults attach to it.

**Closed 2026-09-20 → [D40](./decisions-d33-d41.md#d40).** On demand, never speculatively. Slice 2
pulls only the primitives its actual consumers need, and a `libs/ui/components` wrapper is
written only when project-specific behavior or defaults attach to a primitive.

The question's own framing decided it: `shadcn add` is re-runnable, so under-picking costs
one command later while over-picking leaves the package carrying components nothing
imports.

---

<a id="q8"></a>
## Q8 — Should `libs/ui/components` require a Storybook story per module? ✅ closed → [D38](./decisions-d33-d41.md#d38)

**Raised:** 2026-09-20 · **Blocks:** Slice 2

**Nothing currently requires this.** `.claude/rules/` here had 47 files when this was
raised (32 active since [D46](./decisions-d42-d47.md#d46)) and
`component-needs-story.md` is not among them. The cosmikata repo has that rule — it
requires a story for every module in `libs/ui/components`, enforced by a coverage spec that
fails in three directions — but it was not among the rules copied into this repo. So this
is a question about what to adopt, not about interpreting something already present.

Adopting it means standing up Storybook in Slice 2, roughly 15 files plus a gate, and
deciding whether `libs/features/*` is in scope too. Declining it means the design system
has no browser-level check at all, and Slice 9's Playwright specs are the first thing that
renders a component with a real stylesheet.

The argument for adopting it is specific to this architecture rather than general. The
cosmikata rule documents two shipped defects that a story caught and a mocked unit spec did
not, both of which came down to a component behaving differently against a real stylesheet
than against a mock. This plan puts a **single shared Tailwind preset behind four
independently built remotes** — see [R3](./risks.md#r3) — which is the same class of defect
with more surfaces to hide in.

**Closed 2026-09-20 → [D38](./decisions-d33-d41.md#d38). Declined** — no Storybook, and
cosmikata's `component-needs-story.md` is not adopted here.

⚠️ **The gap the question identified is real and the decline does not make it go away.**
Until Slice 9, nothing renders a component against a real stylesheet, which is exactly the
blind spot [R3](./risks.md#r3) lives in. So the decline carries an obligation:
[Slice 9](./slices/09-e2e-composition.md)'s Playwright specs must assert a **computed
style** on at least one shared-design-system component per remote. Asserting that a
component rendered is not asserting that it was painted, and only the second one catches a
tree-shaken class.
