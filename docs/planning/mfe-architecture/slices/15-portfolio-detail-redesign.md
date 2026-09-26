# Slice 15 — Portfolio detail: the new page, plus the two blocks the design omits

**Status:** ✅ merged (`6073c9f`, PR #46) · **Visible?** ✅ screen · **Depends on:** Slices 10, 11
**Design:** [`_design/Anselm Marie Project Detail.html`](../../../../_design/Anselm%20Marie%20Project%20Detail.html) — drawn ✅ · ⚠️ **does not cover the rich-text body or the videos** — see [D78](../decisions-d76-d81.md#d78)

Owns `apps/portfolio-item` + `libs/features/portfolio-item`, plus the `head`
function of the shell's `$slug` route. The slice with the most invented surface
in the redesign, because the maintainer chose to keep two content blocks the
design does not draw.

## Decisions that bind this slice

- **[D78](../decisions-d76-d81.md#d78)** — ⚠️ **the HTML `description` and the
  videos are kept and rendered, below the design's body.** The design has no
  slot for either. **Every control in both blocks is invented** and is flagged
  control by control in this slice's report, the same way Slice 4's fallbacks
  were.
- **[D69](../decisions-d69.md#d69)** — `description` stays an HTML string,
  sanitized with `dompurify` **at the render boundary, client-side only**. Never
  a bare `dangerouslySetInnerHTML`, never read as text. The existing
  `sanitize-item-html.ts` survives the redesign unchanged.
- **[D77](../decisions-d76-d81.md#d77)** — the slug is the ported v3 `id`. The
  design's `?p=breeze-thru` form is an artifact of a static bundle; the route is
  `/portfolio/cw-breeze-thru`.
- **[D73](../decisions-d73-d74.md#d73)** — ⚠️ **the shell passes the resolved
  item to the remote.** This was broken once and fixed; a restructure of the
  component tree is exactly where it breaks again.
- **[D66](../decisions-d63-d67.md#d66)** — an unknown slug is a **shell-level
  not-found**, never a remote fallback. Unchanged, and re-skinned by
  [Slice 10](./10-design-foundation.md), not here.
- **[D48](../decisions-d48-d52.md#d48)** — the route's meta `description` is
  authored plain text in `route-metadata.fixture.ts`. ⚠️ It is **not** the
  item's new `lede`, however similar they read, and it is never derived by
  stripping tags from `description`.
- **[D79](../decisions-d76-d81.md#d79)** — the dark "Want the deeper
  walkthrough?" block is **this remote's**; the strip beneath it is the footer
  remote's. Stop at the rule.

## Open questions blocking this slice

**None — both closed 2026-09-22, before this slice starts.** They are now
decisions that bind it, and both change what this slice builds:

- **[D85](../decisions-d85-d87.md#d85)** (closes Q18) — ⚠️ **the hero is
  typographic.** Keep the `16/7` desktop / `4/3` mobile box and fill it with the
  item's Work-card treatment (`background`, `isDark`) carrying `title`, `role`
  and `lede`. `item.hero` does not exist — Slice 11 does not author it — so any
  code reading it is a mistake, not a pending asset.
- **[D86](../decisions-d85-d87.md#d86)** (closes Q19) — **derive** each tile:
  landscape → `span 2` at `16/9`, portrait → `span 1` at `3/4`, `object-fit:
  cover`, labels dropped. Read the ratio from the fixtures' authored
  `width`/`height`, which are display dimensions but preserve the ratio exactly.
  ⚠️ **It is 35 gallery images, not the 43 this slice's prose said** — the other
  eight are `thumbnail`. ⚠️ `cr-caterpillar` has one image, so its gallery is a
  single `span 2` tile; that is correct output.

## What this slice delivers

### The top bar

⚠️ **Not the five-link nav.** The detail export draws a brand link and an
`← All work` link only. That variant is [Slice 12](./12-header-redesign.md)'s
deliverable and arrives from the Header remote — **this slice does not draw a
bar.** It is named here only so nobody builds a second one.

### Header and links

- A mono meta row: client, year, role, each with an accent `|`.
- Title at `clamp(2.6rem, 7vw, 5.4rem)` with an accent full stop appended.
- A `Links` column of pills — the first solid ink, the rest outlined, each with
  a Tabler mark. Two columns above 1080px, one below.

### Hero

`16/7` (`4/3` on mobile), `22px` radius, a mono caption chip bottom-left.
⚠️ **Typographic, not photographic** ([D85](../decisions-d85-d87.md#d85)): the box keeps
its ratio and radius, and its fill is the item's Work-card treatment carrying `title`,
`role` and `lede`. There is no `<img>` and no `item.hero`.

### Technologies, facts, and the summary

On `--color-surface`, two columns above 1080px (`1fr / 1.5fr`):

- **Left:** tech as `999px` chips on paper with a rule border, then the facts as
  a stack of rule-topped `key` / `value` pairs.
- **Right:** the lede at `clamp(1.4rem, 2.8vw, 2.2rem)`, `max-width:26ch`, then
  the body paragraphs at `max-width:62ch`.

### ⚠️ The rich-text block — invented

Below the summary column, the sanitized `description` HTML. The design draws no
container for it, so the container is ours: same `62ch` measure, same body type,
and a styled `<ul>`/`<a>` treatment that matches the design's body copy.

Flag in the report: the heading (if any), the placement, the measure, the list
marker, and the link treatment — five controls, five lines.

### ⚠️ The video block — invented

Where an item has videos, a YouTube embed per entry with its title and plain-text
description. **The only third-party iframe on the site.** Draw it from the
design's vocabulary — `22px` radius, sunk-surface poster, mono caption — but say
plainly that nothing in the design authorises it.

### Gallery

Two columns above 760px, one below, `22px` radius, per-image `span` and `ratio`
**derived here, not authored** ([D86](../decisions-d85-d87.md#d86)): landscape →
`span 2` at `16/9`, portrait → `span 1` at `3/4`, `object-fit: cover`. The ratio comes
from the fixtures' authored `width`/`height`, which are display dimensions but preserve
the ratio exactly.

⚠️ **The export's "Drop images here" label is an instruction to the designer,
not copy.** It does not ship.

### The dark next block

Heading with a mint phrase, two pills — solid mint "Get in touch" → `/#contact`,
outlined "More work" → `/#work` — then stop at the rule.

## Files this slice creates and modifies

Grouped by page region, one folder per region, per the lib section-folder rule
(`.claude/rules/lib-section-folders.md`). Each file sits with its spec. A file
used by only one region lives in that region's folder, and folders are one
level deep.

Under `libs/features/portfolio-item/src/`:

| Folder | Files | |
|---|---|---|
| `portfolio-item/` | `portfolio-item.tsx` | restructured: composes the regions below |
| | `portfolio-item-unavailable.tsx` | **moved in** from its own folder, contents unchanged. The page is its only importer |
| `portfolio-item-header/` | `portfolio-item-header.tsx` | rewritten: title + meta row + links |
| | `portfolio-item-meta-row.tsx` | new |
| | `portfolio-item-links.tsx` | new |
| `portfolio-item-hero/` | `portfolio-item-hero.tsx` | new, typographic ([D85](../decisions-d85-d87.md#d85)) |
| `portfolio-item-overview/` | `portfolio-item-overview.tsx` | ⚠️ **new, and not in the earlier list**: the two-column section on `--color-surface` that holds the next four |
| | `portfolio-item-tech-chips.tsx` | new (left column) |
| | `portfolio-item-facts.tsx` | new (left column) |
| | `portfolio-item-summary.tsx` | new (right column: lede + body) |
| | `portfolio-item-description.tsx` | **moved in** and re-skinned. Renders below the summary, in the right column ([D78](../decisions-d76-d81.md#d78)) |
| | `sanitize-item-html.ts` | **moved in, contents unchanged** ([D69](../decisions-d69.md#d69)). The description is its only importer |
| `portfolio-item-videos/` | `portfolio-item-videos.tsx` | re-skinned ([D78](../decisions-d76-d81.md#d78)) |
| `portfolio-item-gallery/` | `portfolio-item-gallery.tsx` | rewritten: tiles derived per [D86](../decisions-d85-d87.md#d86) |
| `portfolio-item-next-block/` | `portfolio-item-next-block.tsx` | new ([D79](../decisions-d76-d81.md#d79)) |

`index.ts` is unchanged: it exports `PortfolioItem` only.

Two placement calls, recorded so they read as decisions:

- **The description lives in `portfolio-item-overview/`**, because "below the
  summary column" puts it inside that section's right column, not after the
  section. If the build finds it reads better full-width under the section, it
  moves to its own `portfolio-item-description/` folder and the page renders it.
- **The sanitizer moves with the description.** It stays a separate file with
  its own spec. Only its folder changes.

Outside the lib:

- `apps/shell/src/routes/portfolio.$slug.tsx` — ⚠️ **the `head` function only**,
  the same narrow exception Slice 7 held. The component body, the imports and
  the not-found branch stay as they are.

Estimated **~31 files**: 8 new components and their specs (16), 5 rewritten or
re-skinned components and their specs (10), 2 moved units with their specs (4),
and the route (1). The earlier ~26 left out the overview and the two moves.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-portfolio-item
```

⚠️ **Re-prove [D73](../decisions-d73-d74.md#d73) after the restructure.** Load
three different slugs in a browser and confirm each renders its own item. The
bug that shipped once was the shell resolving the right item and never passing
it — a component-level spec that hands the item in directly cannot see it, which
is [spec-through-the-parent.md](../../../../.claude/rules/spec-through-the-parent.md)
exactly.

## Notes for whoever builds this

- **The sanitizer is not optional and not negotiable.** If the restructure makes
  it awkward, the restructure is wrong.
- **`file-size.md`** — thirteen components is not over-decomposition here: the
  page has seven regions, and three of those regions are built from parts.
- Keep the invented-block flags **as you build**, not reconstructed at the end.
  The design-links rule asks for a control-by-control list and it is much
  cheaper written live.
