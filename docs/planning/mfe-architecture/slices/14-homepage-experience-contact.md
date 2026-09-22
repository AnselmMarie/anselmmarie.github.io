# Slice 14 — Homepage B: Experience, Skills, About, Contact

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 13
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) — drawn ✅

The second half of the homepage remote, and the larger one: four sections that
have **no counterpart at all** in the built site. Same Nx project as
[Slice 13](./13-homepage-hero-work.md), so it runs after it, by the same agent.

## Decisions that bind this slice

- **[D79](../decisions-d76-d81.md#d79)** — ⚠️ **the dark `#contact` block is
  homepage content, and the strip beneath it is the footer remote's.** This
  slice renders the block and **stops at its bottom rule**. It does not draw the
  copyright row, the two icon links, or the tagline; those are
  [Slice 16](./16-footer-strip.md)'s and they arrive over the federation
  boundary.
- **[D81](../decisions-d76-d81.md#d81)** / **[D43](../decisions-d42-d47.md#d43)**
  — `#experience`, `#skills`, `#about` and `#contact` all come from
  `SITE_SECTIONS`. Four of the five anchors in the nav land in this slice, so it
  is where a literal would do the most damage.
- **[D41](../decisions-d33-d41.md#d41)** — the experience entries are real
  published copy, not placeholder text.
- **[D15](../decisions-d01-d16.md#d15)** — content arrives as props with the
  fixture seam as the default.

## Open questions blocking this slice

- **[Q21](../open-questions.md#q21)** — the `10+` stat card. Blocks one value.

## What this slice delivers

### Experience — a seven-entry accordion

- A `--color-rule` top border, one bordered row per entry.
- **Closed row:** company at `clamp(1.15rem, 2.2vw, 1.6rem)` Carlito 700, role
  in muted, the period in mono on the right (hidden below 760px), then a 30px
  circular control holding `ti-plus` / `ti-minus`. Open, the circle fills with
  the mint.
- **Open body:** two columns above 760px (`1fr / 1.1fr`) — a mono meta column
  (period on mobile only, place, then the stack in accent at `max-width:28ch`)
  and a points column, each point prefixed by an accent `|`.
- ⚠️ **One open at a time, and index `0` open on load.** The export's state is a
  single `open` index, and toggling the open one sets `-1`. Reproduce that,
  including the initial open — a closed-by-default accordion looks like an
  empty section.

⚠️ **This is the site's first interactive disclosure.** It needs
`aria-expanded`, `aria-controls` and a real `<button>` — the export uses a click
handler on a `<div>` and gives it none. Flag that as a **deliberate divergence
from the design**, not a silent fix.

### Two footnote cards

`PanelCard` ([Slice 10](./10-design-foundation.md)) × 2, auto-fit at a 260px
minimum: the AT&T award and the BFA.

### Skills — the dark section

`--color-ink` background, mint eyebrow, a two-line heading with
`white-space:nowrap`, then four groups auto-fit at a 160px minimum. Each group
is a 14%-white top rule, a mono label, and a plain column of items.

⚠️ **The built site has three skill groups; the design has four**, and they are
differently named. `HomepageSkillGroup`'s `cardId` — which existed to make two
columns share one bordered card in v3 — has **no meaning in this design** and is
retired in [Slice 11](./11-content-model.md).

⚠️ **`white-space:nowrap` on a `clamp()` heading will overflow** at some narrow
width. The export does it anyway. Test at 320px and report what you did.

### About

Two columns above 760px (`1.2fr / 1fr`): a statement at
`clamp(1.6rem, 3.4vw, 2.7rem)` with two bolded phrases (the second in accent),
two body paragraphs at `max-width:46ch`, and a stacked pair of stat cards —
a `2.4rem` figure baseline-aligned against its label.

### Contact — the dark block, without the strip

`--color-ink`, centred, mint eyebrow, a heading at
`clamp(2.6rem, 7vw, 5.4rem)` with `white-space:nowrap` (same caveat), and a
single mint LinkedIn pill. It ends at the 10%-white top rule that the footer
strip sits below.

## Files this slice creates and modifies

- `libs/features/homepage/src/` — `homepage.tsx` (composition),
  `homepage-experience-section.tsx`, `homepage-experience-entry.tsx`,
  `homepage-footnotes.tsx`, `homepage-skills.tsx` (rewritten),
  `homepage-skill-group.tsx` (rewritten), `homepage-about-section.tsx`,
  `homepage-stat-card.tsx`, `homepage-contact-block.tsx`
- Specs for each

Estimated **~20 files**.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-homepage
```

⚠️ **The accordion spec must be seen failing**
([prove-the-spec-can-fail.md](../../../../.claude/rules/prove-the-spec-can-fail.md)).
A spec asserting "the body renders when open" passes trivially against a body
that is always in the DOM — which is exactly what the export's `display:none`
approach produces. Break the toggle, confirm with `git diff` that the edit
landed, and watch it go red.

## Notes for whoever builds this

- **`file-size.md` caps each file at 200 lines.** Seven accordion entries with
  four-point bodies is a lot of markup; the entry is its own component for that
  reason.
- **Do not render the footer strip**, however wrong the section looks ending at
  a bare rule in isolation. Run the composed shell to see it whole.
- The mint `#3FD9A4` is correct in all four of this slice's dark contexts and
  wrong in the two paper ones. [Slice 10](./10-design-foundation.md)'s component
  API should already prevent the mistake.
