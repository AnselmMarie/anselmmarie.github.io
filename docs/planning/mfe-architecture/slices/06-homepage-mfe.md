# Slice 6 — Homepage MFE, on fixtures

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 4
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))
**Wave:** runs concurrently with Slices 5 and 7

The first remote with real content shape behind it, and therefore the first place the
fixture seam matters.

## Decisions that bind this slice

- **[D1](../decisions-d01-d16.md#d1)** / **[D2](../decisions-d01-d16.md#d2)** / **[D8](../decisions-d01-d16.md#d8)**
  — standalone remote, consumed by the shell, client-side hydration.
- **[D36](../decisions-d33-d41.md#d36)** — ⚠️ **the homepage stays federated.**
  [Q9](../questions-closed.md#q9) asked whether to de-federate this surface so it would
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
  not a disclaimer: this slice writes the **real** portfolio copy, ported from the live v3
  site, and it is reviewed as published content rather than skimmed as a stub.
- **[D29](../decisions-d17-d32.md#d29)** — the content shapes go in `libs/shared/types` and the
  fixture data in `libs/shared/fixtures`, because Slice 7 reads them too. Two consumers is
  the threshold, and this is it.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/homepage` is a skeleton.
- **[D42](../decisions-d42-d47.md#d42)** — image URLs come in the props payload alongside the rest
  of the content. The homepage renders `<img src={item.image}>`; it never composes a path.
- **[D43](../decisions-d42-d47.md#d43)** — the Header's anchors target **this slice's sections**, so
  each one carries a stable `id` and a `scroll-margin-top` from the header-height token.
  ⚠️ **And the shell must re-apply `location.hash` once this remote mounts.** A cold deep
  link to `/#work` looks for an element that does not exist yet, because this remote loads
  after hydration ([D36](../decisions-d33-d41.md#d36)) — and the browser does not retry. It scrolls
  nowhere, silently. The shell owns the fix; this slice owns the `id`s and must confirm the
  pair works together.

## Open questions blocking this slice

- **[Q14](../open-questions.md#q14)** — whether the shell emits server-rendered metadata.
  It does not block the render, but it decides whether the shell reads this slice's fixtures
  too, or only the remote does.
- **[Q2](../open-questions.md#q2)** — not a decision anyone can make at a desk, but this
  slice **does not exist in its current form if the spike gate in
  [Slice 3](./03-federation-header.md) fails.** Federation must compose with TanStack Start
  scoped to the client build; if it does not, the fallback is monorepo imports and this
  slice becomes a lib, not a remote.

[Q12](../questions-closed.md#q12) closed as [D42](../decisions-d42-d47.md#d42): the portfolio images
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

- `project.json`, `vite.config.ts` with the MF plugin and `exposes`,
  `tailwind.config.ts`, `src/main.tsx`, `src/bootstrap.tsx`

**`libs/features/homepage`**

- `project.json`, `src/index.ts`, the homepage and its sections — one component per file
  ([one-component-per-file.md](../../../../.claude/rules/one-component-per-file.md)) — with
  specs
- `use-content-stub.ts` — ⚠️ **lives in `libs/shared/fixtures`, not in this feature lib.**
  [Slice 7](./07-portfolio-item-mfe.md) reads the same seam, and `scope:portfolio-item` may
  depend only on its own scope and `scope:shared`, so a hook owned by `scope:homepage` would
  be rejected by `@nx/enforce-module-boundaries` at `error`
  ([D29](../decisions-d17-d32.md#d29), [D44](../decisions-d42-d47.md#d44)). It is **the only
  place** fixture data is read: a section importing a fixture directly has broken the seam
  and the Contentful plan will pay for it.

**`libs/shared/types`** and **`libs/shared/fixtures`** — filled in

- The content shapes and the homepage fixture data, in the slots the coordinator
  pre-created

**Pre-created, filled by this slice**

- The homepage registry entry and its route mount

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=homepage,feature-homepage,shared-types,shared-fixtures
```

⚠️ `shared-types` and `shared-fixtures` are shared with Slice 7. If that slice runs
concurrently, the coordinator owns those two projects' barrels and each agent writes only
its own files inside them.

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
