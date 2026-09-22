# Slice 10 — Design foundation: tokens, type, the page frame

**Status:** built, awaiting review (2026-09-22) · **Visible?** ✅ screen · **Depends on:** Slices 5, 6, 7
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) — drawn ✅ (both exports specify the frame identically)

The first slice of the redesign, and the one every other slice reads. It
changes **no content and no section structure** — it replaces the palette, the
typography and the page frame, so that Slices 12–16 have tokens to build
against instead of inventing hex values one component at a time.

⚠️ **Solo. No other slice runs beside it.** It touches `libs/ui/theme`,
`libs/ui/components`, `libs/features/shell` and the root manifests — the four
places [plan-parallelization.md](../../../../.claude/rules/plan-parallelization.md)
names as the ones that serialize everything else.

## Decisions that bind this slice

- **[D76](../decisions-d76-d81.md#d76)** — the `_design/` exports are the design
  of record. ⚠️ **They are a specification, not source.** The exports are
  inline-styled `<x-dc>` templates; nothing in that shape is copied. Every value
  becomes a theme token.
- **[D26](../decisions-d17-d32.md#d26)** — `libs/ui/theme` is the one theme every
  app extends. The new palette goes there, not into an app stylesheet.
- **[D51](../decisions-d48-d52.md#d51)** — Tailwind 4 configures **in CSS**. There
  is no `tailwind.config.ts` to add a font family to; it is an `@theme` block.
- **[D81](../decisions-d76-d81.md#d81)** — ⚠️ **`--spacing-header` splits into two
  tokens.** The nav spacer is 56px and the scroll margin is 84px; the current
  code uses one 4rem token for both. This slice defines both and leaves the old
  one in place until [Slice 12](./12-header-redesign.md) removes its last reader.
- **[D25](../decisions-d17-d32.md#d25)** — `libs/ui/primitives` is generated shadcn
  output and is **never hand-edited**. New shared components go in
  `libs/ui/components`.
- **[D40](../decisions-d33-d41.md#d40)** — primitives are pulled on demand, never
  speculatively. If a section needs a shadcn primitive, the slice that needs it
  pulls it; this slice pulls none in anticipation.
- **[D56](../decisions-d56.md#d56)** — `cn` is the one `clsx` + `tailwind-merge`
  helper in `@portfolio/shared-utils`. Every new component takes a `className`
  and merges with it.
- **[D83](../decisions-d82-d83.md#d83)** — ⚠️ **this slice's file list was
  wrong about `libs/ui/components/package.json`.** It said "nothing new"; all
  five components take a `className` and so need `cn`, which lives in
  `@portfolio/shared-utils` — a package `ui-components` did not depend on.
- **[D75](../decisions-d75.md#d75)** — icons are Tabler, already a dependency of
  `libs/ui/components`. The design needs seven more marks than `SocialIcon`
  draws; they are pulled from the same package.

## Open questions blocking this slice

- ✅ **[Q20](../questions-closed-q9-q16.md#q20) — closed 2026-09-22 →
  [D82](../decisions-d82-d83.md#d82).** The maintainer chose the Google Fonts
  CDN. ⚠️ **It must be a `<link>`, not a CSS `@import`** — the `@import` was
  written first and Vite silently dropped it, leaving the page in system faces
  with every gate green. Slice 8 inherits the CSP entries D82 names.

**Nothing blocks this slice.** Q18, Q19 and Q21 belong to Slices 11, 13, 14
and 15 and none of them touches a token, a component or the frame.

## What this slice delivers

### The palette, as `@theme` tokens

Nine colours, read off the exports. Names are semantic, not literal — the
design's `#EAE7DE` is the paper the whole site sits on, so it is `--color-paper`
and never `--color-bone`.

| Token | Value | What it is in the design |
|---|---|---|
| `--color-backdrop` | `#0E1A19` | the page behind the rounded card |
| `--color-paper` | `#EAE7DE` | the card itself, and the nav's translucent base |
| `--color-ink` | `#14211E` | body text, and the dark sections' background |
| `--color-accent` | `#1C7A5E` | the green full stop, the `|` marks, link hover |
| `--color-accent-bright` | `#3FD9A4` | the mint used **only on dark**; never on paper |
| `--color-muted` | `#635E55` | secondary copy, eyebrow text on paper |
| `--color-rule` | `#D5D0C4` | every hairline border |
| `--color-surface` | `#F3F1EB` | the alternating section background |
| `--color-surface-sunk` | `#DFDBD1` | image placeholders, the "Get in touch" hover |

⚠️ **`--color-page` and `--color-ink`'s current value both change.** `--color-page`
was `#ffffff` and is retired in favour of the backdrop/paper pair — there is no
white anywhere in the new design. `--color-ink` was slate-700 and becomes
`#14211E`. Every existing component reading either token changes appearance
without being edited, which is the intended blast radius and is why this slice
is visible.

### The type scale

Three families, each with one job:

- **Carlito**, weight 700 — every display heading and the brand mark. Tight
  tracking (`-.02em` to `-.04em`), line-height `.92`–`1.15`.
- **JetBrains Mono** — eyebrows and meta rows only: `.58rem`–`.62rem`,
  `letter-spacing:.14em`, `text-transform:uppercase`. This treatment appears
  **eleven times** across the two exports and is the single most repeated
  pattern in the design, which is why it becomes a component below rather than
  a class string.
- **Inter** — body copy, `.82rem`–`1rem`, line-height `1.55`–`1.8`.

`@theme` gains `--font-display`, `--font-mono` and `--font-body`, plus the
fluid display sizes the design states as `clamp()`.

### The page frame, in `libs/features/shell`

The shell's layout becomes: `--color-backdrop` full-bleed, `14px` inset on
three sides, and a `max-width:1400px` `--color-paper` card with
`border-radius` `26px` (`16px` under 760px) and `overflow:hidden`.

⚠️ **`overflow:hidden` on the card is load-bearing and easy to lose.** Every
dark section in the design runs edge to edge and is clipped to the card's
corner radius by it. Drop it and the `#contact` block's square corners punch
through the rounded frame.

### The shared components every later slice reads

In `libs/ui/components` ([D29](../decisions-d17-d32.md#d29)'s threshold is met
by inspection, not anticipation — each of these has **three or more** call sites
across the two exports):

| Component | Call sites | What it draws |
|---|---|---|
| `Eyebrow` | 11 | the mono `| Label` treatment, with the accent rule |
| `SectionHeading` | 6 | eyebrow + display heading with a coloured trailing phrase |
| `PillLink` | 9 | the `border-radius:999px` action, `solid` and `outline` |
| `MetaChip` | 7 | the small mono capsule — "Live", "Featured", hero captions |
| `PanelCard` | 5 | the `18px`-radius bordered card on `--color-surface` |

Each ships with a spec and takes `className` through `cn`.

⚠️ **`SectionHeading` renders a two-tone heading** — "Things I've **shipped.**"
with the second phrase in the accent. It takes the two halves as separate props
rather than parsing a string, because the split point is editorial and a parser
would guess it.

### The fallbacks, re-skinned

`libs/features/shell/src/fallbacks/*` are shell-owned and were drawn against the
white palette. All five (four remote fallbacks plus the not-found) move to the
new tokens **in this slice**, by the coordinator — not by the wave slices that
follow, which never touch `apps/shell` or `libs/features/shell`.

## What this slice leaves open

### ⚠️ The bar is taller than its spacer at mobile widths

`--spacing-nav` is 56px, which is the height of the **design's** nav. The bar
actually on the page is still Slice 3's header remote, and at 375px its brand
mark and three links wrap onto two lines, making the bar **81px**. The spacer
is 56px, so **25px of the page's first content sits under the bar** at mobile
widths. At desktop it measures 57px against the 56px spacer and clears
correctly.

**This closes in [Slice 12](./12-header-redesign.md) without further work
here:** the design's mobile nav is a 44px hamburger, not wrapped links, so the
bar is 56px at every width once that slice lands.

It is recorded rather than patched because every available patch is worse than
the wait: widening the spacer hard-codes a number the design contradicts,
sizing it from the bar needs a `ResizeObserver` in a slice whose job is tokens,
and restyling the nav *is* Slice 12.

⚠️ **The same shape caused a 41px desktop overlap earlier in this slice**, from
the same cause — the remote's `h-header` (64px) plus the bar's own padding made
it 97px. That reader is now gone, which is what took desktop from −41px to
+27px of clearance. Mobile is the remainder.

### The five components are not mounted anywhere yet

`Eyebrow`, `SectionHeading`, `PillLink`, `MetaChip` and `PanelCard` have specs
and are exported, but no app renders one until Slices 12–16. Per
[design-system.md](../../../../.claude/rules/design-system.md) that means they
carry [R3](../risks.md#r3)'s exposure until something mounts them: a class that
fails to survive Tailwind's `@source` detection renders unstyled, not broken.

Mitigated, not eliminated: every utility the five emit was applied in the
running page and read back off `getComputedStyle`, and `libs/ui/components/src`
already has its `@source` line. `text-display` is the one token deliberately
left unverified-in-place — it is unused, so Tailwind tree-shakes it; it was
proved correct by a temporary probe (97.28px = 9.5vw, line-height ×0.92,
tracking ×−0.04) that was then reverted.

### `--spacing-header` now has zero readers

D81 assigned its removal to Slice 12, on the reasoning that the token's readers
were spread across the three-way `SITE_SECTIONS` contract. They were not — they
were four spacing call sites, and the anchor-offset fix re-pointed all four.
The token is still defined and is now inert; Slice 12 can delete the line.

⚠️ **Deleting it is not purely cosmetic under independent deployment.** A
header remote built before this change still asks for `h-header`, and the class
is only generated if some source in the shell's `@source` set still names it.
An old remote against a new shell would get no height rather than a wrong one —
it degrades to content height. Worth knowing when [Slice 8](./08-independent-deployment.md)
makes skew real.

## Files this slice creates and modifies

- `libs/ui/theme/src/theme.css` — the whole `@theme` block, rewritten
- `libs/ui/components/src/` — five new components + five specs + the barrel
- `libs/features/shell/src/shell-layout.tsx` and the three region components
- `libs/features/shell/src/fallbacks/*.tsx` (5) + their specs
- `libs/features/shell/src/portfolio-not-found.tsx` + spec
- `apps/shell/src/styles.css` — the font `@import` or `@font-face` block (Q20)
- `libs/ui/components/package.json` — nothing new; Tabler is already there
- Root manifests **only if Q20 resolves to self-hosting** a font package

Estimated **~34 files**, well under the 250 cap.

## Gates

```bash
pnpm nx run-many -t typecheck lint test
pnpm check:file-size
```

And the one that matters, because none of the above can catch it:

⚠️ **Look at the page.** [R3](../risks.md#r3) is a demonstrated failure in this
repo ([D51](../decisions-d48-d52.md#d51)): Tailwind 4 skips `node_modules`, every
workspace lib is a symlink there, and a missing `@source` line renders a
component **completely unstyled with a green build**. This slice adds five new
components in `libs/ui/components` — a directory that already has its `@source`
line — but it also changes every colour in the theme, so a token that silently
fails to resolve looks identical to a token that resolved to the old value.
Boot the shell and confirm the backdrop is dark and the card is rounded.

## Notes for whoever builds this

- **Do not port a single inline style.** The exports carry `style="..."` on
  nearly every element because that is what the bundler emits. Read them for
  values; write Tailwind classes against the tokens.
- **The mint `#3FD9A4` never appears on paper.** In both exports it is used
  exclusively inside `--color-ink` sections. `#1C7A5E` is its paper counterpart.
  A component that takes an accent prop should make that impossible rather than
  document it.
- **Report a screenshot** ([plan-visible-first.md](../../../../.claude/rules/plan-visible-first.md)).
  This slice's entire deliverable is that the site looks different; a file list
  proves nothing about it.
