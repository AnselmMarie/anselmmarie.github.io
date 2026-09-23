# Decisions D88–D100

The five decisions Slice 11 produced, the three Slice 12 added, and the five from Slices 13–14. [decisions.md](./decisions.md) is the index.

⚠️ **Four of the five are corrections to this plan, not discoveries about the
code** — the same ratio the 5–7 wave produced and the README warns about. Three
were put to the maintainer and answered on 2026-09-22; two are plan corrections
the slice made and recorded.

<a id="d88"></a>
## D88 — the design's four skill groups replace v3's three, and the UI/UX list is dropped

**The maintainer's call, 2026-09-22.** Slice 11's field list does not mention
`skillGroups` at all — a gap, since the export's Skills section and the built
one disagree on both structure and content.

| | v3, as built | The design |
|---|---|---|
| Groups | 3 — Developer, its tools continuation, UI/UX | 4 — Frontend, Backend, Architecture, Platform & Quality |
| Layout | two bordered cards, joined by `cardId` | `auto-fit minmax(160px,1fr)`, no cards |
| Content | React…, Module Federation…, **Figma / Sketch / Adobe XD / Design System / Web Design / Mobile Design** | React…, **Hono, Drizzle ORM, Cloudflare, Zephyr Cloud, TanStack** |

**The design's four win, and `cardId` goes with them** — the new layout draws no
cards, so the field had nothing left to join.

⚠️ **This deletes the UI/UX group outright**, which is a content decision rather
than a structural one, and it was surfaced as such before the choice: the
export's own About copy two sections below reads *"equally comfortable tweaking
spacing in Figma"*, and after this change nothing in Skills mentions Figma,
Sketch or design work at all. The maintainer chose the design's list with that
noted. Re-adding a fifth Design group is additive and costs one fixture entry.

<a id="d89"></a>
## D89 — `PortfolioItem.year` is added; Slice 11's field table omitted it

**A plan correction, made by Slice 11 and reported.** The slice's new-field table
names six fields. The design reads a seventh, `year`, in two places — the Work
card's footer (`{{ p.client }}` · `{{ p.year }}`) and the detail page's
`client · year · role` bar.

It is added, because the alternative is worse in a way this slice exists to
prevent: `libs/shared/types` and `libs/shared/fixtures` are **frozen for the
whole 12/13/14/15/16 wave**, so a field discovered missing by Slice 13 could not
be authored without a coordinator pass unfreezing the package mid-wave. The
field is authored, not ported — v3 dates nothing.

⚠️ **A string, not a number.** `2011 – 2013` is a valid value for an engagement
that spans years, and nothing sorts or arithmetics on it.

<a id="d90"></a>
## D90 — Breeze-Thru is dated 2022 and Caterpillar News 2020, as the design has them

**The maintainer's call, 2026-09-22**, on two conflicts D89 surfaced the moment
`year` had to hold a value. Both are conflicts **inside the design export**, or
between it and v3 — a third and fourth alongside the two
[design-sources.md](./design-sources.md) already records.

| Item | The design | What disagrees with it |
|---|---|---|
| `cw-breeze-thru` | `2022`, `Angular · RxJS` | The export's **own** experience list puts the AT&T award — which v3's copy credits to Breeze-Thru — under Cricket **2013–2019**, stack `ES6+ · Webpack · Babel · jQuery` |
| `cr-caterpillar` | `2020`, `React Native · Expo · Push Notifications` | v3 files it under **Corporate Reports**, whose experience row is **2011–2013** on `PhoneGap (Cordova) · jQuery · HTML5 · CSS3`. React Native did not exist in 2013 |

**Both take the design's values**, including Caterpillar's React Native stack.
The alternative offered was to author from v3's record and log the divergence in
the `Design → code delta` table; the maintainer chose the export.

⚠️ **Recorded in the fixtures themselves**, in a comment on each item, so the
next reader does not re-raise a question that has been settled — both of these
read as defects to anyone who checks them against the experience list on the
same page.

