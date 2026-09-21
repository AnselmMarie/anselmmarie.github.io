# Slice 1 — Nx workspace and the TanStack Start shell

**Status:** ✅ built 2026-09-20, awaiting review · **Visible?** ✅ screen · **Depends on:** nothing
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))

## Decisions that bind this slice

- **[D4](../decisions-d01-d16.md#d4)** — TanStack Start is the shell. Routing, the SSR entry, and
  server functions all live in `apps/shell`.
- **[D31](../decisions-d17-d32.md#d31)** — it runs on **AWS Lambda** behind CloudFront (superseding
  [D5](../decisions-d01-d16.md#d5), Cloudflare Workers). The Lambda build target and adapter are set
  up now, not retrofitted at Slice 8.
- **[D6](../decisions-d01-d16.md#d6)** — no Next.js. Nothing in the scaffold reaches for it.
- **[D18](../decisions-d17-d32.md#d18)** — pnpm + Nx. Every project created here is a registered Nx
  project with `typecheck`, `lint`, and `test` targets.
- **[D20](../decisions-d17-d32.md#d20)** — Vitest and Testing Library are stood up **in this
  slice**, so every later slice can ship its specs. This is the slice that makes
  `no-deferred-specs.md` possible to obey.
- **[D21](../decisions-d17-d32.md#d21)** — `@portfolio/*` package scope.
- **[D27](../decisions-d17-d32.md#d27)** — apps are skeletons. `apps/shell` gets config, the SSR
  entry, and routes; the page itself lives in `libs/features/shell` from the first commit,
  so the rule is established by example rather than asserted and then broken.
- **[D29](../decisions-d17-d32.md#d29)** — `libs/shared/*`, one package per concern. All four are
  created here, some of them nearly empty, because creating them later means editing root
  manifests during a parallel wave.

- **[D48](../decisions-d48-d52.md#d48)** — the shell emits `<title>`, description and Open
  Graph **server-side, per route**, from `libs/shared/fixtures`. This is why the route tree
  could not be written until [Q14](../questions-closed-q9-q16.md#q14) closed: every route file gains
  a `head` function. It does not federate anything and does not reopen
  [D36](../decisions-d33-d41.md#d36).
- **[D49](../decisions-d48-d52.md#d49)** — the Lambda is **`arm64`**. The inherited `.npmrc`
  pins `supportedArchitectures[cpu]=x64`; this slice adds `arm64` so pnpm does not fetch
  native binaries for the wrong architecture.
- **[D50](../decisions-d48-d52.md#d50)** — ⚠️ **`project.json` sets the bare name
  (`feature-shell`); `package.json` sets the scoped one (`@portfolio/feature-shell`).** Nx
  falls back to the package name when `project.json` does not set one, so without this every
  gate command in this plan fails with "project not found" on its first run.
- **[D51](../decisions-d48-d52.md#d51)** — Tailwind 4, configured **in CSS**. There is no
  `tailwind.config.ts`; the theme is `@theme` in a stylesheet and the build is the
  `@tailwindcss/vite` plugin. [D26](../decisions-d17-d32.md#d26)'s one-theme-one-place rule is
  unchanged; only the artifact is.
- **[D52](../decisions-d48-d52.md#d52)** — this slice writes
  `tools/scripts/check-file-size.mjs`, the `lint-staged` block and the pre-commit hook.
  [file-size.md](../../../../.claude/rules/file-size.md) claims they exist; they do not, and
  this is the slice that creates the first source file the 200-line cap applies to.
- **[D37](../decisions-d33-d41.md#d37)** — the infrastructure is **AWS CDK**, in TypeScript, as its
  own registered Nx project. That is what settles which Lambda adapter `apps/shell` is built
  with, and the adapter shapes both the build output and what the local dev server looks
  like — which is why it is decided here rather than at Slice 8.

## Open questions blocking this slice

[Q10](../questions-closed-q9-q16.md#q10) blocked this slice and closed on 2026-09-20 as
[D37](../decisions-d33-d41.md#d37) — the CDK project is created here, even though nothing deploys
until Slice 8, so the shell is never scaffolded against a placeholder adapter.

Three more were raised on 2026-09-20, and all three closed the same day as the maintainer
added the config files:

- **[Q11](../questions-closed-q9-q16.md#q11) → [D44](../decisions-d42-d47.md#d44)** — ESLint owns the
  module boundaries, Biome owns formatting. `eslint.config.mjs` exists with
  `@nx/enforce-module-boundaries` at `error`, so [D27](../decisions-d17-d32.md#d27) and
  [D29](../decisions-d17-d32.md#d29) have a mechanism rather than a convention.
- **[Q16](../questions-closed-q9-q16.md#q16) → [D45](../decisions-d42-d47.md#d45)** — `.nvmrc` pins Node
  22 and `.npmrc` was added.
- **[Q15](../questions-closed-q9-q16.md#q15) → [D46](../decisions-d42-d47.md#d46)** — the half-ported
  cosmikata tooling was pruned. What that leaves this slice is the repaired-state note below.

✅ **[Q14](../questions-closed-q9-q16.md#q14) closed on 2026-09-20 as
[D48](../decisions-d48-d52.md#d48)** — it was the last one blocking this slice. The answer is
yes: `apps/shell` emits per-route metadata server-side from `libs/shared/fixtures` while
[D36](../decisions-d33-d41.md#d36) keeps the visible content client-rendered. It was settled
before the route tree was written, which is what it asked for.

**Nothing is open against this slice.**

✅ **The lint config was repaired on 2026-09-20.**
[`tools/eslint/module-boundaries.mjs`](../../../../tools/eslint/module-boundaries.mjs) now
exists — it was the missing import that made ESLint fail at config load — and it encodes
[D2](../decisions-d01-d16.md#d2), [D25](../decisions-d17-d32.md#d25), [D27](../decisions-d17-d32.md#d27) and
[D29](../decisions-d17-d32.md#d29) as `@nx/enforce-module-boundaries` constraints.

⚠️ **Two obligations it hands this slice.**

1. **Prove the config executes.** All three plugins — `@nx/eslint-plugin`,
   `eslint-plugin-unused-imports`, `typescript-eslint` — are already declared in
   `package.json` ([D46](../decisions-d42-d47.md#d46)), but the workspace has no
   `pnpm-lock.yaml` and no `node_modules`. The first `pnpm install` is this slice's, and the
   lint gate below is what proves the boundary rule runs rather than failing at config load.
2. **Tag every project, without exception.** The constraints are **silently inert** for a
   project with no matching tag: it is unconstrained and the rule passes trivially rather
   than failing. The vocabulary is in the constraints file's header — a `type:` and a
   `scope:` tag in each `project.json`. An untagged project is not a lint error today, which
   is why Slice 8 gains a CI check for it.

[Q15](../questions-closed-q9-q16.md#q15) closed the same day as [D46](../decisions-d42-d47.md#d46): the
prune is **done**, not pending. `.claude/rules/` is 32 active files (15 archived to
`.claude/rules-archive/`, moved rather than deleted because `.claude/*` is gitignored and
untracked), and `.nxignore`, `biome.json`, `package.json` and `coding-conventions.md` were
all repaired.

⚠️ **One thing that prune leaves for this slice:** three archived rules were doing real work
and only their *references* were dead. [Slice 2](./02-ui-libs.md) owes a `@portfolio`
version of `design-system.md`; this slice should not invent one early.

## What is on screen at the end

`http://localhost:3000/` serves a real, laid-out page: a header area, a content area, and a
footer area, rendered by `libs/features/shell`, styled with Tailwind through the shell's
own config.

**Stubbed:** all copy is hardcoded in the feature lib. There is no design system yet
(Slice 2), no remote (Slice 3), and no content source. The layout regions are placeholders
that later slices replace with real mounts.

## Files this slice creates and modifies

**Workspace root**

⚠️ **The 2026-09-20 prune ([D46](../decisions-d42-d47.md#d46)) already repaired the root**,
and this list was corrected against the working tree on 2026-09-20. The files marked
*existing* are correct as they stand — **do not rewrite them.**

*Created by this slice:*

- `nx.json`, `pnpm-workspace.yaml`, root `tsconfig.base.json`
- `.env.example` — placeholders only, no real values ([D11](../decisions-d01-d16.md#d11))

*Existing and correct — extend, never replace:*

- `biome.json` — already a `@portfolio` file, with the `@portfolio/**` import group in place
  ([D21](../decisions-d17-d32.md#d21), [D46](../decisions-d42-d47.md#d46)). No cosmikata
  ignores and no `@cosmikata/**` group remain. Touch it only to cover a new path.
- Root `package.json` — carries no `next` dependency or scripts
  ([D6](../decisions-d01-d16.md#d6)); `packageManager` is pinned to pnpm 10.33.0 and
  `engines` to Node 22 ([D45](../decisions-d42-d47.md#d45),
  [D46](../decisions-d42-d47.md#d46)). This slice adds the workspace's own dependencies and
  scripts, nothing more.
- `eslint.config.mjs` + `tools/eslint/module-boundaries.mjs` — ✅ repaired 2026-09-20, with
  all three plugins declared. This slice tags every project it creates so the constraints
  are not silently inert.
- `.nxignore` — reduced to `.claude/worktrees` ([D46](../decisions-d42-d47.md#d46)).
- `.gitignore` — present, but still carries Next.js, Expo, Cloudflare Wrangler, OpenNext,
  Storybook **and Uniwind** sections that are all dead here
  ([D6](../decisions-d01-d16.md#d6), [D31](../decisions-d17-d32.md#d31)). Prune those, with
  one trap: ⚠️ **`.nx/polygraph` sits inside the Expo block** and is a live Nx ignore — keep
  it, with `.nx/cache`. Then add the five paths `eslint.config.mjs` already ignores and
  `.gitignore` does not: `.output`, `.nitro`, `cdk.out`, `playwright-report`, `.playwright`.
  (Nx and Vite are already covered — `.nx/cache`, `.nx/workspace-data` and the
  `*.config.*.timestamp*` entries are all present.)
- `.npmrc` — ⚠️ **existing, and not yet reviewed.** [D45](../decisions-d42-d47.md#d45) added
  it but [D46](../decisions-d42-d47.md#d46)'s prune did not read it: its comments name
  `jest-expo` and `nx-esbuild`, neither of which exists here. Per
  [D49](../decisions-d48-d52.md#d49) its architecture block gains `arm64`. The esbuild
  hoisting comments describe a real pnpm behavior and stay.
- `biome.json` — ⚠️ **one new path.** `files.includes` covers `ts/tsx/js/jsx/json/jsonc`, so
  `eslint.config.mjs` and `tools/eslint/module-boundaries.mjs` are outside Biome entirely and
  `pnpm format` never touches them. Add `**/*.mjs` and `**/*.cjs`.

**`apps/shell`**

- `project.json`, `package.json`, `vite.config.ts` (TanStack Start + Nitro `aws_lambda`
  preset + `@tailwindcss/vite`), `src/styles.css` with its `@source` line — **no
  `tailwind.config.ts`** ([D51](../decisions-d48-d52.md#d51))
- `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`
- The SSR entry and the client entry
- No components. If a component appears here, the slice has broken
  [D27](../decisions-d17-d32.md#d27).

**`libs/features/shell`**

- `project.json`, `src/index.ts`
- The layout component and its regions, with specs

**`libs/shared/types`**, **`libs/shared/config`**, **`libs/shared/fixtures`**,
**`libs/shared/utils`**

- `project.json` and `src/index.ts` each. `config` gets the remote-registry type and an
  empty registry; the rest start minimal and grow when a second consumer appears.

**`infra`** — the CDK project ([D37](../decisions-d33-d41.md#d37))

- `project.json`, the CDK app entry, and a stack that is **defined but not deployed**.
  Nothing in this slice runs `cdk deploy`; [Slice 8](./08-independent-deployment.md) fills
  the stack in and wires it to Actions.
- It exists now so `apps/shell` is built against its real Lambda adapter from the first
  commit rather than against a placeholder that gets replaced.

**Test harness**

- Vitest config per project, a shared setup file, Testing Library wiring
- At least one spec per created lib, so the harness is proven rather than assumed

**Tooling**

- `.claude/launch.json` — **rewritten.** It currently lists cosmikata's apps
  (`cos-marketing-app`, `@cosmikata/api`, and five more) and is dead configuration in this
  repo. Replaced with a `shell` entry on port 3000.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=shell,feature-shell,shared-types,shared-config,shared-fixtures,shared-utils,infra
```

⚠️ **`infra` was missing from that list until 2026-09-20.** It is a project this slice
creates, and [D18](../decisions-d17-d32.md#d18) puts `typecheck`/`lint`/`test` on every
project created here. The bare names are the [D50](../decisions-d48-d52.md#d50) form.

Plus `pnpm check:file-size` ([D52](../decisions-d48-d52.md#d52)), and the visible check: the
page open in a browser, and a screenshot in the completion report
([plan-visible-first.md](../../../../.claude/rules/plan-visible-first.md)).

## Notes for whoever builds this

- **Do the Lambda target now.** Getting TanStack Start building and running as a Lambda
  handler is substantially easier with nothing else in the graph, and discovering a blocker
  here is cheap. Discovering it at Slice 8 is not.
- **Expect the local dev story to differ from production.** Vite's dev server is not
  Lambda, and the gap between them is where host migrations hide their surprises. Run the
  built handler locally at least once in this slice rather than trusting the dev server.
- **Resist filling `apps/shell`.** The pull toward putting the first page directly in the
  route file is strong and it is exactly the habit [D27](../decisions-d17-d32.md#d27) exists to
  prevent. The route renders a component from `@portfolio/feature-shell` and nothing more.
- Tailwind lands here in its plainest form. The shared preset is Slice 2's job; do not
  build half of it now.
