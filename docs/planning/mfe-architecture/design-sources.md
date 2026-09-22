# Design sources

Where each surface's design comes from, what has been verified against it, and
what was invented. Required by
[plan-design-links.md](../../../.claude/rules/plan-design-links.md). Split out of
[README.md](./README.md) on 2026-09-22 when the index hit its 200-line cap —
nothing was dropped in the cut.

## The current source: two design exports, 2026-09-22

Supplied by the maintainer and adopted as the design of record by
[D76](./decisions-d76-d81.md#d76).

| Screen | File | Status | Covers |
|---|---|---|---|
| Homepage | [`_design/Anselm Marie Portfolio.html`](../../../_design/Anselm%20Marie%20Portfolio.html) | ✅ drawn | frame, nav, hero, Work, Experience, Skills, About, Contact, footer strip |
| Portfolio detail | [`_design/Anselm Marie Project Detail.html`](../../../_design/Anselm%20Marie%20Project%20Detail.html) | ✅ drawn | frame, back bar, header, links, hero, tech/facts, summary, gallery, next block, footer strip |

Both files draw the frame, a bar and the footer strip, so between them **every
surface in the plan has a design** — which is why D76 treats them as
site-wide rather than as two page designs.

### 🔴 Unresolved: `_design/` is gitignored, so those two links are local-only

`.gitignore:9` ignores `_design`, added in `7b3bf60` — the merged Slice 1–2 PR — when the
directory was a scratch area. It is now the **design of record**, and the two links above
resolve on the maintainer's machine and **nowhere else**: not in a clone, not in a
worktree, not for any future session.

⚠️ **This is precisely the failure
[plan-design-links.md](../../../.claude/rules/plan-design-links.md) is written against** —
*"a stored link nobody reads is worse than no link: it makes the plan look design-backed
while the code is being written from prose."* A link that cannot be opened at all is the
same failure with an extra step.

The plan does **not** resolve this on its own, because it is the maintainer's repo and their
`.gitignore`. Three options, and the recommendation is the third:

1. **Un-ignore `_design/` and commit both files.** Honest and simple, at **12 MB** — 5.4 MB
   + 6.8 MB, nearly all of it base64 fonts and placeholder photography.
2. **Leave it ignored** and accept that the design exists only on one machine. ⚠️ A wave
   agent in its own worktree then cannot open the design it is told to build against, which
   makes [plan-design-links.md](../../../.claude/rules/plan-design-links.md)'s "open the link
   first" obligation unsatisfiable by construction.
3. **Commit a decoded extract, keep the originals ignored.** Each bundle's
   `script[type="__bundler/template"]` payload is a JSON-encoded string; parsed, and with
   the `@font-face` blocks stripped, the homepage is **17 KB of markup plus a 9 KB data
   script**, and the detail page the same. That is the whole specification — the section
   order, the measures, the colour values, the breakpoints, the copy. The 12 MB that gets
   dropped is Carlito/JetBrains Mono/Inter as base64 woff2 and the **Unsplash placeholder
   photos**, neither of which is design-of-record content ([Q18](./open-questions.md#q18)
   exists because those images are explicitly not final).

⚠️ **Until this is settled, treat the two links above as unopenable by anyone but the
maintainer**, and say so in any report that claims a surface was built against its design.

⚠️ **They are Claude Design bundles, not source.** A `<x-dc>` template with
`{{ }}` bindings, `sc-for` loops, inline `style` attributes and a `DCLogic`
class. None of that shape survives into the workspace: values are re-expressed
as theme tokens and Tailwind classes ([D76](./decisions-d76-d81.md#d76),
[design-system.md](../../../.claude/rules/design-system.md)). To read one, extract
the `script[type="__bundler/template"]` payload and `JSON.parse` it; the data
lives in the trailing inline `<script>`.

### What the exports do **not** cover

| Surface | Why | Owner |
|---|---|---|
| Remote-failure fallbacks (4) | a static design has no remote to fail | invented, [Slice 4](./slices/04-error-boundaries.md), re-skinned by [Slice 10](./slices/10-design-foundation.md) |
| Portfolio not-found | no equivalent ([D66](./decisions-d63-d67.md#d66)) | invented, Slice 4 |
| Rich-text `description` block | the design's body is plain paragraphs | ⚠️ invented, [Slice 15](./slices/15-portfolio-detail-redesign.md) ([D78](./decisions-d76-d81.md#d78)) |
| Video block | the design draws no embed | ⚠️ invented, Slice 15 ([D78](./decisions-d76-d81.md#d78)) |
| The two items the design omits | `rove-logix-ui-update`, `older-cosmikata` | ⚠️ every new field invented, [Slice 11](./slices/11-content-model.md) ([D77](./decisions-d76-d81.md#d77)) |
| Accordion ARIA | the export uses a click handler on a `<div>` | ⚠️ deliberate divergence, [Slice 14](./slices/14-homepage-experience-contact.md) |

Each is flagged **control by control** in its slice's completion report, not
summarised in a line.

### Design → code delta

Where the built site deliberately differs from the exports. Required by
[plan-design-links.md](../../../.claude/rules/plan-design-links.md): a control
that differs and is *not* in this table is a defect, not a decision.

| Surface | The design | The code | Why |
|---|---|---|---|
| Nav bar | floats at the 14px frame inset, carries the card's top radius | flush to the viewport top, full-bleed, square corners | maintainer's call, 2026-09-22 — [D84](./decisions-d82-d83.md#d84) |
| Webfonts | every `@font-face` inlined as base64 | three families from the Google Fonts CDN, via `<link>` | a single-file export bundles its fonts; that is not a delivery decision — [D82](./decisions-d82-d83.md#d82) |

⚠️ **Slice 12 owns the nav and inherits D84.** Building the export's floating
bar from the design alone would silently revert a decision the maintainer made.

### ⚠️ Two contradictions inside the exports themselves

Found while reading them on 2026-09-22, before any slice was written:

- **The years figure disagrees with itself.** The specs strip says
  `13+ years shipping`; the About stat card says `10+`. Same file. Raised as
  [Q21](./open-questions.md#q21).
- **The hero images are explicit placeholders** — Unsplash hotlinks behind a
  `window.__resources` fallback, in both files. Raised as
  [Q18](./open-questions.md#q18).

Neither is a defect in the plan; both are gaps in the design that a builder
would otherwise fill silently.

## The content source: unchanged

**The live v3 site at commit `39bbe56`**, per [D53](./decisions-d53.md#d53) —
`version-2` is that commit and `origin/master` carries byte-identical content.

⚠️ **The local `master` branch is stale and is not a source**: it is missing the
Pokémon Pet Shop item entirely. ⚠️ **Not the `version-3` branch** either — it was
reused for this workspace on 2026-09-21 and now points at `7b3bf60`, so
`git show version-3:<path>` fails.

[D76](./decisions-d76-d81.md#d76) moved the *design* off v3 and left this alone.
[D77](./decisions-d76-d81.md#d77) is what keeps the eight ported items when the
design shows six.

## The previous source: the live v3 site, 2026-09-20 to 2026-09-22

[D34](./decisions-d33-d41.md#d34) nominated the deployed v3 site as the design
for Slices 1–7. Superseded for design purposes by D76. Kept here because the
built site still looks like it until the redesign lands, and because of what it
taught:

⚠️ **Two of its six rows said `✅ exists` and did not.**

- **The Header** — found while building Slice 3, recorded as
  [D59](./decisions-d58-d62.md#d59). v3 has no header, no nav component, and no
  element carrying an `id`.
- **The Footer** — found while building Slice 5, recorded as
  [D70](./decisions-d70.md#d70). `git grep -il footer 39bbe56 -- src` returns
  nothing at all.

`✅ exists` in that table was recording what a portfolio site is *assumed* to
have, not what anyone had checked, and both errors were found by the agent sent
to build against them. The three surviving `✅` rows were each verified against
the v3 source by the slice that built them.

**Both inventions are now retired** by D76: the exports draw a header and a
footer, so Slices 12 and 16 build against a real design. D59 and D70 stay in the
log as the record of how the interim was arrived at — not as live constraints.

> The lesson is the one worth carrying into Slices 10–16: **a design table row
> is a claim, and a claim nobody checked is worth less than a blank.** When a
> slice opens its design and finds no such thing, that is a finding to report
> before building, never a gap to fill quietly.
