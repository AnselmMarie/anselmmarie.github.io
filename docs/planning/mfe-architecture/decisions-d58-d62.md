# Decisions D58–D62 — what building Slice 3 forced

The index is [decisions.md](./decisions.md). Their own file because all five came out of
building [Slice 3](./slices/03-federation-header.md) on 2026-09-21, and three of them
**correct something the plan already asserted** — a design row, a shared-dependency list,
and a slice's stated end state. Recorded as decisions rather than as edits so the
corrections are numbered and cannot be lost in a revision.

Two of them ([D58](#d58), [D61](#d61)) are addenda to
[D55](./decisions-d55.md#d55): the spike verified the **built** output, and both of these
live outside what a build inspection can see.

---

<a id="d58"></a>**D58 — the shell's federation plugin sets
`hostInitInjectLocation: 'entry'`. The default breaks `vite dev` outright.** Found by
building, 2026-09-21.

The option defaults to `'html'`, which injects the host's Module Federation init into a
static `index.html`. **TanStack Start has no such file** — it builds the document from
`__root.tsx` — so the default falls back to wrapping whatever the plugin takes to be the
entry module. In dev that is `apps/shell/src/router.tsx`.

The plugin rewrites it into an async bootstrap that awaits shared-scope init and then
`import`s the real module under a `?mf-entry-bootstrap` query. The rewritten file
**re-exports nothing**, so Start's client entry fails with:

```
SyntaxError: The requested module '/src/router.tsx'
             does not provide an export named 'getRouter'
```

⚠️ **The failure mode is worse than the error suggests.** The client never hydrates, so
every remote silently stays unmounted — `ClientOnly` never reaches the client and the
header region renders its placeholder forever. The page still returns 200 and still shows
the shell's own SSR'd content, so nothing looks broken until you notice the remote is
missing.

**It affects `vite dev` only.** The production build is unaffected, verified both ways on
2026-09-21. That is exactly why [D55](./decisions-d55.md#d55)'s spike did not catch it: the
spike's evidence was the built Lambda output and a built remote.

```ts
federation({
  /* … */
  dts: false,
  hostInitInjectLocation: 'entry',   // ← D58. Not optional under TanStack Start.
})
```

Verified: with the option set, `vite dev` on both apps composes the Header with **zero**
console errors, and the built `aws-lambda` path is unchanged.

---

<a id="d59"></a>**D59 — the live v3 site has no header, so the Header remote's visual
treatment is invented. [D34](./decisions-d33-d41.md#d34) does not cover it, and the README's
design table was wrong.** Found 2026-09-21, building Slice 3.

The README's design table read `Header | live v3 site | ✅ exists`. It does not exist.
Verified two ways:

- **Source**, at `39bbe56` ([D53](./decisions-d53.md#d53)): there is no header or nav
  component anywhere in the tree. `src/app/layout.tsx` renders `<body>` → `<Theme>` →
  `children` and nothing else. The homepage is hero → skills → active projects → other
  projects. **No element in the v3 tree carries an `id`**, so there are no anchor targets
  either. The only navigation in the whole site is a `← Back` link on portfolio pages.
- **The deployed site**: the hero fills the viewport, carrying only the LinkedIn and GitHub
  icons, and scrolling reveals no sticky bar.

[D43](./decisions-d42-d47.md#d43) had already decided the Header exists and navigates by
anchor, so **that it exists is not in question** — what has no reference is what it looks
like and what it says. Per
[plan-design-links.md](../../../.claude/rules/plan-design-links.md), every choice made
without one is flagged:

| Invented | What was chosen, and from what |
|---|---|
| The bar itself | Height (`--spacing-header`, 4rem), sticky, bottom border, max-width, padding, hover opacity. No v3 equivalent at all. |
| The nav label set | That there are three links, and which sections they point at. |
| `Skills` | v3 renders this section with **no heading**; the word is ours. |
| The three section `id`s | `skills`, `active-projects`, `other-projects`. No v3 element has an `id`. |

Two things are **not** invented, and are ported: `Active Projects` and `Other Projects` are
the verbatim `<h2>` text of v3's own sections, and the brand text is v3's hero `<h1>`
(already in the fixtures as `SITE_NAME`).

⚠️ **The ids are a contract with [Slice 6](./slices/06-homepage-mfe.md)**, which owns the
matching `id` attributes and their `scroll-margin-top`. They are different remotes; the
agreement is written down only in `header-sections.const.ts` and its spec. A rename that
Slice 6 does not follow fails **silently** — the link scrolls nowhere and nothing errors.

The fallbacks in [Slice 4](./slices/04-error-boundaries.md) were the plan's only invented UI.
They are now the second set.

---

<a id="d60"></a>**D60 — `@portfolio/ui-components` and `@portfolio/ui-theme` are not Module
Federation shared modules. They are shared at build time instead.
[Slice 3](./slices/03-federation-header.md)'s file list named both and was wrong.** Found by
building, 2026-09-21.

Slice 3 specified the shared set as `react`, `react-dom`, `@portfolio/ui-components`,
`@portfolio/ui-theme`. Only the first two can be.

- **`@portfolio/ui-theme` is CSS-only.** Its sole export is `./theme.css`. There is no JS
  module for the federation runtime to put in the shared scope.
- **`@portfolio/ui-components` is unbuilt TypeScript source** — which is
  [D57](./decisions-d57.md#d57)'s deliberate "libs stay source-only". Declaring it shared
  puts it in the host's `optimizeDeps.include`, where Vite cannot resolve it
  (`Failed to resolve dependency: @portfolio/ui-components`), and **the failed pre-bundle
  cascades into the host's client entry** rather than degrading to an unshared module.

⚠️ **Keep the two `shared` blocks identical.** A module declared shared by only one side is
not shared, it is duplicated — and the duplication is invisible until two copies of a
stateful module disagree at runtime.

What this costs, honestly: each app compiles its own copy of the components it uses, so a
component rendered by two remotes ships twice. For a component library this small that is
cheaper than the alternative, and the **theme** — the thing that actually has to agree
across remotes — is unaffected, because [D26](./decisions-d17-d32.md#d26) shares it as one
stylesheet at build time. That is what lets the Header and the Homepage agree on the
header-height token ([D43](./decisions-d42-d47.md#d43)) without crossing the federation
boundary.

Sharing `ui-components` properly needs a build step on the lib, which reverses part of D57.
**No slice has scheduled that**, and nothing so far needs it.

---

<a id="d61"></a>**D61 — the remote's URL is baked into the shell's bundle at build time, so
[D12](./decisions-d01-d16.md#d12) is not yet satisfied. Deferred deliberately, not
overlooked.** Found by building, 2026-09-21.

[D12](./decisions-d01-d16.md#d12) promises an MFE deploys without rebuilding the
application, and [D19](./decisions-d17-d32.md#d19) names runtime remote resolution as the
mechanism. **A static `remotes` map in `vite.config.ts` cannot do that**: the entry URL is
resolved at build time and inlined into the host's bundle. Redeploying the Header at a new
origin today requires rebuilding the shell.

This is not a new discovery so much as a sharpening of what D55 already said. D55's *"What
the spike did NOT prove"* records that the `mf-manifest.json` runtime-resolution path is
untested and a direct `remoteEntry.js` URL was used, while claiming that still satisfies
D19. ⚠️ **It does not.** Reading the URL from `process.env` at *build* time is not reading
it at runtime; the env var is baked in just as a literal would be.

Slice 3 builds on the path D55 proved rather than on an unproven one, and the gap is
commented at both sites rather than papered over. Closing it means `registerRemotes` from
the federation runtime, called on the client with the registry's entry — a scoped change to
`apps/shell/src/remotes/`, not a rewrite.

**Two visible consequences until then:**

1. `libs/shared/config`'s `DEFAULT_HEADER_ORIGIN` is **duplicated** as a literal in
   `apps/shell/vite.config.ts`, because Nx's `@nx/vite` plugin loads that config through
   Node's ESM resolver and the shared-config package is unbuilt TypeScript whose internal
   `./x.js` specifiers Node cannot resolve. Importing it there fails graph construction
   outright. The two must agree by hand.
2. [Slice 8](./slices/08-independent-deployment.md) inherits this: a deploy that changes a
   remote's origin is a shell rebuild, which is the opposite of the independent-deployment
   property the slice exists to demonstrate. **Close D61 before Slice 8, not during it.**

---

<a id="d62"></a>**D62 — a downed remote takes the whole page down until
[Slice 4](./slices/04-error-boundaries.md) lands. Slice 3's stated end state was wrong, and
Slice 3 must not ship on its own.** Found by building, 2026-09-21.

Slice 3's *"What is on screen at the end"* claimed:

> Stopping the header's dev server and reloading shows the page still rendering — without a
> graceful fallback yet, which is Slice 4.

**It does not.** Verified on 2026-09-21 by killing the remote's server and reloading: the
entire route is replaced by TanStack Router's default `CatchBoundary` — a bare
*"Something went wrong!"* and a **Show Error** button. The shell's own SSR'd content is
gone, along with the footer region.

The mechanism: `lazy()`'s import **rejects**, and a rejected lazy import is not something
`Suspense` can absorb — it propagates to the nearest error boundary, which at that point is
the router's own, at route level. So the blast radius is the route, not the region.

This is the failure [D16](./decisions-d01-d16.md#d16) exists to prevent and
[Slice 4](./slices/04-error-boundaries.md) implements, so **the fix is not moved** — what
changes is the status of the state in between:

- Slice 3's end-state claim is corrected in its own file.
- The `3 → 4` edge in [parallelization.md](./parallelization.md) is **harder than
  "the boundary wants a real remote to test against"**. Slice 3 alone is a site where one
  remote's outage is a total outage; it is reviewable, and it is not deployable.
- [Slice 9](./slices/09-e2e-composition.md)'s failure-isolation E2E is the regression test
  for exactly this, and it now has a documented red state to assert against.

⚠️ A **render-time throw** inside the remote is a different path from a **load failure**,
and only the first would ever reach a React boundary. Slice 4's notes already say this; D62
is the evidence that the second path is the one currently unhandled, and that it is the more
destructive of the two.
