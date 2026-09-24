# Questions Closed — Q18, Q19, Q21

The third file of closed questions, split out on 2026-09-22: appending these three to
[questions-closed-q9-q16.md](./questions-closed-q9-q16.md) would have taken it from 428
lines to ~558, over the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md). Nothing was
reworded in the cut.

⚠️ **[Q20](./questions-closed-q9-q16.md#q20) is not here.** It closed a day earlier and was
appended to the previous file; moving it would break the links already written to it for
the sake of a tidier range. The index table in
[questions-closed.md](./questions-closed.md) covers all three files.

All three of these were raised on 2026-09-22 by reading the two design exports
([D76](./decisions-d76-d81.md#d76)) and all three closed the same day, **before** the
redesign wave started rather than by the agent sent to build against them.

---

<a id="q18"></a>
## Q18 — what are the real hero images?

**Raised 2026-09-22. Blocked:** the homepage's featured image
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

### ✅ Closed 2026-09-22 → [D85](./decisions-d85-d87.md#d85)

**None of the three options as written.** The region stays and the fill becomes
typographic — the item's own Work-card treatment carrying title, `role` and `lede`.

⚠️ **Option 2 was not available, and measuring the assets is what showed it.** The widest
asset in the repo is **1.80** — the 540×300 card thumbnail — against 16/7's **2.29**. Four
of the eight items (`cosmikata`, `rove-logix-ui-update`, `older-cosmikata`,
`cw-breeze-thru`) are mobile-screenshot-only and have **no** croppable candidate at all, so
"crop where you can" would have meant two different treatments across a catalogue of eight.
The per-item table is in D85.

The closure is **not** option 3 either: the hero region and its 16/7 / 4/3 box survive.
`hero` and `heroCaption` are dropped from `PortfolioItem` — Slice 11 no longer authors
them — and returning them later is additive.

---

<a id="q19"></a>
## Q19 — what fills the detail gallery?

**Raised 2026-09-22. Blocked:** the gallery region of
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

### ✅ Closed 2026-09-22 → [D86](./decisions-d85-d87.md#d86)

**Option 1, with bucketing made explicit.** Landscape → `span 2` at `16/9`, portrait →
`span 1` at `3/4`, `object-fit: cover`, labels dropped.

⚠️ **Three of this question's own premises were wrong**, and D86 records each: it is **35**
gallery images and not 43 (the other eight are `thumbnail`); the warning about option 1 is
**backwards**, since both the design (12 portrait to 8 landscape) and the catalogue (26 to
9) are portrait-dominant; and the authored `width`/`height` are **display** dimensions, not
intrinsic — but the ratio is preserved exactly, which is all derivation needs.

The sub-decision the question never named — that no real image is actually `3/4` or `16/9`,
so derivation must bucket and crop — is settled in D86 along with the two items that pay
for it.

---

<a id="q21"></a>
## Q21 — is it 13+ years or 10+?

**Raised 2026-09-22. Blocked:** one entry in the specs strip
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

### ✅ Closed 2026-09-22 → [D87](./decisions-d85-d87.md#d87)

**Neither figure survived.** The strip reads `15+ years shipping`; the About stat reads
`13+ · Years in lead & architect roles`. The question's closing guess was the right one —
they measure different things — but both numbers were wrong as printed.

⚠️ **The question's own arithmetic was a year stale.** 2011 → 2026 is **15** years, not the
14 written above. And `10+` anchors on nothing: no row in the experience list begins in
2016. `13+` does anchor — on the 2013 Cricket **Manager** title — which is why D87 reads the
export's two figures as a career number and a lead-scope number whose labels got crossed.

Both numbers are now derivable from the experience table printed directly beneath them,
which is the property that stops them drifting again.

---

<a id="q22"></a>
### Q22 — which UI and navigation issues does Slice 17 fix?

**Raised 2026-09-23 by the maintainer**, after Slices 10–14 landed: *"there are still a
good amount of UI/navigation issues that need to be dealt with."* That is the whole of
Slice 17's scope ([D102](./decisions-d101-d102.md#d102)), and the list hasn't been written
down yet.

**Blocks:** Slice 17 entirely. Slice 9 indirectly, since it runs after 17.

**What an answer needs, per issue:** the surface (route + viewport), what happens, what
should happen, and whether the design shows the right answer or it's a new decision.

**What not to do:** audit the site and treat the findings as the list. An audit can
*propose* additions for the maintainer to accept. The list itself is the maintainer's.

### ✅ Closed 2026-09-23 → [D104](./decisions-d104.md#d104)

**Answered by the work, not by a list.** The maintainer declared Slice 17 done without the
list being written down. PR #47 is the likeliest carrier, but that isn't confirmed. The
list is not reconstructed here, for the reason the question itself gives.

---

<a id="q23"></a>
### Q23 — "Try again" cannot recover a remote whose load failed. Fix it in Slice 9?

**Raised 2026-09-23 by Slice 9's suite.** With a remote's `remoteEntry.js` blocked, then
unblocked, clicking **Try again** leaves the fallback in place, for both the homepage and
the portfolio item. The page asks for `remoteEntry.js` **once**, across the first load
and every retry.

**Cause** (in `@module-federation/runtime-core` 2.9.0, `utils/load.js`): the runtime
stores each entry load as a promise in `globalLoading[uniqueKey]`, and a *rejected*
promise stays there. `MfeRemoteMount`'s retry builds a new `lazy()`, which is the right
fix for `React.lazy`'s cache, but its `import()` goes back to the runtime and gets the
same cached rejection. It's the trap the mount's own comments describe, one layer
further down. No unit spec can see it, because unit specs stub the federated import.

**Likely fix:** on retry, re-register that remote with
`registerRemotes([remote], { force: true })`. That is the only path that calls
`removeRemote`, and `removeRemote` is what deletes the cached entry. This changes
`libs/features/shell` and adds `@module-federation/runtime` as a dependency of
`feature-shell`.

**Blocks:** Slice 9's two `"Try again" recovers the remote` specs, which fail today and
turn the new CI job red. Slice 8, whose deploys are gated on that job.

**The choices:** (a) fix it in Slice 9, with a unit spec and this E2E spec as its
negative control; (b) fix it in its own change first, then land Slice 9 green; (c) land
Slice 9 with the two specs marked `test.fixme`, naming this question, and fix it later.

### ✅ Closed 2026-09-23 → [D106](./decisions-d106.md#d106)

**Fixed inside Slice 9 (choice a).** The likely fix above was not enough. Forcing the
re-register cleared the runtime's cache, but two more caches still held the failure: the
plugin's compiled import, and the browser's module map. D106 records all three and the fix
that gets past them.
