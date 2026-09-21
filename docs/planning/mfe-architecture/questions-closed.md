# Questions Closed

The fourteen questions answered on 2026-09-20, in full, each with the closure note recorded
when it was answered. Split out of [open-questions.md](./open-questions.md) when that file
passed the 500-line cap.

**This is history, not a to-do list.** The decision each one produced is the binding record
— see [decisions.md](./decisions.md). These entries are kept because a decision reads
differently next to the question it answered, and because a reversal needs to see what was
originally weighed.

| Q | Closed by | One line |
|---|---|---|
| [Q1](#q1) | [D34](./decisions-d33-d41.md#d34) | The live v3 site is the visual reference |
| [Q3](#q3) | [D35](./decisions-d33-d41.md#d35) | AWS; the repo name constrains nothing |
| [Q4](#q4) | [D39](./decisions-d33-d41.md#d39) | Singleton React, non-strict, plus a CI major check |
| [Q5](#q5) | [D31](./decisions-d17-d32.md#d31) | Remotes on S3 behind CloudFront |
| [Q6](#q6) | [D41](./decisions-d33-d41.md#d41) | Fixtures carry real copy; the MVP is publishable |
| [Q7](#q7) | [D40](./decisions-d33-d41.md#d40) | shadcn primitives on demand |
| [Q8](#q8) | [D38](./decisions-d33-d41.md#d38) | No Storybook; Slice 9 asserts computed style |
| [Q9](#q9) | [D36](./decisions-d33-d41.md#d36) | All four surfaces federated, client-rendered |
| [Q10](#q10) | [D37](./decisions-d33-d41.md#d37) | AWS CDK |
| [Q11](#q11) | [D44](./decisions-d42-d47.md#d44) | ESLint for boundaries, Biome for formatting |
| [Q12](#q12) | [D42](./decisions-d42-d47.md#d42) | Content images via props; UI assets with the remote |
| [Q13](#q13) | [D43](./decisions-d42-d47.md#d43) | Anchor nav, so no router is shared |
| [Q15](#q15) | [D46](./decisions-d42-d47.md#d46) | cosmikata tooling pruned; 15 rules archived |
| [Q16](#q16) | [D45](./decisions-d42-d47.md#d45) | Node 22 via `.nvmrc` |

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

---

<a id="q9"></a>
## Q9 — Now that the runtime permits it, should federated SSR be adopted? ✅ closed → [D36](./decisions-d33-d41.md#d36)

**Raised:** 2026-09-20 · **Blocks:** Slices 6 and 7, and
[model.md §4](./model.md#4-ssr-model)

The question the host change made askable. Under client-side-only federation, **none of the
MFE content is in the server-rendered HTML** — the Lambda renders the shell chrome and four
empty slots, and the header, homepage, portfolio item, and footer all appear only after the
browser loads and hydrates them.

For a portfolio site that matters in three specific ways: search engines that do not
execute JavaScript see an empty page, link previews and social cards get nothing, and the
first paint is chrome rather than content. Google does execute JavaScript; most other
crawlers and preview bots do not.

Lambda runs Node, which can fetch a remote entry and evaluate it, so
`@module-federation/node` makes server-side federation possible in a way `workerd` did not
([D30](./decisions-d17-d32.md#d30)). But [D32](./decisions-d17-d32.md#d32) holds the line
[D9](./decisions-d01-d16.md#d9) drew: it stays declined until explicitly adopted.

Three ways forward, and the middle one is the cheapest:

1. **Accept it.** Client-rendered content, and lean on Google executing JS. No plan change.
2. **Do not federate the content surfaces.** Homepage and Portfolio Item become ordinary
   shell imports, so they server-render and are fully indexable; only Header and Footer stay
   federated. Slices 6 and 7 get materially simpler, and the two surfaces that lose
   independent deployment are the ones that change least often.
3. **Adopt federated SSR.** Everything server-renders and everything stays independently
   deployed. It is the largest complexity increase available in this plan, and it couples
   every remote's availability to the shell's time-to-first-byte — a slow remote becomes a
   slow page rather than a late-filling slot.

**Closed 2026-09-20 → [D36](./decisions-d33-d41.md#d36).** Option 1: **all four surfaces stay
federated and client-rendered.** [D8](./decisions-d01-d16.md#d8), [D9](./decisions-d01-d16.md#d9) and
[D32](./decisions-d17-d32.md#d32) hold unchanged.

Decided against [D33](./decisions-d33-d41.md#d33): the architecture is the deliverable, and option
2 would have bought indexability by removing half of what is being demonstrated.

⚠️ **The consequence is accepted, not solved.** Crawlers that do not execute JavaScript see
an empty page, link previews get nothing from the content surfaces, and first paint is
chrome. [model.md §4](./model.md#4-ssr-model) describes it and that description stands.
Reopening this is a deliberate reversal against D33 with a new numbered decision — not a
bug report.

---

<a id="q10"></a>
## Q10 — What deploys the AWS infrastructure? ✅ closed → [D37](./decisions-d33-d41.md#d37)

**Raised:** 2026-09-20 · **Blocks:** Slices 1 and 8

[D31](./decisions-d17-d32.md#d31) names the services but not the tooling, and that choice shapes
both the Slice 1 scaffold and the Slice 8 workflow.

The shell needs a Lambda adapter for TanStack Start, an invocation path (a Lambda function
URL behind CloudFront, or API Gateway), and something to describe the S3 buckets, the
distribution, the IAM roles, and the cache behaviors. Candidates run from plain SAM or CDK,
to the Serverless Framework, to SST — which does the most for you and is also the most
opinionated about how the app is structured.

Worth deciding before Slice 1 rather than during Slice 8, because the adapter affects how
`apps/shell` is built and what its dev server looks like. Deciding it late means rebuilding
the scaffold.

**Closed 2026-09-20 → [D37](./decisions-d33-d41.md#d37). AWS CDK**, in TypeScript, as its own
registered Nx project.

Chosen over SST, which would have owned the deploy story and displaced
[D23](./decisions-d17-d32.md#d23)'s single `nx affected` workflow, and over Terraform, which puts
the infrastructure in a second language and a state store outside the Nx graph. **D23 is
unchanged**: Actions decides what to deploy, CDK describes what it deploys into.

The timing concern in the question was the right one and is now moot —
[Slice 1](./slices/01-workspace-and-shell.md) scaffolds `apps/shell` against a CDK-deployed
Lambda from the first commit, so the adapter is settled before any remote exists.

---

<a id="q11"></a>
## Q11 — Biome or ESLint, and what enforces the Nx module boundaries? ✅ closed → [D44](./decisions-d42-d47.md#d44)

**Raised:** 2026-09-20 · **Blocks:** Slice 1, and the enforceability of
[D27](./decisions-d17-d32.md#d27) and [D29](./decisions-d17-d32.md#d29)

The repo root has a `biome.json` and **no ESLint config at all**. But `.claude/rules/`
assumes ESLint throughout, concretely and by filename:
[no-nested-ternary.md](../../../.claude/rules/no-nested-ternary.md) says its rule is
"enabled in the root `eslint.config.mjs`",
[spec-file-imports.md](../../../.claude/rules/spec-file-imports.md) governs `import/first`
and describes lint-staged invoking `eslint --fix`, and
[worktree-pnpm-install.md](../../../.claude/rules/worktree-pnpm-install.md) treats
`@nx/enforce-module-boundaries` as a gate that must run.

⚠️ **The part that matters is not the formatter, it is the boundary check.**
[D27](./decisions-d17-d32.md#d27) says an app holds no flesh and [D29](./decisions-d17-d32.md#d29) says
reused non-UI code lives in `libs/shared/*`. Both are import-graph rules, and in the repo
they were copied from, the thing that enforces them is
`@nx/enforce-module-boundaries` — **an ESLint rule with no Biome equivalent.** Adopt Biome
alone and those two decisions become conventions that a reviewer has to catch by eye, which
is exactly how `apps/*` accumulates components.

Options: ESLint for the boundary rules with Biome kept as formatter only; ESLint alone;
Biome alone and D27/D29 demoted to reviewed conventions; or Biome plus a custom Nx graph
check that fails CI on a forbidden import.

Note the same answer decides whether `eslint-plugin-jsx-a11y` exists here. The v3 site had
it; nothing in this plan replaces it, and Biome's accessibility rules are not a superset.

---

**Closed 2026-09-20 → [D44](./decisions-d42-d47.md#d44).** ESLint owns correctness and the module
boundaries; Biome stays the formatter and import organizer. The maintainer added
`eslint.config.mjs` with `@nx/enforce-module-boundaries` at `error`, which gives
[D27](./decisions-d17-d32.md#d27) and [D29](./decisions-d17-d32.md#d29) a mechanism instead of a convention.

⚠️ **The config did not load as first committed** — it imported a
`tools/eslint/module-boundaries.mjs` that did not exist, so the boundary rule never executed.
✅ **Repaired 2026-09-20 under [D46](./decisions-d42-d47.md#d46):** that file now exists and
the three plugins are declared. The `eslint-plugin-jsx-a11y` question this entry raised was
tracked in [Q15](#q15) and closed with it. Slice 1 installs and proves the config, and tags
every project so the constraints are not silently inert.

---

<a id="q12"></a>
## Q12 — Where do static assets live, and what resolves their URLs across remotes? ✅ closed → [D42](./decisions-d42-d47.md#d42)

**Raised:** 2026-09-20 · **Blocks:** Slices 3, 6, 7

The v3 site serves portfolio images from `public/images/portfolio/...`, and
[D41](./decisions-d33-d41.md#d41) ports that content into the fixtures — image paths included.
Nothing in the plan says where those files go or how a remote references them.

⚠️ **This is the federation trap that works in development and breaks in production.** A
remote that emits `/images/portfolio/clorox01.jpg` resolves that path against the **page's**
origin — the shell's — not against the origin its own bundle was loaded from. In dev every
app is on localhost and it works. In production the shell is behind one CloudFront path and
the remote's assets are in S3 under a versioned key prefix ([R12](./risks.md#r12)), so the
image 404s. Vite's `base` and the MF asset-URL handling are what decide this, and they are
set at build time per remote.

Needs deciding: whether assets live with the shell (simple, but couples an image change to a
shell deploy and quietly violates [D12](./decisions-d01-d16.md#d12)), with each remote under its
versioned prefix (correct, and requires `base` set per remote plus assets that survive
rollback), or in a separate origin both reference.

Related, and worth settling at the same time: [D41](./decisions-d33-d41.md#d41) makes these images
published content, so a rollback that strips an image is a visible regression.

---

**Closed 2026-09-20 → [D42](./decisions-d42-d47.md#d42).** Split by kind, because the two kinds of
asset have opposite answers:

- **Content images travel in the props payload from the shell** — the fixture holds the URL,
  the shell passes it, the remote renders it. A remote that never builds an asset URL cannot
  get the origin wrong, and this is exactly the shape Contentful turns into post-MVP, so the
  migration is a fixture value rather than a bundle change.
- **Component-owned UI assets ship with their remote**, and each remote's Vite `base` is set
  to its deployed CloudFront URL. ⚠️ The dev/prod trap named above survives rule 1 and lives
  here; Slice 3 sets the pattern.

---

<a id="q13"></a>
## Q13 — How does a remote navigate without coupling to the shell's router? ✅ closed → [D43](./decisions-d42-d47.md#d43)

**Raised:** 2026-09-20 · **Blocks:** Slice 3

The Header is a nav bar — it exists to link places. But
[model.md §6](./model.md#6-module-federation-strategy) says a remote "knows nothing of the
shell beyond the props it receives", and [D4](./decisions-d01-d16.md#d4) gives routing to the shell.
Those two sentences do not tell you what the Header renders when it wants to link to
`/portfolio`.

Three answers, and they differ in what has to be shared:

1. **Props only.** The shell passes nav items and an `onNavigate` callback; the Header
   renders buttons. Cleanest boundary, no new shared dependency — but it gives up real
   anchors unless the shell also passes `href`s, and anchors are what make links
   middle-clickable, copyable, and legible to a crawler.
2. **Share the router as a singleton.** The Header imports TanStack Router's `Link`.
   Ergonomic and keeps real anchors, but the router joins `react` and `react-dom` in the
   shared-singleton set — which is **not currently in the plan's shared-dependency list** —
   and the Header now breaks if the shell's router version moves.
3. **The shell injects a `Link` component** as a prop. Keeps anchors, keeps the boundary,
   costs one prop and a small indirection.

⚠️ Whichever is chosen, [model.md §6](./model.md#6-module-federation-strategy)'s shared
dependency list needs updating if the answer is 2, and Slice 3 is where that config gets
written.

---

**Closed 2026-09-20 → [D43](./decisions-d42-d47.md#d43).** The premise was wrong: the Header's links
are **in-page anchor jumps**, not route changes. So none of the three options applies and
**the shared-dependency set is unchanged** — no router singleton.

Three mechanics fall out, and the second is the one that would otherwise ship broken:

- The fixed-header offset is `scroll-margin-top` sized from the **header-height token in
  `libs/ui/theme`**, so the Header and Homepage remotes agree on one number at build time
  ([D26](./decisions-d17-d32.md#d26)) rather than passing it across the boundary.
- ⚠️ **The anchor target is inside a remote that has not loaded yet.** A cold deep link to
  `/#work` finds no element, and the browser does not retry — a silent failure. The shell
  re-applies `location.hash` once the Homepage remote mounts.
- Off the homepage, anchors are `/#id` rather than `#id`.

---

<a id="q15"></a>
## Q15 — Half-ported cosmikata tooling ✅ closed → [D46](./decisions-d42-d47.md#d46)

**Raised:** 2026-09-20 · **Narrowed:** 2026-09-20 · **Closed:** 2026-09-20 ·
**Blocked:** Slice 1

[R10](./risks.md#r10) said to prune `.claude/rules/` "in its own change, before Slice 1". No
slice owned that change, and the problem turned out to be wider than `.claude/rules/`: every
config file at the root had come from cosmikata too, and one of them did not load.

**All of it was fixed on 2026-09-20 — see [D46](./decisions-d42-d47.md#d46) for the full record.**

| Item | Outcome |
|---|---|
| `eslint.config.mjs` imported a `tools/eslint/module-boundaries.mjs` that did not exist, so ESLint failed at config load and `@nx/enforce-module-boundaries` never ran | ✅ file written against this workspace's tags; both files parse |
| Stale ignores: `.wrangler`, `_wip/**`, `mockServiceWorker.js`, `libs/shared/assets` | ✅ removed, replaced with `.output` / `.nitro` / `cdk.out` / `playwright-report` |
| `.nxignore` ignored `_wip` and cited a cosmikata plan doc | ✅ reduced to `.claude/worktrees` |
| `biome.json` had no `@portfolio/**` import group | ✅ added |
| `package.json` was still the deleted v3 site's Next.js manifest | ✅ replaced with a workspace root; `packageManager` + `engines` added |
| `.claude/rules/` — 47 files, a third inapplicable | ✅ 15 archived, 32 active |
| `coding-conventions.md` carried a React Native "No Pressable" section | ✅ removed |

⚠️ **Two things this closure does not resolve, both recorded so they are not mistaken for
oversights:**

- **Three archived rules leave a genuine gap** — `design-system.md`,
  `design-audit-in-slice.md` and `button-label-lowercase.md` were doing real work and only
  their *references* were dead. [Slice 2](./slices/02-ui-libs.md) writes a `@portfolio`
  design-system rule; the audit rule wants rewriting once sibling screens exist.
- **`worktree-safety.md` requires a `develop` branch this repo does not have**
  ([D47](./decisions-d42-d47.md#d47)). Any worktree created here trips its halt condition. It blocks
  no slice, so it is not carried as a question.

---

<a id="q16"></a>
## Q16 — What pins Node and pnpm? ✅ closed → [D45](./decisions-d42-d47.md#d45)

**Raised:** 2026-09-20 · **Blocks:** Slice 1

[D24](./decisions-d17-d32.md#d24) declines Docker partly on the grounds that "the Actions runner
already pins Node and pnpm, so a build image buys reproducibility this project has no
evidence of needing".

That premise is not true yet. The repo has **no `.nvmrc`, no `engines` field, no
`packageManager` field, and no workflow** — the workflow arrives in Slice 8. The reasoning
is sound but it describes a state Slice 1 has to create rather than one it inherits.

Small to answer — `packageManager` plus `engines` plus a `.nvmrc`, with the Actions workflow
reading the same values — but worth answering explicitly, because a decision resting on an
untrue premise is the kind of thing that gets rediscovered as a surprise when someone tries
to reopen Docker.

**Closed 2026-09-20 → [D45](./decisions-d42-d47.md#d45).** `.nvmrc` pins **Node 22**, and `.npmrc`
was added alongside it. [D24](./decisions-d17-d32.md#d24)'s premise is now largely true and carries a
note pointing here.

One residue, and it belongs to Slice 8, not Slice 1: its workflow reads `.nvmrc` rather than
restating the version. The other — `package.json` carrying no `packageManager` or `engines`
field — was closed by [D46](./decisions-d42-d47.md#d46), which pinned pnpm 10.33.0 and Node 22.
