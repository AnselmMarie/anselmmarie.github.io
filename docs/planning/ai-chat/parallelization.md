# Parallelization

Recording that slices *can* run in parallel is not permission to fan out. The
maintainer decides.

## Dependency graph

```
1 (panel) → 2 (messages + tools) ─┐
                                   ├→ 5 (connect)
3 (api)   → 4 (infra) ────────────┘
```

- Slice 2 builds on Slice 1's panel.
- Slice 4 bundles Slice 3's handler and reads its env-var names.
- Slice 5 needs both halves.
- `libs/shared/chat-contract` is imported by both halves. It's created **up
  front by the coordinator** (types and zod schemas only) so neither half owns it.

## Shared-file table (pre-existing files each slice modifies)

| Slice | Pre-existing files it modifies |
|---|---|
| 1 | `apps/shell/src/routes/__root.tsx`, `apps/shell/vite.config.ts`, `apps/shell/src/remotes/remotes.d.ts`, `libs/shared/types/src/remote/remote.ts`, `libs/shared/config/src/remote-registry/remote-registry.ts` (+ spec), `infra/src/site-config/site-config.ts` (+ spec), `e2e/support/remotes.ts`, `.env.example`, `libs/ui/components/src/index.ts`, `libs/ui/components/src/ui-icon/ui-icon.tsx` (+ spec), `libs/ui/primitives/src/index.ts`, `.claude/rules/design-system.md`, `tsconfig.base.json`, root `package.json` |
| 2 | `libs/features/header/src/anchor-href/anchor-href.ts` (moves to `libs/shared/utils`), `libs/shared/utils/src/index.ts`, the header's import sites, `apps/shell/src/routes/__root.tsx` (navigate listener), `libs/shared/chat-contract` (navigate event) |
| 3 | `tsconfig.base.json`, root `package.json` + `pnpm-lock.yaml` (adds `@aws-sdk/client-bedrock-runtime`, `@aws-sdk/client-dynamodb`, `@aws-sdk/client-ssm`, `zod`) |
| 4 | `infra/src/portfolio-stack.ts`, `infra/src/portfolio-stack.spec.ts`, `infra/src/site-distribution/site-distribution.ts` (+ spec), `infra/src/main.ts`, `infra/package.json` |
| 5 | `libs/features/chat/**` (its own), `apps/shell/src/routes/__root.tsx`, `e2e/**` |

## Waves

| Wave | Runs | Why this order |
|---|---|---|
| 0 | Coordinator: create `libs/shared/chat-contract`, add all dependencies, add tsconfig aliases | **Manifest work is solo.** `package.json`, `pnpm-lock.yaml` and `tsconfig.base.json` are touched by Slices 1 and 3 |
| 1 | Slice 1 **∥** Slice 3 | Disjoint once Wave 0 has done the manifests: the `chat` remote, its registration and the new `libs/ui/*` components vs. `libs/api/chat` |
| 2 | Slice 2 **∥** Slice 4 | Disjoint: chat feature + header/utils + shell listener vs. `infra/`. Slice 1 already made its one `infra/src/site-config` edit (`REMOTES`) in Wave 1, so Slice 4 starts from it rather than racing it |
| 3 | Slice 5 alone | Touches both halves |

Without Wave 0, Slices 1 and 3 serialize on **`tsconfig.base.json` and the root
`package.json`**.

**Recommendation: run sequentially.** It's a small plan, and every slice stops
for review anyway. The parallel option exists only if wall-clock time matters.

## Estimated changed files per slice (cap: 250)

| Slice | Estimate |
|---|---|
| 0 (contract + manifests) | ~10 |
| 1 | ~48 (remote scaffold + 9 registration files + 3 new ui-components, an icon update and the generated input) |
| 2 | ~20 |
| 3 | ~22 |
| 4 | ~14 |
| 5 | ~12 |

All well under the cap.
