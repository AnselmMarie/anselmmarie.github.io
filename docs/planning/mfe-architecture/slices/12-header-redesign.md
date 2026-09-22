# Slice 12 — Header: the floating nav and the mobile overlay

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slices 10, 11
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) — drawn ✅ · the detail export draws a **different, simpler** bar (see below)

First slice of the redesign wave. It owns `apps/header` + `libs/features/header`
— **and one file outside them**, because the section-id contract cannot be
re-pointed piecemeal.

## Decisions that bind this slice

- **[D81](../decisions-d76-d81.md#d81)** — ⚠️ **this slice owns the
  `SITE_SECTIONS` change, and nothing else may touch it.** The five new anchors
  (`work`, `experience`, `skills`, `about`, `contact`) are written by the
  Homepage remote, read by this remote, and read again by the shell's header
  fallback. Three independently deployed units; a rename two of them follow
  **scrolls nowhere and throws nothing**.
- **[D43](../decisions-d42-d47.md#d43)** — the header is fixed, so anchored
  sections need scroll margin. ⚠️ D81 splits that into **two** numbers: a 56px
  nav spacer and an 84px scroll margin. They are not the same and neither is
  derived from the other.
- **[D59](../decisions-d58-d62.md#d59)** — **retired by
  [D76](../decisions-d76-d81.md#d76).** The Header is no longer invented; it has
  a design. D59 stays in the log as the record of the interim.
- **[D63](../decisions-d63-d67.md#d63)** — the section list lives in
  `@portfolio/shared-fixtures` and the shell's fallback is its third reader.
  That is precisely why this slice is the only one allowed to change it.
- **[D42](../decisions-d42-d47.md#d42)** — assets resolve from the remote's own
  origin, not the shell's.

## Open questions blocking this slice

**None.**

## What this slice delivers

- **The floating nav**, positioned `fixed` inside the card's inset and inheriting
  its top corner radius. Translucent `--color-paper` at 92% with a 14px backdrop
  blur, a `--color-rule` bottom border.
- **A three-column grid at ≥760px** — brand left, five centred links, an empty
  right cell that balances the brand. Below 760px it becomes two columns and the
  links are replaced by the menu control.
- **The mobile overlay** — a full-width `--color-ink` panel below the bar, each
  item at `1.9rem` Carlito 700 with a trailing `ti-arrow-up-right` in the mint,
  separated by 10%-white rules. Opening it animates the two 20×1.5px bars into
  an X.
- **`SITE_SECTIONS` re-pointed** to the design's five, in
  `libs/shared/fixtures/src/site-sections.fixture.ts`, with
  `libs/shared/types/src/site-section.ts` unchanged in shape.

### ⚠️ The two exports disagree about the bar, and that is not a defect

The detail export draws **no nav links at all**: just the brand and an
`← All work` link back to `/#work`. The homepage export draws the full five-link
nav. Both are correct — the anchors point at homepage sections that do not exist
on a detail page, so a five-link nav there would scroll nowhere.

So the Header remote renders **two variants**, chosen by the host route, and the
variant is a prop the shell passes — not something the remote infers from
`window.location`, which it cannot do during SSR.

⚠️ **This is a new prop crossing the federation boundary**, which makes it the
case [spec-through-the-parent.md](../../../../.claude/rules/spec-through-the-parent.md)
exists for: a spec must render the **shell's header region** and assert the
variant arrives, because a default that silently wins renders the wrong bar on
every detail page and nothing fails.

## Files this slice creates and modifies

- `libs/features/header/src/` — `header.tsx`, `header-nav.tsx`,
  `header-nav-link.tsx`, new `header-menu-overlay.tsx`,
  `header-menu-toggle.tsx`, `header-brand.tsx`, `header-back-link.tsx`
- `libs/features/header/src/header-sections.const.ts` — retired or re-pointed
- `libs/shared/fixtures/src/site-sections.fixture.ts` + spec — **the contract**
- `libs/features/shell/src/shell-header-region.tsx` — passes the variant
- `libs/features/shell/src/fallbacks/header-fallback.tsx` — the five new anchors
- Specs for all of the above

Estimated **~20 files**.

⚠️ **Two of those are outside this slice's own projects** — the fixture and the
shell region. They are listed in [parallelization.md](../parallelization.md)'s
shared-file table and **no other wave slice may open them**.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-header,shared-fixtures,feature-shell
```

Plus, because the contract fails silently:

⚠️ **Click all five anchors in a browser and watch the page scroll**, with the
Homepage remote up. Then stop the Header remote and click all five in the
**fallback**. A spec cannot catch an id that agrees with itself in two places
and disagrees in the third.

## Notes for whoever builds this

- **The overlay is `display:none`, not unmounted**, in the design. Unmounting is
  fine and probably better — but then the open/close animation needs to survive
  it, so decide deliberately rather than by accident.
- **The menu control is an `<a>` in the export.** It is a button. Ship a
  `<button>` with the `aria-expanded` the export omits.
- `scroll-margin-top` belongs on the **sections** (Slice 13/14), not here. This
  slice only defines what the number has to be.
