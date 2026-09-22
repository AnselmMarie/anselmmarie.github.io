# Questions Closed — Q9 through Q17

The second half of [questions-closed.md](./questions-closed.md), split out on 2026-09-20
when closing [Q14](#q14) pushed that file to 522 lines, over the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md). Nothing was
reworded in the cut.

⚠️ **The split point is Q9, chosen so the Q1–Q8 links already written across the plan keep
resolving.** The index table stays in the first file and covers both halves.

⚠️ **The filename records the split point, not the range.** [Q17](#q17) closed on
2026-09-21 and was appended here; the file is not renamed, because every link already
written to `questions-closed-q9-q16.md` would break for the sake of a name.

**This is history, not a to-do list.** The decision each question produced is the binding
record — see [decisions.md](./decisions.md).

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

---

<a id="q14"></a>
## Q14 — Should the shell server-render metadata even though it does not server-render content?

**Raised:** 2026-09-20 · **Blocks:** Slices 1, 6, 7

[D36](./decisions-d33-d41.md#d36) accepted, in full, that "link previews get nothing from the
content surfaces". That is true of the *rendered content*. It is **not** necessarily true of
the metadata, and the difference is cheap.

The shell runs on Lambda, owns the route, and imports `libs/shared/fixtures` at build time —
the same fixtures the Homepage and Portfolio Item render from. So it can emit a real
`<title>`, description, and Open Graph tags **server-side, per route**, while the visible
content still arrives via federation exactly as D36 decided. A link to
`/portfolio/pokemon-pet-shop` would then preview correctly even though its body is
client-rendered.

This does not reopen [D36](./decisions-d33-d41.md#d36) and does not federate anything. It recovers
the link-preview half of the cost D36 accepted, at the price of the shell reading the
fixtures — which it may already do for the not-found case in
[Slice 7](./slices/07-portfolio-item-mfe.md).

Also unanswered alongside it: `robots.txt`, a sitemap, and whether either is wanted at all.

**Closed 2026-09-20 → [D48](./decisions-d48-d52.md#d48).** Yes — the shell emits `<title>`,
description and Open Graph per route, server-side, from `libs/shared/fixtures`.
[D36](./decisions-d33-d41.md#d36) is untouched: the four surfaces stay federated and
client-rendered, and the metadata travels on a different path from the content. Every route
file in `apps/shell` therefore gains a metadata source, which is why this had to close
before [Slice 1](./slices/01-workspace-and-shell.md) wrote the route tree.

⚠️ **The `robots.txt` and sitemap half was NOT answered**, only the metadata half. D48 says
so explicitly. They are a separate surface at a separate cost and nothing blocks on them; if
they are wanted they come back as a new question, not as residue of this one.

---

<a id="q17"></a>
## Q17 — How does the HTML in a portfolio `description` render? ✅ closed → [D69](./decisions-d69.md#d69)

**Raised:** 2026-09-21 · **Blocked:** Slice 7 (and, as raised, Slice 6) · **From:**
[D53](./decisions-d53.md#d53)

Every ported item's `description` is an **HTML string**, not plain text:

```html
<p>As a personal challenge, I designed and built …
   <a href="https://github.com/…" target="_blank">Github mfe branch</a>.</p>
<p>The tech stack includes:</p>
<ul><li>React</li><li>React Native/Expo</li>…</ul>
```

Paragraphs, lists, and external links with `target="_blank"`. The v3 site rendered these
with `dangerouslySetInnerHTML`. Three ways forward:

1. **Keep the HTML, render it with `dangerouslySetInnerHTML`.** Cheapest, and it is the
   maintainer's own content in the maintainer's own repo, so the injection risk today is
   nil. ⚠️ But the Contentful plan makes this field **editor-supplied**, and at that point
   the same component is rendering third-party HTML — so the decision outlives the fixture.
2. **Keep the HTML and sanitize it** on the way in. Costs a dependency and a little size in
   a federated remote; survives the Contentful transition unchanged.
3. **Convert to structured data now** — `paragraphs: string[]`, `bullets: string[]`,
   `links: {href, label}[]` — and render it as components. Most work up front, no HTML in
   the payload at all, and the cleanest thing to map Contentful's rich text onto later.

⚠️ Note `target="_blank"` without `rel="noopener noreferrer"` appears throughout the ported
copy. Whichever option is taken, that gets fixed in the port rather than carried over.

**Not urgent for Slice 1**, which ships only route metadata. It blocks the first slice that
renders an item body.

### Closure note — 2026-09-21

**Option 2.** Maintainer's call. The field stays an HTML string and is sanitized with
`dompurify` at the render boundary; the coordinator installs the dependency before the wave
so three worktrees do not race `pnpm-lock.yaml`. The full reasoning, including what options
1 and 3 were declined on, is [D69](./decisions-d69.md#d69).

⚠️ **This question blocked Slice 7, not Slice 6 — corrected here on closing.** The entry
above and both slice files said "Slices 6 and 7". Checked against the source: at `39bbe56`,
`dangerouslySetInnerHTML` appears in exactly one file,
`src/routes/portfolio/ui/portfolio-data-container/portfolio-left-content.view.tsx` — the
item page. The homepage listing renders thumbnail and title and never touches
`description`. Slice 6 was never blocked by this, and under the
[D67](./decisions-d63-d67.md#d67) per-file split it could not have been: `description` lands
on `PortfolioItem`, which is Slice 7's module. The over-statement cost nothing because the
question closed before the wave started, but it would have held a slice for no reason.
