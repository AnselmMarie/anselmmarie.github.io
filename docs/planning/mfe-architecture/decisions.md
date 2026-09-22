# Decisions — index

The source of truth. A slice file restates the decisions that bind it, with one line of
local meaning; when the two disagree, **this file's log wins** and the slice is corrected in
the same change. Decisions are **never renumbered and never deleted** — a reversal is a new
entry that supersedes an old one ([D5](./decisions-d01-d16.md#d5) is the worked example).

⚠️ **Split into range files on 2026-09-20**, at 491 lines against the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md). Nothing was
reworded in the cut; the ranges follow the section boundaries the log already had, so no
decision is separated from the ones that explain it. This file is now the index only.

- [**D1–D16** — Architecture](decisions-d01-d16.md)
- [**D17–D32** — The plan's own decisions, and the host change](decisions-d17-d32.md)
- [**D33–D41** — The first round of questions closed](decisions-d33-d41.md)
- [**D42–D47** — The second round, and the tooling prune](decisions-d42-d47.md)
- [**D48–D52** — Q14 closed, and what building Slice 1 forced](decisions-d48-d52.md)
- [**D53** — Where the portfolio content comes from](decisions-d53.md)
- [**D54** — The Slice 3 spike gate runs in parallel with Slice 2](decisions-d54.md)
- [**D55** — Federation composes with TanStack Start, and the config that proves it](decisions-d55.md)
- [**D56** — `cn` is one real Tailwind merge, in `libs/shared/utils`](decisions-d56.md)
- [**D57** — Nx drives the workspace through its own plugins](decisions-d57.md)
- [**D58–D62** — What building Slice 3 forced](decisions-d58-d62.md)
- [**D63–D68** — What building Slice 4 forced](decisions-d63-d67.md)
- [**D69** — How the ported HTML descriptions render; Q17 closes](decisions-d69.md)
- [**D70** — The v3 site has no footer either](decisions-d70.md)
- [**D71–D72** — What building Slice 6 forced](decisions-d71-d72.md)
- [**D73–D74** — What building Slice 7 forced](decisions-d73-d74.md)
- [**D75** — The brand marks are Tabler, drawn by one shared component](decisions-d75.md)

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
| [D48](decisions-d48-d52.md#d48) | The shell server-renders per-route metadata, though not per-route content | `d48-d52` |
| [D49](decisions-d48-d52.md#d49) | The Lambda is `arm64`, and `.npmrc` is corrected to match | `d48-d52` |
| [D50](decisions-d48-d52.md#d50) | An Nx project's name is the bare form; its package name carries the scope | `d48-d52` |
| [D51](decisions-d48-d52.md#d51) | Tailwind 4, configured in CSS. There is no `tailwind.config.ts` | `d48-d52` |
| [D52](decisions-d48-d52.md#d52) | Slice 1 builds the file-size checker the rules already claim exists | `d48-d52` |
| [D53](decisions-d53.md#d53) | Portfolio content and images are ported from `39bbe56` (`version-2` = `version-3`) | `d53` |
| [D54](decisions-d54.md#d54) | The Slice 3 spike gate runs in parallel with Slice 2, in its own worktree | `d54` |
| [D55](decisions-d55.md#d55) | Federation composes with TanStack Start when scoped to the client environment; Q2 closes | `d55` |
| [D56](decisions-d56.md#d56) | `cn` is one `clsx` + `tailwind-merge` helper in `libs/shared/utils` | `d56` |
| [D57](decisions-d57.md#d57) | Nx drives the workspace through its own plugins and TS project references; libs stay source-only | `d57` |
| [D58](decisions-d58-d62.md#d58) | The shell sets `hostInitInjectLocation: 'entry'`; the default breaks `vite dev` | `d58-d62` |
| [D59](decisions-d58-d62.md#d59) | The v3 site has no header, so the Header's visual treatment is invented | `d58-d62` |
| [D60](decisions-d58-d62.md#d60) | `@portfolio/ui-*` are not MF shared modules; they share at build time | `d58-d62` |
| [D61](decisions-d58-d62.md#d61) | The remote URL is baked at build time; D12 is not yet satisfied | `d58-d62` |
| [D62](decisions-d58-d62.md#d62) | A downed remote takes the whole page down until Slice 4 lands | `d58-d62` |
| [D63](decisions-d63-d67.md#d63) | The section list moves to `@portfolio/shared-fixtures`; the shell's fallback is its third reader | `d63-d67` |
| [D64](decisions-d63-d67.md#d64) | `RemoteEntry` carries a `version`, defaulting to `dev` | `d63-d67` |
| [D65](decisions-d63-d67.md#d65) | `fallback` is a render prop, and the retry counter lives in the mount, not the boundary | `d63-d67` |
| [D66](decisions-d63-d67.md#d66) | An unknown portfolio slug is a shell-level not-found, never a remote fallback | `d63-d67` |
| [D67](decisions-d63-d67.md#d67) | The Slice 5–7 wave's per-file split, settled before any agent starts | `d63-d67` |
| [D68](decisions-d63-d67.md#d68) | Slice 4 ships all four remotes runnable, with placeholder components | `d63-d67` |
| [D69](decisions-d69.md#d69) | A portfolio `description` stays HTML and is sanitized with `dompurify`; Q17 closes | `d69` |
| [D70](decisions-d70.md#d70) | v3 has no footer either; Slice 5's footer is invented but for the two social URLs | `d70` |
| [D71](decisions-d71-d72.md#d71) | Eight live portfolio items, not nine; `cosmikata-design-system` is commented out and not ported | `d71-d72` |
| [D72](decisions-d71-d72.md#d72) | The homepage tile ships without a thumbnail; homepage membership lives in `HomepageContent` | `d71-d72` |
| [D73](decisions-d73-d74.md#d73) | The shell never passes the resolved item to the remote; `/portfolio/$slug` renders the wrong item | `d73-d74` |
| [D74](decisions-d73-d74.md#d74) | No portfolio image is ported; the port was assigned to a slice that was forbidden to do it | `d73-d74` |
| [D75](decisions-d75.md#d75) | The brand marks are Tabler, via one `SocialIcon`; the name union lives in `shared-types` | `d75` |

**Start at [D33](./decisions-d33-d41.md#d33)** if you are new to the plan: the project's
purpose is the tiebreaker every later decision was taken against.
