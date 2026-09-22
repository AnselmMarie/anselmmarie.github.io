# Slice 6 — Homepage MFE, on fixtures

**Status:** ✅ built 2026-09-21 in worktree `claude/slice-6-homepage`, awaiting review — ⚠️ the listing renders empty until the images land, and the tile has no thumbnail ([D72](../decisions-d71-d72.md#d72)) · **Visible?** ✅ screen · **Depends on:** Slice 4
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))
**Wave:** runs concurrently with Slices 5 and 7

> 🧭 **Read the per-file split before you start**:
> [parallelization.md → The named per-file split for the wave](../parallelization.md#the-named-per-file-split-for-the-wave)
> ([D67](../decisions-d63-d67.md#d67)). It names every file you may open in the co-owned
> `libs/shared/types` and `libs/shared/fixtures`, and every file that is closed to you.
> Each module also carries an `OWNER:` banner in its own header. A file outside your set
> reporting as modified is a **halt**
> ([no-cross-plan-drift.md](../../../../.claude/rules/no-cross-plan-drift.md)).


The first remote with real content shape behind it, and therefore the first place the
fixture seam matters.

## Decisions that bind this slice

- **[D1](../decisions-d01-d16.md#d1)** / **[D2](../decisions-d01-d16.md#d2)** / **[D8](../decisions-d01-d16.md#d8)**
  — standalone remote, consumed by the shell, client-side hydration.
- **[D36](../decisions-d33-d41.md#d36)** — ⚠️ **the homepage stays federated.**
  [Q9](../questions-closed-q9-q16.md#q9) asked whether to de-federate this surface so it would
  server-render and be indexable, and closed against it: the architecture is the deliverable
  ([D33](../decisions-d33-d41.md#d33)). So none of this slice's content appears in the SSR HTML, and
  that is the accepted design rather than a defect to fix here.
- **[D34](../decisions-d33-d41.md#d34)** — the homepage is built to match the **live v3 site**,
  section for section. It is no longer the largest invented surface in the plan; it is the
  largest *ported* one.
- **[D15](../decisions-d01-d16.md#d15)** — the homepage **never fetches content itself**. It
  receives data as props from the shell. Today that data comes from fixtures; after the
  Contentful plan it comes from a server function. The component cannot tell the
  difference, and that is the property this slice is protecting.
- **[D22](../decisions-d17-d32.md#d22)** / **[D41](../decisions-d33-d41.md#d41)** — fixtures are the MVP's
  content source, and the report says so plainly. ⚠️ But under D41 that names the *source*,
  not a disclaimer: this slice writes the **real** portfolio copy, and it is reviewed as
  published content rather than skimmed as a stub.
- **[D53](../decisions-d53.md#d53)** — ⚠️ **the copy is ported from commit `39bbe56`, not
  retyped and not read off the rendered page.** ⚠️ **Use the commit, not a branch:**
  `git show 39bbe56:<path>`. The `version-3` branch this line used to name was **reused for
  the new workspace** and now points at `7b3bf60` — see the correction in
  [D53](../decisions-d53.md#d53). `version-2` still resolves to `39bbe56`; `version-3` does
  not.
  - `src/store/active.data.ts` and `src/store/other.data.ts` — **nine items**, ids already
    matching Slice 7's `/portfolio/$slug` slugs
  - `src/store/index.ts` — `PortfolioDataInter` / `ImagesDataInter` / `VideosDataInter`, the
    shapes that become `libs/shared/types`. **The Zustand store itself is not ported** — the
    seam here is `use-content-stub.ts` ([D15](../decisions-d01-d16.md#d15))
  - `src/routes/homepage/skill-list/skill-list.const.ts` — the Developer / Tools / UI-UX lists
  - `public/images/portfolio/**` → `apps/shell/public/images/portfolio/**`, paths unchanged
    so every `src` string stays correct unedited

  ⚠️ **Never port from the local `master` branch** — it is stale and silently omits the
  Pokémon Pet Shop item. And `static/media/**` is CRA build output with hashed filenames, not
  a source.
- **[D29](../decisions-d17-d32.md#d29)** — the content shapes go in `libs/shared/types` and the
  fixture data in `libs/shared/fixtures`, because Slice 7 reads them too. Two consumers is
  the threshold, and this is it.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/homepage` is a skeleton.
- **[D42](../decisions-d42-d47.md#d42)** — image URLs come in the props payload alongside the rest
  of the content. The homepage renders `<img src={item.image}>`; it never composes a path.
- **[D43](../decisions-d42-d47.md#d43)** — the Header's anchors target **this slice's sections**,
  so each one carries a stable `id` and a `scroll-margin-top` from the header-height token.
  ⚠️ **The `location.hash` re-apply is NOT this slice's code** — it lives in the shell's
  `src/mfe-loader/` and is built in [Slice 4](./04-error-boundaries.md), because the shell
  layout is a pre-created seam and this slice is one of three concurrent agents. This slice
  owns the `id`s and the offset, and **confirms the pair works together** by cold-loading
  `/#<section>` — if it scrolls nowhere, report it rather than reaching into the shell.
- **[D21](../decisions-d17-d32.md#d21)** / **[D50](../decisions-d48-d52.md#d50)** —
  `@portfolio/homepage` and `@portfolio/feature-homepage`, bare project names `homepage` and
  `feature-homepage`.
- **[D44](../decisions-d42-d47.md#d44)** — both projects carry `scope:homepage`. ⚠️ Slice 4
  creates and tags them; an untagged arrival is a finding, not something to fix in passing.
- **[D51](../decisions-d48-d52.md#d51)** — `src/styles.css` `@import`s `@portfolio/ui-theme`;
  there is no `tailwind.config.ts`. Any class used only inside this feature lib needs an
  `@source` line in the theme — a missing one renders unstyled with a green build
  ([R3](../risks.md#r3), which fired in Slice 1).

## Open questions blocking this slice

- ✅ **[Q14](../questions-closed-q9-q16.md#q14) closed 2026-09-20 →
  [D48](../decisions-d48-d52.md#d48).** The shell **does** emit server-rendered metadata, so
  it reads this slice's fixtures as well as the remote doing so. This slice supplies the
  homepage route's `title` and `description` values alongside its content — it is no longer
  an open question, it is a deliverable.
- ✅ **[Q17](../questions-closed-q9-q16.md#q17) closed 2026-09-21 →
  [D69](../decisions-d69.md#d69), and ⚠️ it never blocked this slice.** The entry here said
  the field's shape "is decided here, because this slice writes the fixtures" — **that was
  wrong on both halves.** `description` lands on `PortfolioItem`, which the
  [D67](../decisions-d63-d67.md#d67) split assigns to **Slice 7**, and at `39bbe56`
  `dangerouslySetInnerHTML` appears in exactly one file — the item page. The homepage
  listing renders thumbnail and title and never touches `description`. So this slice was
  held by a question it did not depend on; it is not held now, and it does not add a
  `description` field to anything.

  For the record, the answer is: the field stays an HTML string, sanitized with `dompurify`
  at the render boundary, in Slice 7's component.
- **[Q2](../questions-closed.md#q2)** — ✅ **closed 2026-09-21 as
  [D55](../decisions-d55.md#d55): this slice exists in its current form.** The existential
  risk it carried is gone — the spike gate passed, federation does compose with TanStack
  Start scoped to the client build, and the fallback to monorepo imports is not needed. This
  slice is a remote, not a lib. ⚠️ Build its vite config from
  [D55](../decisions-d55.md#d55) rather than from scratch: the `applyToEnvironment` scoping
  and the `type: 'module'` remote form were each found by failing first.

[Q12](../questions-closed-q9-q16.md#q12) closed as [D42](../decisions-d42-d47.md#d42): the portfolio images
arrive **as props from the shell**, so this slice's components never build an image URL and
the dev/prod origin trap does not reach them. Two more closed on 2026-09-20:
[Q1](../questions-closed.md#q1) → [D34](../decisions-d33-d41.md#d34) (the v3 site is the visual
reference) and [Q6](../questions-closed.md#q6) → [D41](../decisions-d33-d41.md#d41) (the fixtures are
real copy). Taken together they mean this slice **ports** the v3 homepage — its look and its
words — rather than inventing either.

## What is on screen at the end

A real homepage: intro, a portfolio listing, and whatever further sections the live v3
homepage has ([D34](../decisions-d33-d41.md#d34)), rendered from its own bundle with header
and footer around it, all four pieces
visually consistent.

**Stubbed:** every word and every portfolio entry comes from
`libs/shared/fixtures/src/*.fixture.ts`, read through the single `use-content-stub.ts`
seam. The report names `libs/shared/fixtures` as the *source*, per
[D22](../decisions-d17-d32.md#d22) — not as a warning that the copy is placeholder. Per
[D41](../decisions-d33-d41.md#d41) this is the site's real content, and the Contentful plan
moves it rather than replacing it.

## Files this slice creates and modifies

**`apps/homepage`** — skeleton

- `vite.config.ts` with the MF plugin, `exposes` and `base`
  ([D42](../decisions-d42-d47.md#d42)); `src/styles.css`; `src/main.tsx`; `src/bootstrap.tsx`
- ⚠️ `project.json` and `package.json` are **pre-created and tagged by Slice 4**
- ✅ **The whole app skeleton is already built and runnable** — `vite.config.ts` (federation,
  `exposes`, `base`, port 4176 with `strictPort`), `index.html`, `src/main.tsx`,
  `src/bootstrap.tsx`, `src/styles.css`, and the `dev` / `build` / `preview` targets.
  `pnpm nx dev homepage` serves this remote standalone on 4176 and publishes
  `remoteEntry.js`; the shell loads it and renders it today. ⚠️ **This slice most likely
  changes nothing in `apps/homepage`** — see [`apps/homepage/README.md`](../../../../apps/homepage/README.md).
- ⚠️ **What it renders is a placeholder, and replacing it is this slice's job**:
  `libs/features/homepage/src/homepage.tsx` exports `Homepage` with a stand-in body. Its spec
  asserts the string `"Slice 6 fills this"`, which **fails the moment the real component
  lands** — that assertion exists so the placeholder cannot ship unnoticed, and deleting it
  is part of this slice.
- ⚠️ **The dev port is 4176 with `strictPort: true`, and it is not negotiable.** The shell
  resolves this remote at `http://localhost:4176/remoteEntry.js` (`DEFAULT_HOMEPAGE_ORIGIN` in
  `libs/shared/config`). A silently reassigned port makes the registry point at nothing, and
  the only symptom is this remote's fallback rendering forever.

**`libs/features/homepage`**

- `project.json`, `src/index.ts`, the homepage and its sections — one component per file
  ([one-component-per-file.md](../../../../.claude/rules/one-component-per-file.md)) — with
  specs
⚠️ **`use-content-stub.ts` is NOT created by this slice.** It lives in
`libs/shared/fixtures`, [Slice 7](./07-portfolio-item-mfe.md) reads the same seam, and a
single file cannot be authored by two concurrent agents — so **the coordinator writes it in
[Slice 4](./04-error-boundaries.md)** with both read signatures stubbed. This slice *reads*
it and fills in the homepage's data behind it. (It cannot live in this feature lib either:
`scope:portfolio-item` may depend only on its own scope and `scope:shared`, so a hook owned
by `scope:homepage` is rejected by `@nx/enforce-module-boundaries` at `error` —
[D29](../decisions-d17-d32.md#d29), [D44](../decisions-d42-d47.md#d44).) It is **the only
place** fixture data is read: a section importing a fixture directly has broken the seam and
the Contentful plan will pay for it.

**`libs/shared/types`** and **`libs/shared/fixtures`** — ⚠️ **co-owned with Slice 7**

> ⚠️ **The portfolio listing on this page reads a fixture this slice does not own.**
> `usePortfolioItems()` returns `PORTFOLIO_ITEMS` from
> `portfolio-items.fixture.ts`, which the split assigns to **Slice 7** and which is an
> **empty array** until Slice 7 lands. So the listing section renders zero items in this
> slice's own dev server and in the composed page, and that is **correct, not a bug to
> work around**. Build the section against the seam, give its spec its own items, and
> render the empty state deliberately — do not seed the fixture to see something on
> screen, and do not import the homepage's own copy of the item list. Say in the report
> that the listing was verified against spec data and an empty live fixture, so the
> screenshot is read for what it is. The listing fills in when Slice 7 ports the nine
> items; if the wave lands out of order, that is the moment to re-screenshot.

- The homepage's content shapes and fixture data, **in the specific modules the coordinator
  named before the wave started**. Both projects are shared with Slice 7, so the split is by
  file and it is settled in advance — do not add a shape to a module this slice does not own,
  and do not edit either barrel. If a file outside the named set reports as modified since
  read, **halt** ([no-cross-plan-drift.md](../../../../.claude/rules/no-cross-plan-drift.md)).

**Pre-created, filled by this slice**

- The homepage registry entry and its route mount
- The homepage route's `head` values — title and description
  ([D48](../decisions-d48-d52.md#d48))

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=homepage,feature-homepage,shared-types,shared-fixtures
```

⚠️ `shared-types` and `shared-fixtures` are **co-owned with Slice 7**, not merely adjacent.
The coordinator owns both barrels *and* `use-content-stub.ts`, and names the per-file split
before the wave starts; each agent writes only the modules assigned to it. Running the gate
on these two projects means running it over the other agent's in-flight work too — so a
failure in a module this slice does not own is **reported, not fixed**.

Plus a screenshot of the full composed page.

## Notes for whoever builds this

- **One seam, not six.** The value of the whole fixture approach is that Slice 1 of the
  Contentful plan changes one file. Spreading fixture reads across sections turns that into
  a refactor.
- **Type the fixtures against the real shape**, as best it is understood now. A fixture
  typed loosely hides the shape mismatch until the day the real data arrives, which is the
  worst possible day to find it.
- [spec-through-the-parent.md](../../../../.claude/rules/spec-through-the-parent.md)
  applies: a prop added to a section is not wired until a spec renders it through the
  homepage that supplies it.
