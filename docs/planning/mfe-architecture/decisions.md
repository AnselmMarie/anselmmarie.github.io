# Decisions — index

The source of truth. A slice file restates the decisions that bind it, with one line of
local meaning; when the two disagree, **this file's log wins** and the slice is corrected in
the same change. Decisions are **never renumbered and never deleted** — a reversal is a new
entry that supersedes an old one ([D5](./decisions-d01-d16.md#d5) is the worked example).

⚠️ **Split into four range files on 2026-09-20**, at 491 lines against the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md). Nothing was
reworded in the cut; the ranges follow the section boundaries the log already had, so no
decision is separated from the ones that explain it. This file is now the index only.

- [**D1–D16** — Architecture](decisions-d01-d16.md)
- [**D17–D32** — The plan's own decisions, and the host change](decisions-d17-d32.md)
- [**D33–D41** — The first round of questions closed](decisions-d33-d41.md)
- [**D42–D47** — The second round, and the tooling prune](decisions-d42-d47.md)

## Every decision

| # | Decision | In |
|---|---|---|
| [D1](decisions-d01-d16.md#d1) | React + Vite for the MFEs | `d01-d16` |
| [D2](decisions-d01-d16.md#d2) | Module Federation composes the application | `d01-d16` |
| [D3](decisions-d01-d16.md#d3) | shadcn/ui + Tailwind for the UI layer | `d01-d16` |
| [D4](decisions-d01-d16.md#d4) | TanStack Start is the shell and the server layer | `d01-d16` |
| [D5](decisions-d01-d16.md#d5) | Cloudflare Workers is the server runtime | `d01-d16` |
| [D6](decisions-d01-d16.md#d6) | No Next.js | `d01-d16` |
| [D7](decisions-d01-d16.md#d7) | Contentful is accessed server-side only | `d01-d16` |
| [D8](decisions-d01-d16.md#d8) | The MFEs do not need SSR | `d01-d16` |
| [D9](decisions-d01-d16.md#d9) | No federated SSR unless specifically requested | `d01-d16` |
| [D10](decisions-d01-d16.md#d10) | Secrets live in Cloudflare, not GitHub | `d01-d16` |
| [D11](decisions-d01-d16.md#d11) | The public repo carries only safe example configuration | `d01-d16` |
| [D12](decisions-d01-d16.md#d12) | An MFE deploys without rebuilding the application | `d01-d16` |
| [D13](decisions-d01-d16.md#d13) | Monorepo, `apps/*` + `libs/*` | `d01-d16` |
| [D14](decisions-d01-d16.md#d14) | Content data flow is `Browser → shell → Worker → Contentful` | `d01-d16` |
| [D15](decisions-d01-d16.md#d15) | An MFE never holds a Contentful credential | `d01-d16` |
| [D16](decisions-d01-d16.md#d16) | One error boundary per remote, shell-owned, never federated | `d01-d16` |
| [D17](decisions-d17-d32.md#d17) | Flow: frontend-only | `d17-d32` |
| [D18](decisions-d17-d32.md#d18) | pnpm + Nx | `d17-d32` |
| [D19](decisions-d17-d32.md#d19) | `@module-federation/vite` | `d17-d32` |
| [D20](decisions-d17-d32.md#d20) | Vitest in Slice 1; Playwright at Slice 9 | `d17-d32` |
| [D21](decisions-d17-d32.md#d21) | Package scope is `@portfolio/*` | `d17-d32` |
| [D22](decisions-d17-d32.md#d22) | Fixtures feed the MVP | `d17-d32` |
| [D23](decisions-d17-d32.md#d23) | Delivery is GitHub Actions, one workflow, driven by `nx affected` | `d17-d32` |
| [D24](decisions-d17-d32.md#d24) | No Docker | `d17-d32` |
| [D25](decisions-d17-d32.md#d25) | `libs/ui/primitives` is shadcn output; `libs/ui/components` is hand-written | `d17-d32` |
| [D26](decisions-d17-d32.md#d26) | One Tailwind preset and theme, in `libs/ui/theme` | `d17-d32` |
| [D27](decisions-d17-d32.md#d27) | `apps/*` are skeletons; the logic lives in `libs/features/*` | `d17-d32` |
| [D28](decisions-d17-d32.md#d28) | The architecture doc's boundary path is corrected to `libs/features/shell/src/mfe-error-boundary/` | `d17-d32` |
| [D29](decisions-d17-d32.md#d29) | Reused non-UI code lives in `libs/shared/*`, one package per concern | `d17-d32` |
| [D30](decisions-d17-d32.md#d30) | Module Federation cannot run server-side on the Workers runtime | `d17-d32` |
| [D31](decisions-d17-d32.md#d31) | The host is AWS: S3 + CloudFront for the remotes, Lambda for the TanStack Start SSR server | `d17-d32` |
| [D32](decisions-d17-d32.md#d32) | Federated SSR remains declined | `d17-d32` |
| [D33](decisions-d33-d41.md#d33) | The purpose of this rebuild is to showcase the MFE architecture | `d33-d41` |
| [D34](decisions-d33-d41.md#d34) | The live v3 site is the visual reference | `d33-d41` |
| [D35](decisions-d33-d41.md#d35) | The site is served from AWS; the repo name constrains nothing | `d33-d41` |
| [D36](decisions-d33-d41.md#d36) | All four surfaces stay federated and client-rendered | `d33-d41` |
| [D37](decisions-d33-d41.md#d37) | AWS CDK describes the infrastructure | `d33-d41` |
| [D38](decisions-d33-d41.md#d38) | Storybook is declined; Playwright carries the load | `d33-d41` |
| [D39](decisions-d33-d41.md#d39) | React is a shared singleton, not a strict-version one | `d33-d41` |
| [D40](decisions-d33-d41.md#d40) | shadcn primitives are pulled on demand, never speculatively | `d33-d41` |
| [D41](decisions-d33-d41.md#d41) | The fixtures carry real portfolio copy, and the MVP is publishable | `d33-d41` |
| [D42](decisions-d42-d47.md#d42) | Content images travel in the props payload from the shell; only component-owned UI assets ship with a remote | `d42-d47` |
| [D43](decisions-d42-d47.md#d43) | The Header navigates by anchor, so no router is shared | `d42-d47` |
| [D44](decisions-d42-d47.md#d44) | ESLint owns correctness and the module boundaries; Biome owns formatting | `d42-d47` |
| [D45](decisions-d42-d47.md#d45) | Node 22, pinned by `.nvmrc` | `d42-d47` |
| [D46](decisions-d42-d47.md#d46) | The cosmikata tooling is pruned; 15 rules are archived, not deleted | `d42-d47` |
| [D47](decisions-d42-d47.md#d47) | `worktree-safety.md`'s base branch is unresolved and stays that way | `d42-d47` |

**Start at [D33](./decisions-d33-d41.md#d33)** if you are new to the plan: the project's
purpose is the tiebreaker every later decision was taken against.
