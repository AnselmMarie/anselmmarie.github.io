# Slice 11 — The content model: types, fixtures, and the per-file split

**Status:** not started · **Visible?** — none · **Depends on:** Slice 10
**Design:** [both exports](../design-sources.md) — read for the *field set*, not the copy

The plan's **one invisible slice before the wave**, and the only one
[plan-visible-first.md](../../../../.claude/rules/plan-visible-first.md) permits
in front of the checkpoints that follow. It exists because the last wave
collided in exactly this package, and the fix that worked was settling the
per-file split **before** any agent started
([D67](../decisions-d63-d67.md#d67)).

⚠️ **Solo, unconditionally.** `libs/shared/types` and `libs/shared/fixtures` are
read by all five slices that follow. Nothing runs beside this.

## Decisions that bind this slice

- **[D77](../decisions-d76-d81.md#d77)** — ⚠️ **eight items, not the design's
  six.** The ported slugs win over the design's (`cw-breeze-thru`, not
  `breeze-thru`). The design's project list is read as a **card-grid layout
  spec**, never as a content list.
- **[D78](../decisions-d76-d81.md#d78)** — `description` (HTML) and `videos`
  **stay on the type** and keep their meaning. This slice adds fields; it
  removes none.
- **[D69](../decisions-d69.md#d69)** — `description` remains an HTML string
  sanitized at the render boundary. Unchanged, and the reason it is unchanged
  is D78.
- **[D81](../decisions-d76-d81.md#d81)** — ⚠️ **`SITE_SECTIONS` is NOT edited
  here.** The five new anchors are a three-way contract across two remotes and
  the shell fallback, and [Slice 12](./12-header-redesign.md) re-points all
  three at once. This slice leaves the current three sections alone.
- **[D41](../decisions-d33-d41.md#d41)** — the fixtures hold the site's real
  published copy, not placeholder text. New fields authored here are **real
  content**, held to that standard, and the Contentful plan moves them later.
- **[D29](../decisions-d17-d32.md#d29)** — `type:shared` may depend only on
  `type:shared`. ⚠️ A fixture can never import from `libs/ui/*`, which is why
  [D75](../decisions-d75.md#d75) put `SocialIconName` in `shared-types`. Any new
  icon-name union the design needs goes there for the same reason.
- **[D72](../decisions-d71-d72.md#d72)** — homepage membership lives in
  `HomepageContent`, not on `PortfolioItem`. The design's Work grid is one flat
  list, so `HomepageProjectGroup` changes shape here — see below.

## Open questions blocking this slice

- **[Q21](../open-questions.md#q21)** — ⚠️ **the design contradicts itself on
  the years figure.** Its specs strip says `13+ years shipping`; its About stats
  card says `10+ · Years shipping production front-ends`. Both are in the same
  file. One of them is wrong and this slice cannot pick. **Blocks the specs
  strip and the About stats only** — author every other field, and report these
  two as pending.
- **[Q18](../open-questions.md#q18)** — the hero images. Blocks the `hero` field
  on `PortfolioItem`; the rest of the item is authorable without it.

## What this slice delivers

### `PortfolioItem` gains the design's fields

Additive. Every existing field keeps its name, its type and its meaning.

| New field | Type | Source |
|---|---|---|
| `role` | `string` | authored — "Design & Engineering", "Tech Lead" |
| `lede` | `string` | authored — the one-sentence summary, ~26ch |
| `body` | `readonly string[]` | authored — plain paragraphs, 2–3 per item |
| `tech` | `readonly string[]` | ⚠️ derivable from v3's `subtitle`, but **not derived** — authored per item |
| `facts` | `readonly ItemFact[]` | authored — `{ key, value }`, 3 per item |
| `links` | `readonly ItemLink[]` | authored — `{ label, href, icon }` |
| `hero` | `string` | ⚠️ **blocked on [Q18](../open-questions.md#q18)** |
| `heroCaption` | `string` | authored |

⚠️ **`facts` uses `{ key, value }`, not the design's `{ k, v }`.** The export
abbreviates because it is hand-written template data. Nothing else in this
workspace does, and a two-character field name in a shared type is a cost paid
by every reader forever.

### The two items the design does not cover

`rove-logix-ui-update` and `older-cosmikata` appear in no export. **Every new
field on both is invented**, and this slice's completion report lists them
field by field per
[plan-design-links.md](../../../../.claude/rules/plan-design-links.md) — not as
a single line saying "authored the remaining two".

### `HomepageContent` gains four sections and loses a grouping

The design's homepage is seven blocks where the built one is three. New:

- `specs: readonly string[]` — the five-item strip above the hero
- `hero` gains `lede`, and two CTA targets
- `experience: readonly ExperienceEntry[]` — seven entries, each with
  `company`, `role`, `period`, `place`, `stack`, `points[]`
- `footnotes: readonly PanelNote[]` — the award and the degree
- `about: { statement, paragraphs[], stats[] }`
- `contact: { heading, links[] }`

⚠️ **`HomepageProjectGroup` collapses.** The built homepage renders **two**
project sections with headings; the design renders **one** `#work` grid. The
`projectGroups` array becomes a single ordered `workSlugs: readonly string[]`
plus the per-card presentation (`background`, `isDark`, `isLive`) the design
assigns. This is a real content change, not a rename: the two v3 section
headings stop existing.

### The per-file split, settled here

Named now so the wave that follows cannot collide, exactly as
[D67](../decisions-d63-d67.md#d67) did for the last one. Every module carries an
`OWNER:` banner in its own header.

| File | Owner |
|---|---|
| `types/src/portfolio-item.ts` | **this slice**, then Slice 15 reads only |
| `types/src/homepage-content.ts` | **this slice**, then Slices 13/14 read only |
| `types/src/site-section.ts` | **Slice 12** ([D81](../decisions-d76-d81.md#d81)) |
| `types/src/index.ts` | **coordinator only** |
| `fixtures/src/portfolio-items-*.fixture.ts` (3) | **this slice** |
| `fixtures/src/homepage.fixture.ts` | **this slice** |
| `fixtures/src/site-sections.fixture.ts` | **Slice 12** |
| `fixtures/src/use-content-stub.ts` | **coordinator only** — no slice edits it |
| `fixtures/src/index.ts` | **coordinator only** |

## Files this slice creates and modifies

- `libs/shared/types/src/portfolio-item.ts`, `homepage-content.ts`, the barrel
- `libs/shared/fixtures/src/portfolio-items-{active,other,other-clients}.fixture.ts`
- `libs/shared/fixtures/src/homepage.fixture.ts`
- Specs for each

Estimated **~14 files**.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=shared-types,shared-fixtures
pnpm nx run-many -t typecheck --projects=feature-homepage,feature-portfolio-item
```

⚠️ **Run the consumers' typecheck too**, not just this package's. Every field
added here is additive, so the consumers *should* still compile — and if one
does not, that is the finding, surfaced now rather than inside a wave agent's
worktree.

## Notes for whoever builds this

- **This slice writes no JSX.** If you find yourself editing a `.tsx`, you have
  crossed into Slice 13, 14 or 15.
- **`file-size.md` caps every fixture at 200 lines.** Eight items with body
  copy will not fit one module; the three existing `portfolio-items-*` files
  already split the set and the split stays.
- The design's `href: '#'` on several link pills is a placeholder. Author a real
  URL or omit the link — do not ship a `#`.
