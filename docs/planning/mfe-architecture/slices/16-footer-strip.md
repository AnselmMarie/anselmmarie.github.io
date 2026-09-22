# Slice 16 — Footer: the strip, and making its absence look deliberate

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slices 10, 11
**Design:** [both exports](../design-sources.md) — drawn ✅, **byte-identical in each**

The smallest slice of the redesign and the one with the most interesting
failure mode. It owns `apps/footer` + `libs/features/footer`.

## Decisions that bind this slice

- **[D79](../decisions-d76-d81.md#d79)** — ⚠️ **the footer remote renders the
  strip only.** The dark block above it belongs to the homepage remote
  (`#contact`) on `/` and to the portfolio-item remote (the "deeper
  walkthrough" block) on `/portfolio/$slug`. Two different blocks, one identical
  strip.
- **[D70](../decisions-d70.md#d70)** — **retired by
  [D76](../decisions-d76-d81.md#d76).** The footer is no longer invented; both
  exports draw it. D70 stays in the log as the record of Slice 5's interim.
- **[D75](../decisions-d75.md#d75)** — the brand marks are Tabler, through the
  one `SocialIcon` in `@portfolio/ui-components`, with `SocialIconName` in
  `@portfolio/shared-types`. ⚠️ **The design confirms the decision that closed
  the divergence**: it draws marks, not text labels, exactly as D75 chose.
- **[D29](../decisions-d17-d32.md#d29)** — `SocialIcon` is shared because the
  footer and the homepage hero both render it. Still true; the design's contact
  block is its second reader.

## Open questions blocking this slice

**None.**

## What this slice delivers

A single row on a 10%-white top rule, `1.5rem` above its content, in mono at
`.58rem` / `.14em` / uppercase at 45% paper:

- `© 2026 Anselm Marie` left,
- two 32px circular outlined icon links centred — LinkedIn, GitHub — filling
  with mint on hover,
- `Senior SWE · Tech Lead` right,
- wrapping to a `.75rem` gap when it will not fit.

### ⚠️ The degradation, which is this slice's real work

Because [D79](../decisions-d76-d81.md#d79) split one visual section across two
remotes, a downed footer leaves the dark block **ending on a bare horizontal
rule with nothing beneath it** — which reads as a truncated page rather than a
missing component.

So the footer fallback in `libs/features/shell/src/fallbacks/footer-fallback.tsx`
must sit *inside* that visual context: same dark ground, same rule, occupying
roughly the strip's height, saying what is missing. A fallback styled for the
white page it was designed against will look like a rendering bug.

⚠️ **That file is shell-owned.** [Slice 10](./10-design-foundation.md) re-skins
all five fallbacks to the new palette; **this slice does not edit it**. If the
degradation still looks wrong after Slice 10, that is a finding to report, not
a file to open — the shell is closed to wave slices.

### The accessible name survives

[D75](../decisions-d75.md#d75) records that replacing text labels with marks
removed each link's accessible name, that the name now comes from `aria-label`
with the `<svg>` `aria-hidden`, and that this silently invalidated a spec which
had been comparing `''` to `''` — **green, and testing nothing**.

The two assertions that guard it — the link keeps an accessible name, the mark
is `aria-hidden` — **carry over unchanged**. Do not rewrite them during the
re-skin.

## Files this slice creates and modifies

- `libs/features/footer/src/footer.tsx` — rewritten to the strip
- `libs/features/footer/src/footer-social-link.tsx` — re-skinned to the circle
- `libs/features/footer/src/footer-social-links.const.ts` — unchanged in data
- Specs for each

Estimated **~6 files** — the same size Slice 5 turned out to be.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=feature-footer
```

Then, in the composed app:

1. **Both pages, footer up** — the strip sits under the dark block on `/` and
   under a *different* dark block on `/portfolio/<slug>`, and looks like one
   section in both.
2. ⚠️ **Footer down, both pages** — stop the remote and look. The fallback sits
   in the dark ground and the page does not read as truncated. This is the whole
   point of the slice and no spec asserts it.

## Notes for whoever builds this

- **The year is hardcoded `2026` in both exports.** Decide: hardcode it and
  accept an annual edit, or compute it and accept that SSR and the client can
  disagree across midnight. Say which you chose and why — do not leave it
  looking accidental.
- `libs/features/footer/src/footer.tsx` currently carries a `Slice 8` reference
  in a comment. It still resolves —
  [D80](../decisions-d76-d81.md#d80) keeps Slice 8's number — so leave it alone.
