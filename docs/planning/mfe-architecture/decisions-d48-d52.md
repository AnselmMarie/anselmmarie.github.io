# Decisions D48–D52 — what building Slice 1 forced

The index is [decisions.md](./decisions.md). D48 closes the last question that was blocking
a slice; D49 through D52 are decisions [Slice 1](./slices/01-workspace-and-shell.md) could
not be built without, each surfaced by the 2026-09-20 audit of the plan against the working
tree rather than by planning.

⚠️ **D49 through D52 were taken while building, not before it.** That is the honest record:
they are the four places where the plan described a workspace in enough detail to review but
not enough detail to create. Each one names what the plan assumed and why the assumption did
not survive contact.

<a id="d48"></a>**D48 — The shell server-renders per-route metadata, though not per-route
content.** Closes [Q14](./questions-closed-q9-q16.md#q14). `apps/shell` emits `<title>`,
description, and Open Graph tags server-side, per route, sourced from
`libs/shared/fixtures` at build time.

This does **not** reopen [D36](./decisions-d33-d41.md#d36) and federates nothing. D36
accepted that "link previews get nothing from the content surfaces" — true of the *rendered
content*, and it stays true. The metadata is a different payload on a different path: the
shell owns the route, runs on Lambda, and already imports the fixtures, so emitting a real
`<title>` costs a `head` function on each route file and nothing else. The four remotes
still load and hydrate client-side exactly as D36 decided.

What it binds: every route file in `apps/shell` gains a metadata source, which is why
[Q14](./questions-closed-q9-q16.md#q14) had to close before the route tree was written.
[Slice 6](./slices/06-homepage-mfe.md) and [Slice 7](./slices/07-portfolio-item-mfe.md) each
supply the per-route values for the surface they add — Slice 7's is the interesting one,
because `/portfolio/$slug` is the route whose link preview was worth recovering.

⚠️ **`robots.txt` and a sitemap were asked in the same breath as Q14 and are NOT decided
here.** They are a separate surface with a separate cost, and nothing in this plan blocks on
them. If they are wanted, they are a new question.

<a id="d49"></a>**D49 — The Lambda is `arm64`, and `.npmrc` is corrected to match.**
[D31](./decisions-d17-d32.md#d31) put the shell on Lambda and
[D37](./decisions-d33-d41.md#d37) made CDK describe it, but **neither named an
architecture**, and the plan is silent throughout — the audit found no mention of `arm64` or
`x86` anywhere in the directory.

It is decided here because it is not free to defer: the inherited `.npmrc` pins
`supportedArchitectures[cpu]=x64` and `[os]=linux`. That pin is cosmikata residue that
[D46](./decisions-d42-d47.md#d46) did not catch, and left alone it makes pnpm fetch x64
native binaries for a function that would run on Graviton — a mismatch that surfaces at
runtime, in the host, which is the most expensive place to find it.

`arm64` because Graviton is cheaper per millisecond and this workload is a plain SSR
handler with no native dependency that would argue otherwise. The `.npmrc` architecture
block gains `arm64` alongside `x64` rather than replacing it, so a build on either machine
resolves correctly.

<a id="d50"></a>**D50 — An Nx project's name is the bare form; its package name carries the
`@portfolio/` scope.** `project.json` sets `"name": "feature-shell"`; `package.json` sets
`"name": "@portfolio/feature-shell"`. The two differ deliberately.

[D21](./decisions-d17-d32.md#d21) fixed the package scope and every slice's gate command was
written against the bare form — `--projects=shell,feature-shell,shared-types,…` — but
nothing connected them. In Nx a project's name falls back to its `package.json` name when
`project.json` does not set one, so a builder following D21 alone would produce
`@portfolio/feature-shell` and **every gate command in every slice of this plan would fail
with "project not found"** on its first run.

So: imports and the dependency graph use the scoped name; Nx targets, `nx affected`, and
every gate command in this plan use the bare one.

<a id="d51"></a>**D51 — Tailwind 4, configured in CSS. There is no `tailwind.config.ts`.**
[D3](./decisions-d01-d16.md#d3) and [D26](./decisions-d17-d32.md#d26) predate the Tailwind 4
release and assume a v3 JavaScript config object — [Slice 1](./slices/01-workspace-and-shell.md)
lists `apps/shell/tailwind.config.ts` and [Slice 2](./slices/02-ui-libs.md) builds a
"preset" from it. Tailwind 4 has no such file: the theme is `@theme` inside a stylesheet,
and the build is the `@tailwindcss/vite` plugin.

D26's substance is unaffected and survives intact — **one theme, one place, every app
extends it rather than declaring its own colors.** What changes is the artifact: a CSS file
in `libs/ui/theme` that each app's stylesheet `@import`s, in place of a config object each
app's config spreads.

One thing it improves, worth recording because a risk closes with it: Tailwind 4 discovers
its sources by `@source` directives rather than a `content` glob array.
[R3](./risks.md#r3) — a lib's classes silently tree-shaken out by a content glob that did
not list it, rendering unstyled — becomes a one-line declaration in the theme's own
stylesheet instead of a glob every consumer must remember to extend.

<a id="d52"></a>**D52 — Slice 1 builds the file-size checker the rules already claim
exists.** [`file-size.md`](../../../.claude/rules/file-size.md) and
[`plan-split-into-files.md`](../../../.claude/rules/plan-split-into-files.md) both assert
that `tools/scripts/check-file-size.mjs` enforces the 200-line source cap through
`lint-staged` at commit time and `pnpm check:file-size` on demand. **Neither the script nor
`lint-staged` nor husky exists in this repo**, and before this decision no slice created
them — so two active rules cited a gate that was never going to run.

Slice 1 writes the script, the `lint-staged` block, and the pre-commit hook, because Slice 1
is the slice that creates the first source file the cap applies to. Deferring it means every
file written between here and wherever it landed was written against an unenforced cap, and
the plan's own history says what that produces.
