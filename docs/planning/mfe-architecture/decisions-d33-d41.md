# Decisions D33–D41 — The first round of questions closed

Q1 through Q10 answered, on 2026-09-20. [D33](#d33) is the umbrella — it answers no
numbered question and is the tiebreaker the rest were decided against, so read it first.

Part of the decisions log. The index, and the rule that decisions are never
renumbered and never deleted, are in [decisions.md](./decisions.md).

| # | Decision |
|---|---|
| [D33](#d33) | The purpose of this rebuild is to showcase the MFE architecture |
| [D34](#d34) | The live v3 site is the visual reference |
| [D35](#d35) | The site is served from AWS; the repo name constrains nothing |
| [D36](#d36) | All four surfaces stay federated and client-rendered |
| [D37](#d37) | AWS CDK describes the infrastructure |
| [D38](#d38) | Storybook is declined; Playwright carries the load |
| [D39](#d39) | React is a shared singleton, not a strict-version one |
| [D40](#d40) | shadcn primitives are pulled on demand, never speculatively |
| [D41](#d41) | The fixtures carry real portfolio copy, and the MVP is publishable |

---

<a id="d33"></a>**D33 — The purpose of this rebuild is to showcase the MFE architecture.**
The architecture is the portfolio piece; the site is the vehicle. Maintainer's call.

This is the tiebreaker for every future scope question in this plan, so it is worth being
explicit about what it settles rather than leaving it as tone:

- **[R8](./risks.md#r8) is resolved, not mitigated.** Five deployables is five things to
  monitor and roll back, and that cost is the deliverable rather than overhead to
  apologise for. The risk entry's closing warning — *"if the site is ever served
  predominantly from one remote, the architecture is doing more work than the problem
  requires"* — is **withdrawn**. Doing more work than the problem requires is the point.
- **Federation is not traded away for a simpler page.** See [D36](#d36).
- Where a later choice is between demonstrating the architecture and shaving complexity,
  it goes to the architecture, and the reason is this decision.

<a id="d34"></a>**D34 — The live v3 site is the visual reference.** Closes
[Q1](./questions-closed.md#q1). Nothing is invented from nothing: the existing site's design
is the spec for the Header, Footer, Homepage, Portfolio Item, and the shell layout.

Two boundaries on that, because "use the current site" is ambiguous in a repo where the
current site was just deleted from this branch:

1. **The design carries over; the implementation does not.** The v3 site is Next.js and
   lives on `master` / `version-3`. [D6](./decisions-d01-d16.md#d6) is unchanged — nothing in this plan reaches
   for Next.js, and no v3 component is ported. What is reused is what the site *looks
   like*.
2. **The fallback states have no v3 equivalent** and are still invented, because a site
   with no remotes has no remote-failure UI. Slice 4's completion report still flags each
   fallback's visual treatment, one line each. That is the residue of Q1, and it is the
   only part that survives.

<a id="d35"></a>**D35 — The site is served from AWS; the repo name constrains nothing.**
Closes [Q3](./questions-closed.md#q3). The repository is named `anselmmarie.github.io`, but a
repository name is not a deployment target — GitHub Pages is simply not used, and the site
is served from CloudFront at a domain chosen in [Slice 8](./slices/08-independent-deployment.md).

The question conflated a repo name with a hosting decision. [D31](./decisions-d17-d32.md#d31) had already made
the hosting decision, and naming the domain is deployment mechanics inside Slice 8, not an
architectural question. The old Pages site remains on `master` until the new one is ready;
nothing in this plan depends on when it is switched off.

<a id="d36"></a>**D36 — All four surfaces stay federated and client-rendered.** Closes
[Q9](./questions-closed.md#q9), choosing its option 1. [D8](./decisions-d01-d16.md#d8), [D9](./decisions-d01-d16.md#d9) and [D32](./decisions-d17-d32.md#d32)
all hold unchanged, and federated SSR stays declined.

⚠️ **The SEO consequence is now an accepted cost, not an open question.**
[model.md §4](./model.md#4-ssr-model) describes it and that description stands: the Lambda
renders the shell's chrome and four empty slots, every word of content appears only after
hydration, crawlers that do not execute JavaScript see an empty page, and link previews get
nothing. Under [D33](#d33) that is the right trade — de-federating the two content surfaces
would have bought indexability by removing half the architecture being demonstrated.

Do not reopen this as a bug report. If it is ever reopened it is as a deliberate reversal,
against [D33](#d33), with a new numbered decision.

⚠️ **One half of the cost may be recoverable without touching this decision.**
[Q14](./open-questions.md#q14) asks whether the shell should server-render *metadata* —
`<title>`, description, Open Graph — from the same fixtures, per route, while the visible
content still arrives via federation exactly as decided here. That would fix link previews
without federating anything. It is a question about D36's blast radius, not a challenge to
D36.

<a id="d37"></a>**D37 — AWS CDK describes the infrastructure.** Closes
[Q10](./questions-closed.md#q10). CDK in TypeScript, as its own registered Nx project in the
monorepo, covering the S3 buckets, the CloudFront distribution and its cache behaviors, the
Lambda function and its invocation path, and the IAM roles.

Chosen over SST, which would have owned the deploy story and displaced
[D23](./decisions-d17-d32.md#d23)'s single `nx affected` workflow, and over Terraform, which puts the
infrastructure in a second language and a separate state store outside the Nx graph.

**[D23](./decisions-d17-d32.md#d23) is unchanged**: GitHub Actions still drives deployment, and CDK is what it
invokes. CDK describes; Actions decides what to deploy.

The consequence for [Slice 1](./slices/01-workspace-and-shell.md): `apps/shell` is
scaffolded against a CDK-deployed Lambda from the first commit, so the adapter and the
build output are settled before any remote exists.

<a id="d38"></a>**D38 — Storybook is declined; Playwright carries the load.** Closes
[Q8](./questions-closed.md#q8). `libs/ui/components` does **not** require a story per module,
and cosmikata's `component-needs-story.md` is not adopted into this repo's rules.

The gap this leaves is real and named so it is not forgotten: until Slice 9,
**nothing renders a component against a real stylesheet**. That is precisely the blind spot
[R3](./risks.md#r3) lives in — Tailwind content globs tree-shaking a lib's classes, which
fails silently by rendering unstyled rather than erroring.

So the decline comes with an obligation attached, and it belongs to
[Slice 9](./slices/09-e2e-composition.md): its Playwright specs assert a **computed style**
on at least one shared-design-system component per remote, not merely that the element is
present. An assertion that a component rendered is not an assertion that it was painted.

<a id="d39"></a>**D39 — React is a shared singleton, not a strict-version one.** Closes
[Q4](./questions-closed.md#q4). `react` and `react-dom` are shared with
`singleton: true, strictVersion: false`, the version is pinned once at the workspace root,
and **CI asserts every app resolves the same React major**.

This deliberately differs from what [model.md §6](./model.md#6-module-federation-strategy)
leaned toward. Strict versioning and this arrangement protect against the same thing —
[R2](./risks.md#r2), two React copies in one page — but they fail in different places.
`strictVersion: true` turns a mismatch into a remote that refuses to load in a visitor's
browser. The root pin plus the CI check turns the same mismatch into a red build, before
anything ships. The protection is equivalent; the failure moves from production to CI,
which is where it belongs.

⚠️ **The CI check is the load-bearing half, and it is what makes this safe rather than
merely lenient.** Without it, `strictVersion: false` is just a disabled guard. It is Slice
8's to implement alongside the workflow, and [Slice 3](./slices/03-federation-header.md)
records the requirement when it writes the shared-dependency config.

<a id="d40"></a>**D40 — shadcn primitives are pulled on demand, never speculatively.**
Closes [Q7](./questions-closed.md#q7). Slice 2 adds only the primitives its actual consumers
need. `shadcn add` stays re-runnable ([D25](./decisions-d17-d32.md#d25)), so under-picking costs a single command
later while over-picking leaves `libs/ui/primitives` carrying components nothing imports.

A `libs/ui/components` wrapper is written only when project-specific behavior or defaults
attach to a primitive. Direct consumption is the default, and a wrapper that only re-exports
is a prop-drilling wrapper by another name.

<a id="d41"></a>**D41 — The fixtures carry real portfolio copy, and the MVP is publishable.**
Closes [Q6](./questions-closed.md#q6), the last open question in the plan. Maintainer's call,
2026-09-20.

`libs/shared/fixtures` is not placeholder data. It holds the site's **actual** portfolio
content — titles, summaries, case-study copy, image paths — ported from the live v3 site,
which [D34](#d34) already makes the reference for how those surfaces look. Slice 6 is
reading those pages regardless.

Three consequences:

- **The MVP can go live off [Slice 9](./slices/09-e2e-composition.md)** without waiting for
  Contentful. Nothing in this plan blocks a launch.
- **The Contentful plan's purpose narrows** to *editing convenience* — moving the copy from
  a commit to a CMS — rather than supplying content the site does not otherwise have. That
  is a smaller and more honest scope than "make the site have content".
- **The fixture copy deserves real care**, because it is the published site, not test data.
  It is reviewed as content in Slice 6, not skimmed as a stub.

⚠️ **[D22](./decisions-d17-d32.md#d22)'s stub-labelling clause still applies, and means something narrower now.**
Each slice still states in its completion report that its content comes from fixtures — but
that is a statement about the *source*, not a warning that the content is fake. Do not let
"fixtures" be read as "placeholder" in a report once this decision is in force.
