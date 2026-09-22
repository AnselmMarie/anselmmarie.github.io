# Decisions D76–D81 — the 2026-09-22 redesign

The six decisions taken when the maintainer supplied two new design exports that
replace the look of every surface in the plan. Taken together on 2026-09-22,
before any slice was written, because each one changes what the redesign slices
are allowed to contain.

⚠️ **This is the second time this plan's design source has moved** — see
[D34](./decisions-d33-d41.md#d34), which nominated the live v3 site. Read D76
as superseding D34's *design* half only; D34's content half survives through
[D53](./decisions-d53.md#d53).

---

<a id="d76"></a>
## D76 — the two `_design/` exports supersede the live v3 site as the design source

**Maintainer's call, 2026-09-22.** `_design/Anselm Marie Portfolio.html` and
`_design/Anselm Marie Project Detail.html` are now the design of record for
**every surface in the plan**, not just the two pages they are named after.
Both files draw the nav, the page frame and the footer strip, so there is no
coherent reading in which they cover only the homepage and the detail page.

What this does and does not move:

| | Before | After |
|---|---|---|
| **Design** (what it looks like) | the live v3 site, `39bbe56` ([D34](./decisions-d33-d41.md#d34)) | the two `_design/` exports |
| **Content** (what it says) | `39bbe56` ([D53](./decisions-d53.md#d53)) | unchanged — see [D77](#d77) |
| **Implementation** | no v3 code is ported ([D6](./decisions-d01-d16.md#d6)) | unchanged, and now also: no `_design` code is ported |

⚠️ **The exports are not source to copy.** They are Claude Design bundles: a
`<x-dc>` template with `{{ }}` bindings, `sc-for` loops and inline `style`
attributes, driven by a `DCLogic` class. Nothing in that shape survives into
this workspace — no inline styles, no `sc-*` elements, no `DCLogic`. What
carries over is the **visual specification**: the palette, the type scale, the
spacing, the section order, and the control set. Every value is re-expressed as
a theme token ([D26](./decisions-d17-d32.md#d26)) and a Tailwind class, per
[design-system.md](../../../.claude/rules/design-system.md).

**Two Header/Footer rows stop being invented.** [D59](./decisions-d58-d62.md#d59)
and [D70](./decisions-d70.md#d70) recorded that v3 had no header and no footer,
so Slices 3 and 5 invented both. The new exports draw both, so those surfaces
now **have** a design and the invention is retired rather than blessed. D59 and
D70 stay in the log as the record of how the interim version was arrived at.

**The link targets map to app routes**, mechanically and without further
decision: `Portfolio Landing.dc.html` → `/`, `Portfolio Landing.dc.html#work` →
`/#work`, and `Project Detail.dc.html?p=<slug>` → `/portfolio/$slug`. The query
parameter the export uses is an artifact of being a static bundle; it does not
survive.

---

<a id="d77"></a>
## D77 — the eight ported items survive; the design's six-project set is not adopted

**Maintainer's call, 2026-09-22.** The design's `raw` array lists six projects.
The fixtures hold **eight**, ported from `39bbe56` and settled as eight by
[D71](./decisions-d71-d72.md#d71). The eight win.

| In the design, not in the fixtures | In the fixtures, not in the design |
|---|---|
| — | `rove-logix-ui-update` |
| — | `older-cosmikata` |

and four of the design's six carry slugs that differ from the ported ones —
`breeze-thru` vs `cw-breeze-thru`, `caterpillar-news` vs `cr-caterpillar`,
`csp-generator` vs `csp-generator-app`. ⚠️ **The ported slug wins in every
case.** The slug is the `/portfolio/$slug` segment and it is v3's `id` carried
over unchanged; renaming it would break every URL the old site published.

So the design's project list is read as **a layout specification for a card
grid, not a content list**. The grid takes eight cards rather than six, and the
per-card colour assignment (`bg`, `dark`, `live`) is extended to the two extra
items rather than being dropped.

**The new per-project fields are authored, not ported.** `lede`, `body[]`,
`facts[]`, `tech[]`, `links[]`, `role` and `heroCaption` have no v3 origin —
the design invents them for its six. Slice 11 authors all eight sets. ⚠️ **For
the two the design does not cover at all, every field is invented**, and
[Slice 11](./slices/11-content-model.md) flags them item by item per
[plan-design-links.md](../../../.claude/rules/plan-design-links.md).

---

<a id="d78"></a>
## D78 — the HTML `description` and the videos are kept, and are blocks the design does not draw

**Maintainer's call, 2026-09-22.** The design's detail page has no rich-text
body and no video embed: its body copy is `body[]`, an array of plain
paragraphs. The ported items have both.

**Both are kept and rendered.** Consequences, each of which is the point of
writing this down:

- **[D69](./decisions-d69.md#d69) stands.** `description` stays an HTML string
  sanitized with `dompurify` at the render boundary, client-side only. The
  `dompurify` dependency in `libs/features/portfolio-item` stays. Had the
  design's content been adopted wholesale, D69 and its sanitizer would have
  lost their subject entirely.
- **The item now carries two body fields** — `lede` + `body[]` from the design,
  and `description` from v3 — and they overlap in purpose. Slice 15 renders the
  design's pair in the design's slot and the HTML `description` as an
  additional block **below** it. That ordering is a choice, not a design
  instruction.
- ⚠️ **The rich-text block and the video block are invented UI.** The design
  draws neither, so per
  [plan-design-links.md](../../../.claude/rules/plan-design-links.md) every
  control in them is flagged control by control in
  [Slice 15](./slices/15-portfolio-detail-redesign.md)'s report. This is the
  same category as the fallbacks and the not-found screen, not the same
  category as the sections the design specifies.

---

<a id="d79"></a>
## D79 — the footer remote keeps the strip only

**Maintainer's call, 2026-09-22.** In both exports the footer sits as the bottom
row of a **dark section that belongs to the page above it** — `#contact` on the
homepage, the "Want the deeper walkthrough?" block on the detail page. The two
dark blocks differ; the strip beneath them is byte-identical.

The split follows the strip, not the block:

| Element | Owner |
|---|---|
| The dark `#contact` block — eyebrow, "Open to new work. Let's talk.", the LinkedIn pill | **homepage remote** |
| The dark "Want the deeper walkthrough?" block — heading, two pills | **portfolio-item remote** |
| The strip — `© 2026 Anselm Marie`, the two circular icon links, `Senior SWE · Tech Lead` | **footer remote** |

**Why the strip and not the whole block.** The block is different on each page
and the strip is not; a remote that rendered the block would need a variant per
host page, which is the coupling the remote boundary exists to avoid. Keeping
the strip preserves **four remotes**, which is what
[D33](./decisions-d33-d41.md#d33) makes the tiebreaker: the architecture is the
portfolio piece.

⚠️ **The cost, stated plainly:** one visual section is now composed from two
independently deployed units, and the seam is invisible when both are up. When
the footer remote is down, the dark block renders and its bottom rule sits above
the footer fallback. [Slice 16](./slices/16-footer-strip.md) owns making that
degradation look deliberate rather than broken, and
[Slice 9](./slices/09-e2e-composition.md)'s isolation spec for the footer must
assert the block above it still renders.

---

<a id="d80"></a>
## D80 — the redesign runs before deployment and E2E, and Slices 8 and 9 keep their numbers

**Maintainer's call, 2026-09-22.** Execution order becomes:

```text
1 → 2 → 3 → 4 → {5,6,7} → 10 → 11 → {12,13→14,15,16} → 8 → 9
```

**Why the redesign goes first.** [Slice 9](./slices/09-e2e-composition.md)'s
specs assert computed styles on shared-design-system components
([D38](./decisions-d33-d41.md#d38)) — every one of those assertions is written
against the palette and type scale the redesign replaces, so running Slice 9
first means writing the suite twice. Slice 8's pipeline is less exposed but its
three verifications would be run against markup that is about to change.

**Why they keep their numbers 8 and 9 rather than becoming 15 and 16.** A
renumber would rewrite **97 references across 40 files**, and those references
are not confined to the plan: they appear in `apps/*/vite.config.ts`,
`infra/src/portfolio-stack.ts`, `libs/shared/config/src/site.ts`,
`.github/workflows/ci.yml`, `tools/eslint/module-boundaries.mjs` and
`libs/features/footer/src/footer.tsx`. That is a large mechanical diff through
code belonging to slices still awaiting review, in exchange for nothing but
numeric tidiness.

⚠️ **So the slice index is ordered by execution, not by number**, and the
numbers read out of sequence at the end. That is deliberate and it is the whole
content of this decision — [plan-flow-order.md](../../../.claude/rules/plan-flow-order.md)
asks that the index order match the declared flow, and it does; it does not ask
that the labels be consecutive.

---

<a id="d81"></a>
## D81 — `SITE_SECTIONS` becomes the design's five anchors, and the header token changes with it

**Forced by the design, 2026-09-22.** The nav lists **Work, Experience, Skills,
About, Contact**. `SITE_SECTIONS` currently holds three: `skills` and the two
project-group sections from [D63](./decisions-d63-d67.md#d63).

⚠️ **This is the three-way contract [D43](./decisions-d42-d47.md#d43) describes,
and it fails silently.** The id is written by the Homepage remote onto a section
element, read by the Header remote as an anchor target, and read again by the
shell's header fallback when the Header remote is down. Those are three
independently deployed units. A rename that only two of them follow scrolls
nowhere and throws nothing.

Therefore **one slice re-points all three at once**
([Slice 12](./slices/12-header-redesign.md)), and the ids are changed **only**
there. Slices 13 and 14 put the new ids on their section elements reading
`SITE_SECTIONS`, never a literal.

**Two spacing tokens move with it:**

- `--spacing-header` is `4rem` today. The design's nav spacer is **56px** and
  its `scroll-margin-top` is **84px** — those are *different numbers*, where the
  current code uses one token for both. So the single token splits in two, and
  Slice 10 defines both.
- ⚠️ The mismatch is the reason to look: a fixed nav that is 56px tall wants
  more than 56px of scroll margin, or the section heading lands flush against
  the nav's bottom rule. 84px is the design's answer and it is not derivable
  from the nav height.
