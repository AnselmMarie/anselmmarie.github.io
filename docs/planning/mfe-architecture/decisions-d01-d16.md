# Decisions D1–D16 — Architecture

The decisions taken in the architecture discussion that preceded this plan. They are
dated to the day the plan was written, since they predate it as a conversation but not as a
record.

Part of the decisions log. The index, and the rule that decisions are never
renumbered and never deleted, are in [decisions.md](./decisions.md).

| # | Decision |
|---|---|
| [D1](#d1) | React + Vite for the MFEs |
| [D2](#d2) | Module Federation composes the application |
| [D3](#d3) | shadcn/ui + Tailwind for the UI layer |
| [D4](#d4) | TanStack Start is the shell and the server layer |
| [D5](#d5) | Cloudflare Workers is the server runtime |
| [D6](#d6) | No Next.js |
| [D7](#d7) | Contentful is accessed server-side only |
| [D8](#d8) | The MFEs do not need SSR |
| [D9](#d9) | No federated SSR unless specifically requested |
| [D10](#d10) | Secrets live in Cloudflare, not GitHub |
| [D11](#d11) | The public repo carries only safe example configuration |
| [D12](#d12) | An MFE deploys without rebuilding the application |
| [D13](#d13) | Monorepo, `apps/*` + `libs/*` |
| [D14](#d14) | Content data flow is `Browser → shell → Worker → Contentful` |
| [D15](#d15) | An MFE never holds a Contentful credential |
| [D16](#d16) | One error boundary per remote, shell-owned, never federated |

---

<a id="d1"></a>**D1 — React + Vite for the MFEs.** Each remote is a standalone React
application built by Vite. Binds every slice from 3 onward.

<a id="d2"></a>**D2 — Module Federation composes the application.** The shell consumes the
remotes; the remotes do not know about each other.

<a id="d3"></a>**D3 — shadcn/ui + Tailwind for the UI layer.** Not a separately hosted UI
application; a component foundation consumed at build time. Binds Slice 2.

<a id="d4"></a>**D4 — TanStack Start is the shell and the server layer.** Routing, SSR,
server functions. Binds Slice 1.

<a id="d5"></a>**D5 — Cloudflare Workers is the server runtime.**
⚠️ **Superseded by [D31](./decisions-d17-d32.md#d31) on 2026-09-20.** Kept because it is the decision
[D30](./decisions-d17-d32.md#d30) was investigated against, and because the reasoning that replaced it is only
legible next to what it replaced.

<a id="d6"></a>**D6 — No Next.js.** Explicit constraint, recorded so it is not reintroduced
by a later convenience argument.

<a id="d7"></a>**D7 — Contentful is accessed server-side only.** Never from the browser,
never from a remote. Post-MVP; binds the Contentful plan, not this one.

<a id="d8"></a>**D8 — The MFEs do not need SSR.** The shell SSRs the page; the remotes load
and hydrate on the client.

<a id="d9"></a>**D9 — No federated SSR unless specifically requested.** The largest
available complexity multiplier, and deliberately declined. See
[model.md §4](./model.md#4-ssr-model) for what it would cost.

<a id="d10"></a>**D10 — Secrets live in Cloudflare, not GitHub.**
`CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT` are Worker
environment variables and secrets.

<a id="d11"></a>**D11 — The public repo carries only safe example configuration.** An
example env file with placeholders, never a real value. This repo is public, which is
the whole reason D7 and D10 exist.

⚠️ **Superseded in form by [D31](./decisions-d17-d32.md#d31), 2026-09-20.** This entry
originally named `.dev.vars.example`, a `wrangler` artifact from the Cloudflare era that
[D31](./decisions-d17-d32.md#d31) retired. The file is `.env.example` on AWS; the rule that
only placeholders ship is unchanged.

<a id="d12"></a>**D12 — An MFE deploys without rebuilding the application.** Binds Slice 8,
and is the property `nx affected` exists to make true.

<a id="d13"></a>**D13 — Monorepo, `apps/*` + `libs/*`.** Shared components, types, config,
and one dependency graph, with runtime independence preserved per app.

<a id="d14"></a>**D14 — Content data flow is `Browser → shell → Worker → Contentful`.**
Post-MVP. The seam exists in this plan with fixtures behind it.

<a id="d15"></a>**D15 — An MFE never holds a Contentful credential.** If a remote needs
data, the shell exposes it — as props, or as a shell-owned server function the remote may
call. Never a Contentful client inside a remote.

<a id="d16"></a>**D16 — One error boundary per remote, shell-owned, never federated.**
Specified in
[docs/architecture/mfe-failure-and-fallback-behavior.md](../../architecture/mfe-failure-and-fallback-behavior.md);
implemented by Slice 4.
