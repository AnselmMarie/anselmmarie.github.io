# Decisions D85–D87

The three open design questions, closed 2026-09-22 before the redesign wave.
[decisions.md](./decisions.md) is the index.

All three were raised by reading the exports ([D76](./decisions-d76-d81.md#d76))
and all three are closed by measuring the repo against them. That is the pattern
the README warns about after the 5–7 wave, applied **before** the wave this time
rather than by the agent sent to build against it.

<a id="d85"></a>
## D85 — the hero is typographic, not photographic; Q18 closes

**The maintainer's call, 2026-09-22**, closing
[Q18](./questions-closed-q18-q21.md#q18) and overriding the design export.

Both exports draw a **16/7** hero image (`heroRatio: m ? '4/3' : '16/7'`) behind
an Unsplash placeholder. The site instead fills that region with the item's own
Work-card treatment — its `background` / `isDark` pair — carrying the title,
`role` and `lede` as type. **No photograph, and no new assets.**

### Why, and the measurement that decided it

The question offered "crop an existing screenshot" as the cheap option. It is
not available: **the widest asset in the repo is 1.80**, and that is the 540×300
card thumbnail, far too small to run full-bleed. 16/7 is **2.29**.

Cropping works for at most half the catalogue:

| Item | Widest candidate | To 16/7 |
|---|---|---|
| `pokemon-pet-shop` | 1510×957 (1.58) | 1510×660 — loses 31% of height |
| `rove-logix` | 1200×900 (1.33) | loses 42% |
| `csp-generator-app` | 1140×822 (1.39) | loses 40% |
| `cr-caterpillar` | 1000×800 (1.25) | loses 44%, marginal width |
| `cosmikata` | 1206×2622 (0.46) | ❌ none |
| `rove-logix-ui-update` | 1080×1220 (0.89) | ❌ none |
| `older-cosmikata` | 414×736 (0.56) | ❌ none |
| `cw-breeze-thru` | 414×736 (0.56) | ❌ none |

⚠️ **Four of the eight items are mobile-screenshot-only.** There is no crop that
produces a hero for them, so "crop where you can" is not one treatment — it is
two, applied inconsistently across a catalogue of eight.

### What follows from it

- **The region stays.** This is not option 3 from the question ("drop the hero");
  the page keeps its opening beat and its 16/7 desktop / 4/3 mobile box. Only the
  fill changes.
- **`hero` comes off `PortfolioItem`.** [Slice 11](./slices/11-content-model.md)
  no longer authors it, and the field is not added. `heroCaption` goes with it.
  The card treatment the region reads (`background`, `isDark`) already arrives
  through the Work-grid presentation D77 assigns.
- **The homepage's featured image is the same decision**
  ([Slice 13](./slices/13-homepage-hero-work.md)) — typographic, on the same
  treatment.
- ⚠️ **Nothing hotlinks Unsplash**, which Q18 already forbade and which this
  closure makes moot rather than merely disallowed.
- If real heroes are ever commissioned, this is additive to undo: the field
  returns and the region's fill swaps. Nothing here forecloses it.

<a id="d86"></a>
## D86 — gallery `span` and `ratio` are derived from the authored dimensions and bucketed; Q19 closes

**The maintainer's call, 2026-09-22**, closing
[Q19](./questions-closed-q18-q21.md#q19).

Landscape → `span 2` at `16/9`. Portrait → `span 1` at `3/4`. `object-fit:
cover`. The design's per-tile labels ("Catalog grid — desktop", "Cart drawer")
are **notes to the designer and are dropped**, as is the literal "Drop images
here" heading beside the grid.

### Three corrections to the question itself

1. ⚠️ **It is 35 gallery images, not 43.** The other eight are the `thumbnail`
   field, which feeds the Work cards and `og:image`
   ([portfolio-route-metadata.fixture.ts](../../../libs/shared/fixtures/src/route-metadata/portfolio-route-metadata.fixture.ts)),
   not the gallery.
2. ⚠️ **The question's warning about option 1 is backwards.** It cautions that
   derivation yields "six full-width tiles, which is not the rhythm the design
   draws." But the design's own mix is **12 portrait tiles to 8 landscape**, and
   the catalogue is **26 portrait to 9 landscape** — five items have no landscape
   image at all. Derivation lands *closer* to the design's rhythm, not further.
3. **The authored `width`/`height` are display dimensions, not intrinsic.**
   `cosmikata` is authored 662×1436 where the file is 1206×2622. **The ratio is
   preserved exactly**, which is the only property derivation needs — so reading
   the fixtures rather than the files is safe, and no build step has to measure
   images.

### The sub-decision the question did not name

**No image is actually 3/4 or 16/9** — real ratios run 0.41 to 1.58. So
derivation must either bucket to the design's two ratios and crop, or keep true
ratios and accept an irregular grid. **It buckets**, and the cost is concentrated
in the extremes: `email02` (800×1944, 0.41) loses ~45% of its height in a 3/4
tile, and `cosmikata`'s three 0.46 screenshots lose ~39%.

⚠️ **That cost is accepted, not overlooked.** If the crop reads badly on the
tall-mobile items when Slice 15 puts it on screen, that is a finding to report —
`object-fit: contain` on a tinted tile is the fallback, and it is a one-rule
change. Do not apply it pre-emptively.

### Edge case

`cr-caterpillar` has exactly **one** image, landscape. Its gallery is a single
`span 2` tile. That is correct output, not a bug to special-case.

<a id="d87"></a>
## D87 — 15+ years shipping, 13+ in lead roles; the two figures measure different things; Q21 closes

**The maintainer's call, 2026-09-22**, closing
[Q21](./questions-closed-q18-q21.md#q21).

| Where | Reads |
|---|---|
| the specs strip above the hero | `15+ years shipping` |
| the About stats card | `13+` · `Years in lead & architect roles` |

The design had `13+ years shipping` in the strip and `10+ · Years shipping
production front-ends` in the About card — **the same claim, twice, in different
words and different numbers.** Both are replaced.

### The export's own experience list settles both numbers

Field order in the export is `role, company, period`, which is what makes the
mapping legible:

| Period | Role | Company |
|---|---|---|
| 2011 – 2013 | Interactive Developer | Corporate Reports, Inc. |
| 2013 – 2019 | Senior Developer / Manager | Cricket Wireless |
| 2019 – 2020 | Senior Application Developer | ADP |
| 2020 – 2023 | Senior Software Engineer, **Tech Lead** | Cricket Wireless |
| 2024 | Senior Software Engineer | Inspire Brands |
| 2025 – 2026 | Senior Software Engineer | Southern Glazer's |
| 2025 – Present | **Founder & Lead** Software Engineer | Cosmikata |

- **2011 → 2026 is 15 years.** That is the strip's figure, and it is the first
  row of the list printed directly beneath it.
- **2013 → 2026 is 13 years**, anchored on the Cricket **Manager** title. The
  Corporate Reports entry's own bullet — *"Advanced into a lead role overseeing
  web applications from inception to completion"* — puts lead responsibility
  inside 2011–2013, so 2013 is the conservative boundary rather than a generous
  one.

⚠️ **`10+` matched no boundary in the list at all** — nothing begins in 2016. The
likeliest reading is that the export's two figures were a career number and a
lead-scope number whose labels got crossed, which is why this closes as a
relabelling with one number corrected rather than as picking a winner.

⚠️ **The plan's own note that the list "reads as 14 years" was a year stale** when
Q21 was written. Both figures are now derivable from the table immediately below
them on the page, which is the property that keeps them from drifting again.

### Where it lands

`specs` and `about.stats` are authored in
[Slice 11](./slices/11-content-model.md); the strip renders in
[Slice 13](./slices/13-homepage-hero-work.md) and the stat card in
[Slice 14](./slices/14-homepage-experience-contact.md). The About card's second
stat — `6 · Industries, telecom to logistics` — is unchanged and already
measured something different.
