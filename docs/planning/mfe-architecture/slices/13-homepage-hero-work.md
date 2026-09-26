# Slice 13 — Homepage A: the specs strip, the hero, and the Work grid

**Status:** ✅ merged with Slices 11, 12 (`ab5c139`, PR #45; [D92](../decisions-d88-d100.md#d92)) · **Visible?** ✅ screen · **Depends on:** Slices 10, 11
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) — drawn ✅

The first half of the homepage remote. Split from
[Slice 14](./14-homepage-experience-contact.md) for review size, not for
independence — **both are the same Nx project and they run in sequence, by one
agent, 13 before 14.**

## Decisions that bind this slice

- **[D77](../decisions-d76-d81.md#d77)** — ⚠️ **the Work grid takes eight cards,
  not the design's six.** The design's project list is a layout spec. The two
  extra items need a background colour and a `span` assigned, and neither is
  drawn anywhere — flag both as invented.
- **[D72](../decisions-d71-d72.md#d72)** — which projects appear on the homepage
  is homepage content. [Slice 11](./11-content-model.md) collapsed the two
  section groups into one ordered `workSlugs`; this slice renders that order and
  does not re-sort.
- **[D81](../decisions-d76-d81.md#d81)** / **[D43](../decisions-d42-d47.md#d43)**
  — ⚠️ the `#work` id comes from `SITE_SECTIONS`, **never a string literal**, and
  the section carries the 84px `scroll-margin-top`.
- **[D15](../decisions-d01-d16.md#d15)** — the homepage never fetches its own
  content; it receives it, with the fixture seam as the default so the remote
  still runs standalone.
- **[D42](../decisions-d42-d47.md#d42)** — the featured image resolves from the
  homepage remote's own origin.
- **[D36](../decisions-d33-d41.md#d36)** — what reaches the SSR HTML versus what
  stays client-side is unchanged by the redesign.

## Open questions blocking this slice

**None — both closed 2026-09-22, before this slice starts.** They are now
decisions that bind it:

- **[D85](../decisions-d85-d87.md#d85)** (closes Q18) — ⚠️ **the featured image
  is not pending, it is gone.** The region keeps its box and fills it
  typographically from the homepage hero's own copy. Nothing renders an `<img>`
  here and nothing reports an image as outstanding.
- **[D87](../decisions-d85-d87.md#d87)** (closes Q21) — the specs strip's fourth
  entry reads **`15+ years shipping`**, authored in Slice 11. ⚠️ Not the
  design's `13+`, which now belongs to the About stat under a different label.

## What this slice delivers

### The specs strip

Five mono items above the hero, each prefixed by an accent `|`, on a
`--color-rule` bottom border. Wraps at `18px 34px`.

### The hero

- A two-column grid above 1080px (`1.6fr / 1fr`, bottom-aligned), one column
  below. ⚠️ **Three breakpoints, not two** — the export distinguishes `<760`,
  `760–1080` and `≥1080`, and the middle one has its own lede layout
  (`1fr auto`, end-aligned). Collapsing to two is a visible regression at tablet
  width.
- `h1` at `clamp(2.9rem, 9.5vw, 7rem)`, line-height `.92`, `text-wrap:balance`,
  with `end to end.` in the accent and a **non-breaking space** inside it.
- Lede at `max-width:42ch`, then two pills: solid "View work" → `#work` with a
  trailing arrow, outline "Get in touch" → `#contact`.
- The featured image at `16/7` (`4/3` on mobile), `22px` radius, with a mono
  caption chip bottom-left and a translucent "Featured" chip top-right.

### The Work grid

Three columns above 760px, one below. Each card:

- `22px` radius, `1.5rem` padding, `min-height:230px`, a column flexed to push
  its body to the bottom.
- A top row: the tech stack in mono, and — when the item is live — a "Live"
  capsule with a 6px accent dot.
- A body: title at `1.5rem` Carlito 700, description at `max-width:38ch`, then a
  bottom row of client and year with a trailing `ti-arrow-up-right`.
- Hover lifts the card `5px`.

⚠️ **Card colour is data, not a class.** The design assigns a per-project
background (`#CFD8F2`, `#BFE6D2`, `#E4D3BC`, `#DCE3C8`, `#DFDBD1`, and ink for
the dark one) and derives foreground, chip and dot from whether it is dark.
Those six values are **not theme tokens** — they are per-item presentation,
authored in [Slice 11](./11-content-model.md)'s fixture, and the component reads
them.

⚠️ **Every card links to `/portfolio/<slug>`**, resolved through the route util,
never a hand-built string and never the export's
`Project Detail.dc.html?p=` form.

## Files this slice creates and modifies

- `libs/features/homepage/src/` — `homepage.tsx` (restructured),
  `homepage-specs-strip.tsx`, `homepage-hero.tsx` (rewritten),
  `homepage-hero-media.tsx`, `homepage-work-section.tsx`,
  `homepage-work-card.tsx`
- `homepage-project-card.tsx` / `homepage-project-section.tsx` — **retired**;
  the two-section listing they drew no longer exists
- Specs for each

Estimated **~16 files**.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-homepage
```

⚠️ **One spec must render the card through `homepage-work-section`**, not the
card alone — [spec-through-the-parent.md](../../../../.claude/rules/spec-through-the-parent.md).
The card gains six new props this slice (`background`, `isDark`, `isLive`,
`client`, `year`, `stack`), all with sensible defaults, and a parent that
forwards five of six is invisible to every card-level spec. That is the exact
shape of the 2026-09-19 hub failure the rule was written from.

## Notes for whoever builds this

- **`one-component-per-file.md`** — the card, the section, the strip and the
  hero media are each their own file. The export's single template is not a
  licence to write one 400-line component.
- **`no-nested-ternary.md`** — the dark-card derivation (`fg`, `chip`, `dot`
  from `isDark`) is where a nested ternary will want to appear. Lift it into a
  named local or a lookup.
- **Report a screenshot at three widths** — 375, 900 and 1400 — because the
  middle breakpoint is the one most likely to be dropped.
