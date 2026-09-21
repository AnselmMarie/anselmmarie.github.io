# The Architecture

The finalized design. Slices implement this; they do not renegotiate it. Where a slice
needs to diverge, that is a decision in [decisions.md](./decisions.md), not a quiet edit
here.

## 1. Stack

| Layer | Choice | Why it is here |
|---|---|---|
| Shell / SSR / server | TanStack Start | Routing, SSR of the initial response, server functions. Not Next.js ([D6](./decisions-d01-d16.md#d6)). |
| Server runtime | **AWS Lambda**, behind CloudFront | Where the shell executes, and later where Contentful calls originate. Replaced Cloudflare Workers on 2026-09-20 ([D31](./decisions-d17-d32.md#d31), superseding [D5](./decisions-d01-d16.md#d5)). |
| Remote hosting | **S3 behind CloudFront** | Each remote's static bundle and `remoteEntry.js`. |
| Remotes | React + Vite | Each MFE is a standalone app, built and deployed on its own. |
| Composition | Module Federation via `@module-federation/vite` | MF 2.0 runtime: remote URLs resolved at runtime, shared-dependency negotiation, runtime plugins for retry. |
| UI | shadcn/ui + Tailwind | One preset, one theme, shared by the shell and every remote. |
| Content | Contentful, server-side only | **Post-MVP.** Fixtures until then. |
| Tests | Vitest + Testing Library, Playwright at Slice 9 | Unit/component per slice; composition E2E once remotes exist. |
| Delivery | GitHub Actions + `nx affected` + AWS | One workflow, deploys only what changed. No Docker ([D24](./decisions-d17-d32.md#d24)). Infrastructure described in **AWS CDK** ([D37](./decisions-d33-d41.md#d37)). |

## 2. Workspace shape

```text
apps/shell              skeleton: routing, SSR entry, Lambda handler, remote wiring
apps/header             skeleton: Vite + MF remote, exposes libs/features/header
apps/footer             skeleton
apps/homepage           skeleton
apps/portfolio-item     skeleton

libs/features/shell             layout, MfeErrorBoundary, the four fallbacks
libs/features/header            the Header itself
libs/features/footer
libs/features/homepage
libs/features/portfolio-item

libs/ui/primitives      shadcn/ui output — the CLI writes here, nowhere else
libs/ui/components      hand-written components, composed from primitives
libs/ui/theme           the theme stylesheet everything imports (@theme + @source)

libs/shared/types       content shapes, remote contracts
libs/shared/config      the remote registry + environment-specific remote URLs
libs/shared/fixtures    the site's real portfolio copy, ported from commit 39bbe56
                        (D41, D53) — moved to Contentful by a later plan, not
                        deleted as placeholder
libs/shared/utils       cross-cutting helpers

infra                   the AWS CDK app and stack, its own Nx project (D37)
```

Package scope is `@portfolio/*` ([D21](./decisions-d17-d32.md#d21)): `@portfolio/feature-header`,
`@portfolio/ui-components`, `@portfolio/shared-types`, and so on.

### Three boundaries, each with a reviewer's test

**An app holds no flesh** ([D27](./decisions-d17-d32.md#d27)). Config, an entry point, a route, and
a mount — that is the entire permitted surface of `apps/*`. A presentational component or a
piece of business logic under `apps/` is the smell, and it belongs in that app's feature
lib. The app is the *deployable unit*; the lib is the *code*.

Two things fall out of this, and both are the reason it is worth enforcing:

- Nx's graph sees a change to `libs/features/header` and marks exactly one app affected,
  which is what makes the `nx affected` deploy in Slice 8 precise rather than approximate.
- A feature lib is importable by the shell directly. If Module Federation has to be backed
  out for any reason, the same code composes as a plain monorepo import with no rewrite.

**`libs/ui/primitives` is vendored; `libs/ui/components` is ours**
([D25](./decisions-d17-d32.md#d25)). A shadcn component is re-runnable CLI output, so it is never
hand-edited. When a primitive must behave differently it gets a wrapper in
`libs/ui/components`. That keeps `shadcn add` safe to re-run forever, and it means a
reviewer can tell generated code from authored code by its path alone.

**Reused and not UI means `libs/shared/*`** ([D29](./decisions-d17-d32.md#d29)). One package per
concern — types, config, fixtures, utils — never a single grab-bag lib. The extraction
threshold is the one [file-size.md](../../../.claude/rules/file-size.md) already states:
extract at the **second** consumer, not in anticipation of one. Until then the code stays
in the feature lib using it.

### Shared at build time versus deployed independently

| Kind | Where | How it travels |
|---|---|---|
| Types, fixtures, utils, config | `libs/shared/*` | **Build time.** Compiled into whichever app imports them. A change means rebuilding every consumer. |
| Design system | `libs/ui/*` | **Build time**, but declared a Module Federation *shared* dependency so the browser loads one copy at runtime. |
| Feature code | `libs/features/*` | **Build time** into its own app, then **deployed independently** as that app's remote bundle. |
| React, React DOM | root | **Runtime shared singleton.** Exactly one copy, negotiated by MF. |

The consequence worth stating plainly: a `libs/ui/*` or `libs/shared/*` change is **not**
an independent deploy. It fans out to every consumer, and Slice 8's `nx affected` handles
that correctly where a path-filtered workflow would not. Only `libs/features/*` and
`apps/*` changes deploy in isolation.

## 3. Data flow

For content, once Contentful lands (post-MVP):

```text
Browser → CloudFront → TanStack Start shell on Lambda → Contentful
                 │
                 └── data serialized into the SSR payload / server-function response
                             │
                             └── passed into the MFE as props
```

For federated UI, in the MVP:

```text
Browser → TanStack Start shell (SSR html)
             │
             └── Module Federation runtime
                     ├── Header MFE
                     ├── Homepage MFE
                     ├── Portfolio Item MFE
                     └── Footer MFE   → hydrate on the client
```

The rule that makes the credential story work: **an MFE never calls Contentful and never
holds a credential.** The shell fetches server-side and hands the MFE plain data. An MFE
that needs more data gets a shell-owned server function to call, never a Contentful client.

In this plan the same seam exists with fixtures behind it, so the Contentful plan swaps the
source and nothing above the seam changes.

## 4. SSR model

The shell SSRs. The remotes do not ([D8](./decisions-d01-d16.md#d8), [D9](./decisions-d01-d16.md#d9),
[D32](./decisions-d17-d32.md#d32)).

```text
1. TanStack Start renders the initial page in Lambda.
2. Lambda performs any server-side data calls.
3. The browser receives HTML and loads the federated remotes from CloudFront.
4. The remotes render and hydrate on the client.
5. Module Federation resolves each independently deployed remote.
```

### ⚠️ What this costs: the MFE content is not in the server-rendered HTML

Stated plainly because it is easy to read "the shell SSRs" as "the page server-renders",
and it does not. Step 1 renders the shell's chrome and **four empty slots**. Every word of
the header, homepage, portfolio item, and footer appears only after step 4.

Three consequences that matter for a portfolio site:

- **Crawlers that do not execute JavaScript see an empty page.** Google does execute it;
  most other crawlers and link-preview bots do not.
- **Social cards and link previews get nothing** from the content surfaces.
- **First paint is chrome, then content pops in**, rather than content arriving in the
  first response.

This is a property of client-side-only federation, not of the host — it was equally true on
Cloudflare Workers.

⚠️ **This is an accepted cost, not an open question.** [Q9](./questions-closed-q9-q16.md#q9) asked
whether to trade it away and closed on 2026-09-20 as [D36](./decisions-d33-d41.md#d36): all four
surfaces stay federated and client-rendered. The cheap alternative — de-federating the two
content surfaces so they server-render as ordinary shell imports — was considered and
declined, because under [D33](./decisions-d33-d41.md#d33) it buys indexability by removing half the
architecture being demonstrated. Reopening it is a deliberate reversal with a new numbered
decision, not a defect report.

### Why federated SSR is still declined

It was **impossible** on Cloudflare Workers ([D30](./decisions-d17-d32.md#d30)): `workerd` allows
neither `eval` / `new Function` nor dynamic `import()` of a remote URL, and Module
Federation's server runtime needs both. On Lambda it is merely **hard** — Node can fetch a
remote entry and evaluate it, so `@module-federation/node` works.

So the reason has changed from "the platform forbids it" to "we have not chosen it", and
[D32](./decisions-d17-d32.md#d32) keeps it declined until explicitly requested. It remains the
single largest complexity multiplier available here, and it would couple every remote's
availability to the shell's time-to-first-byte: a slow remote would become a slow page
rather than a late-filling slot. The current model degrades instead — a dead remote costs
one fallback, not the page.

## 5. What reaches the browser, and what does not

**Public, in the client bundle, in the public GitHub repo:**

- Remote entry URLs, the remote registry, app code, the design system, fixture content.
- Anything in `libs/ui/*`, `libs/features/*`, `libs/shared/*`.

**Server-side only, never in the repo, never in a client bundle** (post-MVP):

- `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`, and the
  Contentful API URL.
- Held in AWS ([D10](./decisions-d01-d16.md#d10), [D31](./decisions-d17-d32.md#d31)): Lambda environment
  variables for non-sensitive configuration, SSM Parameter Store or Secrets Manager for
  anything sensitive. The repo carries only a `.env.example` with placeholder values
  ([D11](./decisions-d01-d16.md#d11)).

⚠️ A Lambda environment variable is **not** a secret store. Its value is readable by anyone
with `lambda:GetFunctionConfiguration` and it appears in the console, so a real token
belongs in Parameter Store or Secrets Manager with the function reading it at runtime. This
is a genuine difference from Workers, where a `wrangler secret` is write-only after being
set, and it is the kind of thing that gets assumed equivalent during a host migration.

Two failure modes to design against rather than remember:

- **A `VITE_`-prefixed variable is public by construction.** Vite inlines it into the
  client bundle. A Contentful token must never be named `VITE_*`, and no remote may read
  `import.meta.env` for anything content-related.
- **A secret read in a shell component rather than a server function still ships.** The
  boundary is the server function, not the directory it sits in.

## 6. Module Federation strategy

**Runtime remote resolution.** Remote URLs come from `libs/shared/config` at runtime, not
baked into the shell's build. This is what makes the shell deployable once and repointable
per environment, and it is why `@module-federation/vite` was chosen over the older
build-time plugin ([D19](./decisions-d17-d32.md#d19)).

**Shared dependencies.** `react` and `react-dom` are shared singletons — two React copies
in one page breaks hooks and context in ways that surface as unrelated-looking bugs.
`@portfolio/ui-*` is shared so the design system loads once.

The strictness is settled: **`singleton: true`, `strictVersion: false`**, the version pinned
once at the workspace root, and **CI asserting every app resolves the same React major**
([D39](./decisions-d33-d41.md#d39), closing [Q4](./questions-closed.md#q4)). ⚠️ The CI check is the
load-bearing half — without it, `strictVersion: false` is a disabled guard. It moves the
mismatch from a remote that refuses to load in a visitor's browser to a red build, which is
where it belongs.

**Version compatibility.** Every app pins the same React major through the workspace root.
A remote built against a different major is a deploy-time mistake, and Slice 8 records how
that is caught.

**Environment-specific URLs.** Local development points every remote at a localhost port;
production points at the deployed CloudFront remote URLs, supplied as Lambda env vars. The shell
reads one registry either way.

**No router is shared** ([D43](./decisions-d42-d47.md#d43)). The Header's links are in-page anchor
jumps, not route changes, so the shared set is `react`, `react-dom` and `@portfolio/ui-*` and
nothing else. The fixed-header scroll offset is a `libs/ui/theme` token read at build time by
both remotes, not a value passed across the boundary.

**Assets** ([D42](./decisions-d42-d47.md#d42)). Content images travel in the props payload from the
shell, so a remote never composes a content URL. Component-owned UI assets ship with their
remote, and each remote's Vite `base` points at its deployed CloudFront URL — ⚠️ a relative
asset URL in a remote otherwise resolves against the *page's* origin, which is identical on
localhost and wrong in production.

**Avoiding coupling.** The shell knows a remote's name, its URL, and the shape of what it
exposes. It does not know the remote's internals, its routes, or its dependencies. A remote
knows nothing of the shell beyond the props it receives.

## 7. shadcn/ui and Tailwind sharing strategy

One theme, one CSS build path. ⚠️ Under [D51](./decisions-d48-d52.md#d51) this is Tailwind 4,
configured **in CSS** — there is no `tailwind.config.ts` anywhere in the workspace.

- **`libs/ui/theme`** owns the theme stylesheet: an `@theme` block holding the CSS
  variables. The shell and every remote `@import` it rather than declaring their own colors,
  so classes generate from one source and no remote can drift its palette.
- **`@source` declarations** must cover every `libs/ui/*` and `libs/features/*` path a build
  consumes, or classes used only inside a lib get tree-shaken out of the CSS. This is the
  most common way a federated Tailwind setup breaks, it fails silently — the component
  renders unstyled rather than erroring — and **it already happened here once**, in Slice 1
  ([R3](./risks.md#r3)). Tailwind auto-detects from the build root and skips `node_modules`,
  which is where every workspace lib is symlinked, so a lib is invisible until something
  names it.
- **CSS loading.** The theme's variables are injected once by the shell. Remotes ship
  component CSS but not a second copy of the theme, so a remote cannot repaint the page.
- **Component ownership.** `libs/ui/primitives` holds shadcn output; `libs/ui/components`
  holds wrappers and anything hand-written; a feature builds from `libs/ui/components`.
  Primitives are pulled **on demand, never speculatively** ([D40](./decisions-d33-d41.md#d40)), and
  a wrapper is written only when project-specific behavior attaches to a primitive.
- **No Storybook** ([D38](./decisions-d33-d41.md#d38)). The consequence is that nothing renders a
  component against a real stylesheet until Slice 9, so Slice 9's Playwright specs assert a
  **computed style** per remote rather than mere presence. That assertion is what stands in
  for the story, and it is the only thing catching a tree-shaken Tailwind class.

The goal is that all four remotes look like one application while staying independently
deployable, and the mechanism for that is a single shared theme rather than a convention
everyone remembers to follow.

## 8. Failure behavior

Specified in full in
[docs/architecture/mfe-failure-and-fallback-behavior.md](../../architecture/mfe-failure-and-fallback-behavior.md)
and implemented in [Slice 4](./slices/04-error-boundaries.md). The short form: one error
boundary per remote, owned by the shell, with a shell-owned non-federated fallback, bounded
user-triggered retry, and rollback as an explicit deployment operation rather than an
automatic version switch.
