# Open Questions

Every unanswered question lives here, with the slice it blocks. A question is
never raised inside a slice's prose and left there — that is how a discussion
gets lost.

When one is answered: write the answer as a numbered decision in
[decisions.md](./decisions.md), move the entry to
[questions-closed.md](./questions-closed.md) with a closure note, update the
table below, and update the binding block of every slice that named it. All
four, in the same change.

**Three are open.** All four were raised on 2026-09-22 by reading the two design exports
([D76](./decisions-d76-d81.md#d76)). ⚠️ **None of them blocks a whole slice** —
each blocks one field or one region, so the slice that owns it builds everything
else and reports the blocked part as pending rather than filling it in.

| Q | Blocks | Status |
|---|---|---|
| [Q18](#q18) | Slices 11, 13, 15 — the hero images only | 🔴 open |
| [Q19](#q19) | Slice 15 — the gallery contents only | 🔴 open |
| [Q21](#q21) | Slices 11, 13, 14 — one figure | 🔴 open |
| [Q20](./questions-closed-q9-q16.md#q20) | *(was Slice 10 — font delivery)* | ✅ closed → [D82](./decisions-d82-d83.md#d82) |

---

<a id="q18"></a>
## Q18 — what are the real hero images?

**Raised 2026-09-22. Blocks:** the homepage's featured image
([Slice 13](./slices/13-homepage-hero-work.md)) and each item's `hero` field
([Slice 11](./slices/11-content-model.md), rendered by
[Slice 15](./slices/15-portfolio-detail-redesign.md)).

Both exports point their hero `<img>` at an **Unsplash URL** behind a
`((window.__resources||{}).heroX) ||` fallback — i.e. the design says
explicitly that these are placeholders awaiting real assets.

The repo has **43 real portfolio images** under
`apps/shell/public/images/portfolio/`, across six folders. None of them is a
16/7 hero; they are screenshots at their authored intrinsic dimensions.

The options, none of which a builder should pick alone:

1. Commission or capture a hero per item (8 needed, plus 1 for the homepage).
2. Crop an existing screenshot to 16/7 and accept the composition.
3. Drop the hero region and let the page start at the tech/summary block —
   a real design change, not a fallback.

⚠️ **Do not hotlink Unsplash.** It is a third-party runtime dependency on a
page whose whole point is that it degrades well, and it is not licensed for it.

---

<a id="q19"></a>
## Q19 — what fills the detail gallery?

**Raised 2026-09-22. Blocks:** the gallery region of
[Slice 15](./slices/15-portfolio-detail-redesign.md) only.

The export draws the grid — two columns, per-tile `span` and `ratio`
(`span 2` at `16/9`, `span 1` at `3/4`), collapsing to one column at `4/3` on
mobile — but fills every tile with a **striped placeholder and a label**
("Catalog grid — desktop", "Cart drawer"). The labels are notes to the
designer; the literal "Drop images here" heading beside the grid certainly is.

So the design specifies the container and not the contents, while the fixtures
hold 43 real images with authored `width`/`height` strings.

The question is how the two meet:

1. Derive `span` and `ratio` from each image's authored dimensions — landscape
   takes `span 2`, portrait `span 1` — and drop the labels.
2. Author a `span`/`ratio`/label per image, matching the design's rhythm, and
   accept that as 43 hand-written entries.
3. Keep the design's tile count per item and pick which images make the cut.

⚠️ **Option 1 is the cheapest and most likely right**, and it is still a
decision: it means an item with six landscape screenshots renders six full-width
tiles, which is not the rhythm the design draws.

---


<a id="q21"></a>
## Q21 — is it 13+ years or 10+?

**Raised 2026-09-22. Blocks:** one entry in the specs strip
([Slice 13](./slices/13-homepage-hero-work.md)) and one stat card
([Slice 14](./slices/14-homepage-experience-contact.md)), authored in
[Slice 11](./slices/11-content-model.md).

⚠️ **The design contradicts itself, in one file.**

| Where | Says |
|---|---|
| the specs strip above the hero | `13+ years shipping` |
| the About stats card | `10+` · `Years shipping production front-ends` |

The experience list in the same file runs from **2011** to now, which reads as
14 years and supports neither figure exactly. The two may also be measuring
different things — total career versus front-end specifically — in which case
both are right and the labels need to say so.

A builder cannot pick: one of these is on the page twice, in different words,
and getting it wrong is the kind of detail a reader notices on a portfolio site.

---

## Closed

All seventeen earlier questions — Q1 through Q17 — are closed, full text and
closure notes intact, in [questions-closed.md](./questions-closed.md) and its second half
[questions-closed-q9-q16.md](./questions-closed-q9-q16.md). ⚠️ That file was
split at 548 lines, over the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md);
nothing was dropped in the cut.

| Q | Blocks | Status |
|---|---|---|
| [Q1](./questions-closed.md#q1) | Slices 4, 5, 6, 7 | ✅ → [D34](./decisions-d33-d41.md#d34) |
| [Q2](./questions-closed.md#q2) | Slice 3 | ✅ → [D55](./decisions-d55.md#d55) |
| [Q3](./questions-closed.md#q3) | Slice 8 | ✅ → [D35](./decisions-d33-d41.md#d35) |
| [Q4](./questions-closed.md#q4) | Slice 3 | ✅ → [D39](./decisions-d33-d41.md#d39) |
| [Q5](./questions-closed.md#q5) | Slice 8 | ✅ → [D31](./decisions-d17-d32.md#d31) |
| [Q6](./questions-closed.md#q6) | Slice 9, launch | ✅ → [D41](./decisions-d33-d41.md#d41) |
| [Q7](./questions-closed.md#q7) | Slice 2 | ✅ → [D40](./decisions-d33-d41.md#d40) |
| [Q8](./questions-closed.md#q8) | Slice 2 | ✅ → [D38](./decisions-d33-d41.md#d38) |
| [Q9](./questions-closed-q9-q16.md#q9) | Slices 6, 7, SSR model | ✅ → [D36](./decisions-d33-d41.md#d36) |
| [Q10](./questions-closed-q9-q16.md#q10) | Slices 1 and 8 | ✅ → [D37](./decisions-d33-d41.md#d37) |
| [Q11](./questions-closed-q9-q16.md#q11) | Slice 1, D27/D29 enforcement | ✅ → [D44](./decisions-d42-d47.md#d44) |
| [Q12](./questions-closed-q9-q16.md#q12) | Slices 3, 6, 7 | ✅ → [D42](./decisions-d42-d47.md#d42) |
| [Q13](./questions-closed-q9-q16.md#q13) | Slice 3 | ✅ → [D43](./decisions-d42-d47.md#d43) |
| [Q14](./questions-closed-q9-q16.md#q14) | Slices 1, 6, 7 | ✅ → [D48](./decisions-d48-d52.md#d48) |
| [Q15](./questions-closed-q9-q16.md#q15) | Slice 1 | ✅ → [D46](./decisions-d42-d47.md#d46) |
| [Q16](./questions-closed-q9-q16.md#q16) | Slice 1 | ✅ → [D45](./decisions-d42-d47.md#d45) |
| [Q17](./questions-closed-q9-q16.md#q17) | Slice 7 (⚠️ raised as "6, 7") | ✅ → [D69](./decisions-d69.md#d69) |
