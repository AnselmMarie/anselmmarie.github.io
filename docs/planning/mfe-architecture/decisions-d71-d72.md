# Decisions D71–D72 — what building Slice 6 forced

<a id="d71"></a>**D71 — there are eight live portfolio items, not nine.
`cosmikata-design-system` is commented out at `39bbe56` and is not ported.** Found by the
Slice 6 agent, verified by the coordinator, 2026-09-21.

[D53](./decisions-d53.md#d53), [Slice 7](./slices/07-portfolio-item-mfe.md),
`portfolio-items.fixture.ts`'s own banner comment and the coordinator's brief to the Slice 7
agent **all said nine**, and all named the same nine slugs. ⚠️ **The list was read off v3's
route directory, not off its data.** The data says eight:

```bash
git show 39bbe56:src/store/active.data.ts | grep -n "id: '"
#   3:    id: 'pokemon-pet-shop',
#  47:    id: 'cosmikata',
#  88:  //   id: 'cosmikata-design-system',     ← commented out
```

- **`active.data.ts` — 2 live:** `pokemon-pet-shop`, `cosmikata`
- **`other.data.ts` — 6 live:** `older-cosmikata`, `csp-generator-app`, `cw-breeze-thru`,
  `rove-logix`, `rove-logix-ui-update`, `cr-caterpillar`

The **entire object** is commented out, not merely its id — `title`, `thumbnail`,
`description` and `images` with it. So there is no data to port even if one wanted to, and
uncommenting it would be **re-publishing content the maintainer deliberately disabled**.
That is the maintainer's call, not a porting decision. **Eight items are ported.**

## ⚠️ v3 leaves a dead route behind, and ours is better — leave it that way

v3 still ships `src/routes/portfolio/cosmikata-design-system/index.tsx`. It looks the item up
by id in the combined data, finds nothing, and renders `<PortfolioDataContainer data={null} />`.
**On the live site that page is dead.**

Our equivalent is already correct and needs no work: with no fixture entry,
`portfolioItemBySlug('cosmikata-design-system')` returns `undefined` and the shell renders
`PortfolioNotFound` ([D66](./decisions-d63-d67.md#d66)). ⚠️ **Do not add the item to make
that route "work"** — an honest not-found is the right answer for content that is not
published.

## What this says about the count

The nine-slug list survived three documents and a decision entry because each copy was
checked against the previous copy rather than against `src/store/*.data.ts`. It cost
nothing here only because Slice 6 rendered the listing against the real data and noticed the
mismatch. **The fixture banner is the copy most likely to be believed next** — it sits in
the file a future agent opens — so it is corrected in the same change as this entry.

---

<a id="d72"></a>**D72 — the homepage tile ships without a thumbnail, and homepage membership
lives in `HomepageContent`, not in the item.** Slice 6, 2026-09-21.

Two consequences of the wave's file split that the split table did not anticipate. Both are
recorded because each is a visible gap someone will otherwise "fix" by reaching into another
slice's file.

**1. No thumbnail on the tile, deliberately.** v3's homepage tile is image + title. The
image string belongs on `PortfolioItem` as `thumbnail` — which is
`libs/shared/types/src/portfolio-item.ts`, **Slice 7's closed module**, carrying only `slug`
and `title` while the wave ran. The Slice 6 agent shipped the card **title-only** rather
than declaring an optional `thumbnail` prop no parent could supply — which would have been
an unwired prop, exactly the failure
[spec-through-the-parent.md](../../../.claude/rules/spec-through-the-parent.md) exists to
catch, and invisible to every component-level spec.

✅ **This is the right call and it left a one-line follow-up, now done (2026-09-21).** With
Slice 7's `thumbnail` field landed, the tile renders `<img src={item.thumbnail}>` and the
section forwards it. The image is **decorative** — `alt=""` — because the tile's own link
text already names the project, and a meaningful `alt` would have a screen reader announce
the same title twice.

Proven by deleting the forwarding line and watching
`homepage-project-section.spec.tsx` go red, then restoring it. ⚠️ **`git diff` is silent on
that revert** because the file is still untracked, so the `assert` guard and the failure
itself are the evidence — the exact case
[prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md) says to
watch for.

**2. Homepage membership is `HomepageContent.projectGroups[].slugs`.** The seam returns one
flat `usePortfolioItems()` list with **no active/other discriminator**, and v3 splits its
homepage into exactly those two sections. Slice 6 settled the split as slug lists in
`homepage-content.ts` — homepage content, inside its own file set, rather than adding a
category field to Slice 7's item type.

⚠️ **The consequence, stated plainly: an item whose slug is in neither group does not appear
on the homepage at all.** It is reachable only by direct URL. That is correct for the eight
ported items and it is a silent trap for the ninth item anyone adds later — the item page
works, the homepage never mentions it, and nothing errors. The Contentful plan should carry
the active/other distinction as data rather than inheriting these two hand-written slug
lists.