<a id="d91"></a>
## D91 — the fixtures and the homepage types split further than Slice 11's file table allows

**A plan correction, made by Slice 11 and reported.** The slice's file table
names four fixture modules and two type modules, and its own notes say *"the
three existing `portfolio-items-*` files already split the set and the split
stays."* With the redesign's seven fields per item and the four new homepage
panels, that split does not survive the 200-line cap in
[file-size.md](../../../.claude/rules/file-size.md):

| Module | Would have been | Split into |
|---|---|---|
| `portfolio-items-other.fixture.ts` | **242** | itself (177) + `portfolio-items-cricket.fixture.ts` (88) |
| `portfolio-items-other-clients.fixture.ts` | **211** | itself (173) + `portfolio-items-corporate-reports.fixture.ts` (63) |
| `homepage.fixture.ts` | ~330 | itself (145) + `homepage-experience.fixture.ts` (141) + `homepage-about.fixture.ts` (58) |
| `types/src/homepage-content.ts` | ~255 | itself (173) + `homepage-panels.ts` (82) |

The two new item modules split **by client**, matching
`portfolio-items-other-clients.fixture.ts`'s own scheme rather than inventing a
third. ⚠️ **`PORTFOLIO_ITEMS`' order is unchanged** — v3's reading order is the
listing order, so `portfolio-items.fixture.ts` interleaves the five arrays to
reproduce it exactly rather than concatenating them module by module, and
`portfolio-items.fixture.spec.ts` asserts the eight slugs in order.

Every one of the ten modules is now under 200. The per-file split table in
[Slice 11](./slices/11-content-model.md) is updated to match; the ownership
rules are unchanged, since every new module is Slice 11's and then read-only.

<a id="d92"></a>
## D92 — Slice 11 does not land alone; it is held until Slices 13 and 14 compile against it

**The maintainer's call, 2026-09-22.** Slice 11 is not additive, though its own
text claims to be — *"Every field added here is additive, so the consumers
should still compile."* It removes `projectGroups`, `cardId` and `hero.links`,
and retypes `hero.headline` from `string` to `AccentedLine`. Those are changes
the same slice file describes in prose, so the "additive" sentence contradicts
its own content; **the removals are correct and the sentence is the error.**

The consequence is measured rather than predicted:

| Project | After Slice 11 |
|---|---|
| `shared-types`, `shared-fixtures` | ✅ typecheck, lint, 46 tests, file-size |
| `shell`, `feature-shell`, `feature-header`, `feature-footer`, `feature-portfolio-item`, `ui-components`, and the three remote apps | ✅ typecheck — the `PortfolioItem` half really is additive |
| **`feature-homepage`** | ❌ 20 type errors in 7 files; 7 of 27 tests fail |
| **`homepage`** | ❌ inherits the above — `nx run homepage:typecheck` reports 40, its own plus the lib’s |

All seven are `.tsx` or `.spec.tsx` in Slices 13 and 14's file set, and Slice 11
is explicit that *"if you find yourself editing a `.tsx`, you have crossed into
Slice 13, 14 or 15."* Three options were put to the maintainer — leave it red
and sequenced, patch the seven files to compile, or hold the slice — and **hold**
was chosen: Slice 11 is not presented as landable on its own, and the work runs
on through the homepage slices until the redesign's homepage compiles.

⚠️ **This does not dissolve the review cadence.** Each slice still stops for
review; what it changes is that Slice 11 is not *committed* by itself.

