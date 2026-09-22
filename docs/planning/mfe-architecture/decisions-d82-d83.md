# Decisions D82–D84

The Slice 10 build. [decisions.md](./decisions.md) is the index.

<a id="d82"></a>
## D82 — the three typefaces come from the Google Fonts CDN, via a `<link>`; Q20 closes

**The maintainer's call, 2026-09-22**, closing
[Q20](./questions-closed-q9-q16.md#q20). Carlito, JetBrains Mono and Inter are
served from `fonts.googleapis.com` rather than self-hosted as woff2 in
`apps/shell/public/`.

This is what the design exports themselves do — both carry
`<link rel="preconnect" href="https://fonts.googleapis.com">` — and it keeps the
three families out of the repo.

**Two consequences, both real, and the first one is a trap that has already
fired once here:**

### ⚠️ It must be a `<link>`, never a CSS `@import`

Slice 10 first wrote it the obvious way, at the top of
`libs/ui/theme/src/theme.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Carlito:...&display=swap');
```

**Vite's CSS pipeline silently dropped it.** The served stylesheet contained no
`@import`, no `@font-face`, and the page made **zero requests** to either font
origin — it rendered in system fallbacks. Typecheck, lint, all 83 specs and the
file-size gate were green throughout, and the rendered page looked plausible,
because a font that never loads is a page in a different face rather than a
broken one.

It was caught by reading `document.fonts` and the resource timings in the
running page. Nothing else in this project could have caught it, which puts it
in the same family as [R3](./risks.md#r3) — a styling failure that a green
build is simply blind to.

So the families are requested by:

- `apps/shell/src/routes/__root.tsx` — two `preconnect`s and the stylesheet
  `<link>`, ahead of the app's own stylesheet;
- each remote's `index.html`, for its standalone dev surface only.

A `<link>` is also the faster shape: a CSS `@import` cannot begin its request
until the importing sheet is fetched and parsed, which serializes two round
trips before any text can paint in the right face.

### ⚠️ Slice 8 inherits a CSP obligation

The deployed CSP must allow `style-src https://fonts.googleapis.com` and
`font-src https://fonts.gstatic.com`. If it does not, the request is blocked and
the site falls back to system faces **silently** — the same failure as above,
in production, with nothing in the build to signal it. A cold start also pays
DNS + TLS to a second origin before the first paint in these faces;
`display=swap` is what keeps that from blocking text.

Self-hosting remains the way out of both if the CDN dependency becomes
unwanted: it is a `@font-face` block and eight files, and nothing above the
`--font-*` tokens would change.

<a id="d83"></a>
## D83 — `libs/ui/components` gains a dependency on `@portfolio/shared-utils`

**Found while building Slice 10, 2026-09-22.** The slice's file list asserted
*"`libs/ui/components/package.json` — nothing new; Tabler is already there."*
That is wrong, and it was wrong when it was written.

[design-system.md](../../../.claude/rules/design-system.md) requires every
component that takes a `className` to merge it with `cn`, and
[D56](./decisions-d56.md#d56) puts `cn` in `@portfolio/shared-utils`. All five
components this slice adds take a `className`. `ui-components` had no such
dependency — its only two components, `ProfileCard` and `SocialIcon`, never
merged one.

So the package gains `"@portfolio/shared-utils": "workspace:*"` and a matching
tsconfig project reference. `ui-primitives` already depended on it for the same
reason, so no new edge enters the boundary graph: `type:ui-components` →
`type:shared` is already permitted by `tools/eslint/module-boundaries.mjs`.

⚠️ **It surfaced as `NX The workspace is out of sync`, not as a missing
import** — TypeScript resolved `@portfolio/shared-utils` through the workspace
root, so the first signal was Nx's project-reference sync check rather than a
compile error. Worth knowing because the same shape recurs: a new cross-package
import in this repo fails at `nx sync`, one step later than expected.

This is the fourth plan-correction found by building against the plan rather
than by reading it, after [D73](./decisions-d73-d74.md#d73),
[D74](./decisions-d73-d74.md#d74) and [D77](./decisions-d76-d81.md#d77).

<a id="d84"></a>
## D84 — the nav bar is flush to the top of the viewport, full-bleed; the design floats it

**The maintainer's call, 2026-09-22**, overriding the design export.

Both exports draw the nav **floating**: `position:fixed; top:14px; left:14px;
right:14px`, carrying the card's own top radius so it reads as the card's lid.
The site instead pins it **flush** — `inset-x-0; top:0`, full-bleed, square
corners, a hairline bottom rule.

**What follows from it, and what Slice 12 must keep:**

- The bar is wider than the card, so its inner row repeats the page frame's
  measurements — `px-frame`, then `max-w-[1400px]`, then the design's 18px nav
  padding — to put the brand mark on the card's content edge (32px at any
  width) rather than the viewport edge. Deleting that nesting silently
  left-aligns the nav to the window.
- The card's rounded top corners now sit **behind** the bar and are never
  seen. The radius stays: it is the same token the bottom corners read, and the
  frame is still correct whenever the bar is absent.
- ⚠️ **The 56px spacer is now load-bearing in a way it was not while the bar
  floated.** A bar taller than `--spacing-nav` hides that much content, with no
  error and nothing in the specs to catch it. See the mobile case in
  [Slice 10](./slices/10-design-foundation.md#what-this-slice-leaves-open).

The anchor offset is unaffected in principle — `--spacing-anchor` (84px) was
always meant to clear the bar plus breathing room — but it is what makes the
bar's *actual* height matter, which is how D81's split earned its keep.
