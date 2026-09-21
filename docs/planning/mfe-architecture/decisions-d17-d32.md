# Decisions D17–D32 — The plan's own decisions, and the host change

D17 through D29 are the choices this plan made for itself. D30 through D32 are the host
move from Cloudflare Workers to AWS, kept together because D30's finding is what prompted
D31, and D32 is what the move deliberately did *not* change.

Part of the decisions log. The index, and the rule that decisions are never
renumbered and never deleted, are in [decisions.md](./decisions.md).

| # | Decision |
|---|---|
| [D17](#d17) | Flow: frontend-only |
| [D18](#d18) | pnpm + Nx |
| [D19](#d19) | `@module-federation/vite` |
| [D20](#d20) | Vitest in Slice 1; Playwright at Slice 9 |
| [D21](#d21) | Package scope is `@portfolio/*` |
| [D22](#d22) | Fixtures feed the MVP |
| [D23](#d23) | Delivery is GitHub Actions, one workflow, driven by `nx affected` |
| [D24](#d24) | No Docker |
| [D25](#d25) | `libs/ui/primitives` is shadcn output; `libs/ui/components` is hand-written |
| [D26](#d26) | One Tailwind preset and theme, in `libs/ui/theme` |
| [D27](#d27) | `apps/*` are skeletons; the logic lives in `libs/features/*` |
| [D28](#d28) | The architecture doc's boundary path is corrected to `libs/features/shell/src/mfe-error-boundary/` |
| [D29](#d29) | Reused non-UI code lives in `libs/shared/*`, one package per concern |
| [D30](#d30) | Module Federation cannot run server-side on the Workers runtime |
| [D31](#d31) | The host is AWS: S3 + CloudFront for the remotes, Lambda for the TanStack Start SSR server |
| [D32](#d32) | Federated SSR remains declined |

---

<a id="d17"></a>**D17 — Flow: frontend-only.** The MVP is the shell plus four remotes on
fixture data. Contentful gets its own plan directory later. Maintainer's call. No override
of [plan-visible-first.md](../../../.claude/rules/plan-visible-first.md) is needed, because
Slice 1 is already a screen.

<a id="d18"></a>**D18 — pnpm + Nx.** Chosen over plain pnpm workspaces and over Turborepo.
The `.claude/rules` set already assumes `pnpm nx`, and `nx affected` is what Slice 8's
deploy precision rests on.

<a id="d19"></a>**D19 — `@module-federation/vite`.** MF 2.0: runtime remote resolution,
runtime plugins, shared-dependency version negotiation. Chosen over
`@originjs/vite-plugin-federation`, which is build-time only and would bake remote URLs
into the shell's bundle — incompatible with [D12](./decisions-d01-d16.md#d12) and with per-environment URLs.

<a id="d20"></a>**D20 — Vitest in Slice 1; Playwright at Slice 9.** Every slice ships its
own specs from the first one onward
([no-deferred-specs.md](../../../.claude/rules/no-deferred-specs.md)). E2E arrives once
there is a composition to test, which is the only thing that can verify failure isolation.

<a id="d21"></a>**D21 — Package scope is `@portfolio/*`.** `@portfolio/ui-components`,
`@portfolio/feature-header`, `@portfolio/shared-types`, and so on.

<a id="d22"></a>**D22 — Fixtures feed the MVP.** `libs/shared/fixtures` is the only content
source in this plan. Every slice rendering fixture data says so in its completion report,
per [plan-flow-order.md](../../../.claude/rules/plan-flow-order.md)'s stub-labelling clause.

<a id="d23"></a>**D23 — Delivery is GitHub Actions, one workflow, driven by `nx affected`.**
Chosen over five path-filtered per-app workflows, which get the `libs/ui/*` fan-out case
wrong: a design-system change must redeploy every consumer, and a path filter on
`apps/header/**` never fires for it.

<a id="d24"></a>**D24 — No Docker.** Considered and declined, with the reasoning recorded
so it is not re-proposed: the Actions runner already pins Node and pnpm, so a build image
buys reproducibility this project has no evidence of needing, and a local dev container
adds a layer between the maintainer and five Vite dev servers that already start with one
command.

⚠️ **Premise check, 2026-09-20 — see [Q16](./questions-closed-q9-q16.md#q16).** "The Actions
runner already pins Node and pnpm" described a state this repo did **not** have when D24 was
taken: no `.nvmrc`, no `engines`, no `packageManager`, and no workflow.

✅ **Resolved: three of the four now exist.** [D45](./decisions-d42-d47.md#d45) added `.nvmrc`
(Node 22) and [D46](./decisions-d42-d47.md#d46) pinned `packageManager` to pnpm 10.33.0 and
`engines` to Node 22 — all three are on disk and were verified there on 2026-09-20. The
workflow itself is still [Slice 8](./slices/08-independent-deployment.md)'s, and it reads
`.nvmrc` rather than restating the version. So the premise is now true of the repo and
pending only on the workflow that consumes it; the decision no longer rests on anything
untrue.

⚠️ **Reasoning revised 2026-09-20 under [D31](#d31).** The original entry also argued "the
runtime is serverless, so no container runs in production", which was true of Workers and
is **not** true of Lambda — Lambda supports container images up to 10 GB. That argument is
withdrawn. The decision stands on the two remaining reasons, and zip packaging is the
default for a Node SSR function. If a Lambda container image later turns out to be the
easier packaging path for the shell, that is a deployment-mechanics choice for
[Slice 8](./slices/08-independent-deployment.md), not a reversal of this decision.

<a id="d25"></a>**D25 — `libs/ui/primitives` is shadcn output; `libs/ui/components` is
hand-written.** The shadcn CLI is aliased to write only into `primitives`, and a primitive
is **never hand-edited** — behavior changes go into a wrapper in `components`. This keeps
`shadcn add` re-runnable and makes generated code identifiable by path.

<a id="d26"></a>**D26 — One Tailwind preset and theme, in `libs/ui/theme`.** Every app
extends it rather than declaring its own colors, so the four remotes cannot drift apart
visually.

⚠️ **Superseded in form by [D51](./decisions-d48-d52.md#d51), 2026-09-20.** "Preset" was a
Tailwind 3 word: this entry was written assuming a `tailwind.config.ts` object each app
spreads. Tailwind 4 configures in CSS, so the artifact is a **stylesheet** with an `@theme`
block that each app `@import`s, and the content globs are `@source` declarations. **The rule
is unchanged** — one theme, one place, every app consumes it rather than declaring its own
colors. Only the file type moved.

<a id="d27"></a>**D27 — `apps/*` are skeletons; the logic lives in `libs/features/*`.**
An app carries config, an entry point, routes, and a mount. Nothing else. See
[model.md §2](./model.md#2-workspace-shape) for the two consequences that make this worth
enforcing.

<a id="d28"></a>**D28 — The architecture doc's boundary path is corrected to
`libs/features/shell/src/mfe-error-boundary/`.** It was written as
`apps/shell/components/mfe-error-boundary/` before [D27](#d27) existed. The doc's actual
requirement is that the boundary and its fallbacks are **shell-owned and never federated**,
which is a statement about ownership, not about which directory they sit in, and it holds
unchanged from a feature lib.

✅ **Already applied.** The doc was corrected when it was committed (`031b8fc`), not deferred
to Slice 4 — it carries both the `libs/features/shell/src/mfe-error-boundary/` tree and the
ownership-not-directory sentence today. Slice 4 **verifies** the path and does not rewrite
it.

<a id="d29"></a>**D29 — Reused non-UI code lives in `libs/shared/*`, one package per
concern.** Types, config, fixtures, utils — never one grab-bag lib. Extracted at the
**second** consumer, not in anticipation of one, matching
[file-size.md](../../../.claude/rules/file-size.md). Until then it stays in the feature lib
that uses it.

<a id="d30"></a>**D30 — Module Federation cannot run server-side on the Workers runtime.**
Established by a Cloudflare support answer, 2026-09-20, in response to
[Q2](./open-questions.md#q2). Two hard constraints in `workerd`:

1. **No `eval` / `new Function`.** Module Federation's runtime fetches a remote entry and
   evaluates it from a string, which `workerd` disallows.
2. **No dynamic `import()` of a remote URL.** `workerd` resolves `import()` only for
   modules statically known at build time, so `import('https://…/remoteEntry.js')` cannot
   work.

Client-side federation in the browser is unaffected and works normally, because the browser
supports dynamic `import()` of a remote URL — which is the half this architecture actually
uses.

Two honest caveats on this finding. It is a support answer, not documentation: Cloudflare's
own response stated that no docs or release notes cover `@module-federation/vite` on
Workers, and that the plugin combination is untested and unsupported. And it did **not**
block this architecture — [D8](./decisions-d01-d16.md#d8) and [D9](./decisions-d01-d16.md#d9) had already declined federated SSR, so
the constraint removed an option that was never being exercised.

<a id="d31"></a>**D31 — The host is AWS: S3 + CloudFront for the remotes, Lambda for the
TanStack Start SSR server.** Supersedes [D5](./decisions-d01-d16.md#d5). Maintainer's call, 2026-09-20, taken
after [D30](#d30).

- **Remotes** build to static assets and are served from S3 behind CloudFront. This also
  closes [Q5](./questions-closed.md#q5), which asked where the remote bundles live.
- **The shell's SSR server** runs as a Lambda function behind CloudFront.
- **Secrets** move from Cloudflare environment values to AWS — Lambda environment
  variables for non-sensitive configuration, SSM Parameter Store or Secrets Manager for
  anything sensitive. [D10](./decisions-d01-d16.md#d10) and [D11](./decisions-d01-d16.md#d11) are unchanged in substance: secrets live
  in the deployment environment, never in the public repo.

⚠️ **Recorded plainly so it is not rediscovered later: this move does not unblock anything
in the current architecture.** [D30](#d30) only blocked federated SSR, which
[D9](./decisions-d01-d16.md#d9) had already declined. What the move buys is the *option* of federated SSR — see
[Q9](./questions-closed-q9-q16.md#q9) — and it carries real costs: Lambda cold starts where Workers
had effectively none, and a materially larger infrastructure surface (S3 buckets, a
CloudFront distribution, cache invalidation, IAM, a Lambda adapter) in place of one
`wrangler deploy`. Those costs are accepted, not overlooked.

<a id="d32"></a>**D32 — Federated SSR remains declined.** [D9](./decisions-d01-d16.md#d9) required an explicit
request to introduce it, and the host change is not that request. Lambda runs Node, so
`@module-federation/node` now makes server-side federation *technically possible* — but
until it is explicitly adopted, the shell SSRs its own chrome and the remotes render on the
client. The consequence is recorded in [model.md §4](./model.md#4-ssr-model) and was settled by
[Q9](./questions-closed-q9-q16.md#q9)'s closure as [D36](./decisions-d33-d41.md#d36) rather than by
inference.

## The open questions closed (2026-09-20)

Eight questions answered by the maintainer in one sitting. [D33](./decisions-d33-d41.md#d33) is the umbrella —
it is the tiebreaker the others were decided against, so it is recorded first even though
it answers no numbered question.