⚠️ **It also pulls Slice 12 forward into the same run.** Slice 11's content
points at the design's five anchors (`#work`, `#experience`, `#contact`), and
[D81](./decisions-d76-d81.md#d81) gives `SITE_SECTIONS` to Slice 12 as a
three-way contract re-pointed in one change. Slices 13 and 14 cannot put a
correct `id` on a section element until that lands, so the run to a compiling
homepage is **12 → 13 → 14**, not 13 → 14. A tripwire spec in
`homepage.fixture.spec.ts` asserts the anchors are *not* yet resolvable and goes
red the moment Slice 12 adds them.

<a id="d93"></a>
## D93 — `UiIcon` is the sixth shared component, added by the coordinator ahead of the wave

**Slice 12, recorded rather than asked.**
[parallelization.md](./parallelization.md) closes `libs/ui/components` to every
wave agent: *"A slice that finds it needs a sixth shared component reports it
and waits."* Slice 12 is that slice — the mobile overlay needs the design's
`ti-arrow-up-right` and the detail bar its `ti-arrow-left`.

It is added **now, by the coordinator, before the wave fans out**, because the
need is not Slice 12's alone:

| Slice | Needs |
|---|---|
| 12 | `arrow-up-right` (overlay rows), `arrow-left` (detail bar) |
| 13 | `arrow-right` (hero CTA), `arrow-up-right` (every Work card) |
| 15 | `external` (the link pills) |

Four slices, one component — D29's threshold several times over. Waiting would
have stopped three agents on the same request.

⚠️ **It extends [D75](./decisions-d75.md#d75) rather than reopening it**: Tabler,
not a second icon library, and `aria-hidden` with no label, so the accessible
name stays on the link or button around it.

<a id="d94"></a>
## D94 — the menu control is a `<button>`, and its 44px tap target is pulled out of the row

**Slice 12, two deliberate divergences from the export.**

- **The export draws the control as an `<a>` with no `href`, no role and no
  `aria-expanded`** — unreachable by keyboard and silent to a screen reader.
  Slice 12's own notes call for a `<button>`; this records that it shipped as
  one, with `aria-expanded` and `aria-controls`.
- ⚠️ **The export's own geometry does not add up, and the fix is not to shrink
  the button.** It sets a 44px control inside 16px padding, which makes the
  mobile bar **76px** — while its `navSpacer`, and this workspace's
  `--spacing-nav`, is **56px**. The bar would overlap the content the spacer
  exists to hold down. `-my-2.5` keeps the tap target at the 44px accessibility
  minimum while contributing 24px to the row, so the bar measures 56px on both
  sides of the breakpoint. Shrinking the control to 24px would have matched the
  spacer and quietly broken the touch target.

<a id="d95"></a>
## D95 — the variant is named in four places and checked in none; the spec is at the shell, not the region

**Slice 12, a plan correction and a finding.**

The two exports draw different bars and both are right — five homepage anchors
on the homepage, brand + `← All work` on a detail page, because those anchors
point at sections a detail page does not have. So the Header takes a `variant`,
passed by the host route.

⚠️ **Slice 12's file list said to assert this in
`libs/features/shell/src/shell-layout/shell-header-region.tsx`. That component takes
`children`** — it receives an already-built element and cannot pass a prop into
one. The forwarding actually lives in `apps/shell/src/remotes/header-remote.tsx`
and the two route call sites, so that is where the spec had to go.

⚠️ **Which meant standing up test infrastructure that did not exist.** There
were **no specs anywhere under `apps/`** — D27 puts the logic in the feature
libs, so the app skeletons ran `environment: 'node'` with `passWithNoTests`.
`header-remote.tsx` is the case the split did not anticipate: it *builds* the
props a remote receives. Slice 12 adds `jsdom`, a `test-setup.ts`, and a
`resolve.alias` mapping the four federated specifiers to one stub — Vite
resolves `import('header/Header')` at transform time and fails the whole file,
before `vi.mock` can intervene.

⚠️ **The variant is now named in four places and none of them checks the
others**: `HeaderVariant` in the feature lib, `HeaderRemoteProps` in the shell,
the `remotes.d.ts` module declaration, and the two route call sites. D16 forbids
the shell depending on the remote's package, so they cannot be one declaration.
This is the same shape as the `SITE_SECTIONS` contract and fails the same silent
way; the spec covers the hop that would actually be deleted.

<a id="d96"></a>
## D96 — `SECTION_IDS` holds all five anchor strings; no other file writes one

**Slices 13–14, extending [D81](./decisions-d76-d81.md#d81).**
Slice 13 forbids a `#work` string literal outside the contract, and the
homepage composes five sections that each need their id. `WORK_SECTION_ID` had
already been added for the Header's `← All work` link; the other four needed the
same treatment.

`site-sections.fixture.ts` now exports a `SECTION_IDS` object holding the five
strings, and **`SITE_SECTIONS` is built from it**, so the two cannot disagree.
Every reader — the Homepage's `<section id>`, the Header's back link, the hero's
CTAs — names a constant. A rename is a compile error in the readers instead of
an anchor that silently scrolls nowhere.

<a id="d97"></a>
## D97 — `--breakpoint-wide` is added; the theme claimed the design had one breakpoint

**Slice 13, a correction to Slice 10.** `libs/ui/theme` defined
`--breakpoint-frame: 760px` under the comment *"the frame's inset and its one
breakpoint."* The homepage export distinguishes **three** bands — `<760`,
`760–1080`, `>=1080` — and gives the middle one its own hero lede layout
(`1fr auto`, end-aligned) rather than the mobile stack.

Collapsing to two is a visible regression at tablet width, which is why Slice 13
asks for screenshots at 375, 900 and 1400. `--breakpoint-wide: 1080px` is the
export's own number.

Verified in the browser at all three: 1400 → hero `791px / 495px`; 1024 → hero
one column, lede block `638px / 272px`; 375 → both one column, nav `display:
none`.

<a id="d98"></a>
## D98 — the hero's featured panel is filled from the export's own unused `index` array

**Slice 13.** [D85](./decisions-d85-d87.md#d85) removed the photograph from the
hero's 16/7 region and kept the box, to be *"filled typographically"* — but did
not say with what, and Slice 11 authored no copy for it.

Rather than invent any, the panel renders the export's **own `index` array** —
four numbered capability lines (`01 Design Systems` … `04 Edge-First Backends`)
that the design authored and whose markup never references. The caption chip
keeps the export's own text. ⚠️ **Nothing here is new copy**; two fields,
`hero.featuredCaption` and `hero.capabilities`, were added to the content model
after Slice 11's fixture was written.

<a id="d99"></a>
## D99 — `white-space: nowrap` on the two clamped headings is not reproduced

**Slice 14, a deliberate divergence.** The export sets `white-space: nowrap` on
the Skills heading and the Contact heading, both of which use `clamp()`. That
overflows at some narrow width **by construction** — the slice file says as much
and asks what was done about it.

It is not reproduced: both headings wrap. The cost is the two-line break the
design draws at wide widths; the benefit is no horizontal scrollbar. **Verified
at 320px: `document.scrollWidth === 320`, no overflow.**

<a id="d100"></a>
## D100 — the anchor contract's third leg is verified; the gate Slice 12 could not finish

**Slices 13–14.** [Slice 12](./slices/12-header-redesign.md) re-pointed
`SITE_SECTIONS` and could only verify two of the contract's three legs, because
the Homepage remote was throwing and had no section elements to scroll to.

With the homepage rebuilt, the full gate ran in the browser. All five nav
anchors scroll, and four land at **exactly 84px** — the `--spacing-anchor`
value, not the 56px nav spacer:

| Anchor | `getBoundingClientRect().top` after click |
|---|---|
| `#work` | 84 |
| `#experience` | 84 |
| `#skills` | 84 |
| `#about` | 84 |
| `#contact` | 265 — the last section; the document cannot scroll further |

⚠️ **`homepage.spec.tsx` now covers the third leg too**, asserting a section
element exists for every id `SITE_SECTIONS` names and that no section carries an
id the nav does not know about. It is the only spec in the workspace that can
reach that half of the contract.
