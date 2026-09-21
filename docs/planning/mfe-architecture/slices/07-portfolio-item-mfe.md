# Slice 7 — Portfolio Item MFE and its route

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 4
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))
**Wave:** runs concurrently with Slices 5 and 6

The only remote behind a dynamic route, which makes it the only one whose fallback has to
think about navigation.

## Decisions that bind this slice

- **[D1](../decisions-d01-d16.md#d1)** / **[D2](../decisions-d01-d16.md#d2)** / **[D8](../decisions-d01-d16.md#d8)**
  — standalone remote, consumed by the shell, client-side hydration.
- **[D4](../decisions-d01-d16.md#d4)** — routing belongs to the shell. `/portfolio/$slug` is a
  TanStack Start route; the remote receives the resolved item, not the raw params, so it
  does no routing of its own.
- **[D15](../decisions-d01-d16.md#d15)** — data arrives as props. Same seam as the homepage.
- **[D22](../decisions-d17-d32.md#d22)** / **[D41](../decisions-d33-d41.md#d41)** — fixtures, and the
  report says so. The item copy is real.
- **[D53](../decisions-d53.md#d53)** — ported from commit `39bbe56`'s
  `src/store/{active,other}.data.ts`. The **nine ids are this route's slugs**:
  `pokemon-pet-shop`, `cosmikata`, `cosmikata-design-system`, `older-cosmikata`,
  `csp-generator-app`, `cw-breeze-thru`, `rove-logix`, `rove-logix-ui-update`,
  `cr-caterpillar`. ⚠️ **The image folder names do not match the slugs** —
  `cricket-wireless` holds `cw-breeze-thru`'s images and `corporate-reports` holds
  `cr-caterpillar`'s. The `thumbnail` and `images[].src` strings in the data are
  authoritative; never infer an item's images from a directory name.
  `videos` are YouTube embed URLs, so an item page can carry a third-party iframe.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/portfolio-item` is a skeleton.
- **[D21](../decisions-d17-d32.md#d21)** / **[D50](../decisions-d48-d52.md#d50)** —
  `@portfolio/portfolio-item` and `@portfolio/feature-portfolio-item`, bare project names
  `portfolio-item` and `feature-portfolio-item`.
- **[D44](../decisions-d42-d47.md#d44)** — both carry `scope:portfolio-item`. ⚠️ Slice 4
  creates and tags them; an untagged arrival is a finding to report.
- **[D51](../decisions-d48-d52.md#d51)** — `src/styles.css` `@import`s `@portfolio/ui-theme`;
  no `tailwind.config.ts`. A class used only in this feature lib needs an `@source` line in
  the theme or it renders unstyled with a green build ([R3](../risks.md#r3)).
- **[D48](../decisions-d48-d52.md#d48)** — ⚠️ **this route's `head` is the one D48 was taken
  for.** `/portfolio/$slug` emits its title, description and `og:image` server-side from the
  fixtures, while the visible item stays client-rendered by this remote.
- **[D42](../decisions-d42-d47.md#d42)** — the item's images arrive in the props payload. This
  remote composes no asset URL, so an image survives a rollback of this remote unchanged.
- **[D34](../decisions-d33-d41.md#d34)** — the item page matches the **live v3 site's** portfolio
  item page. ⚠️ Its *error state* does not exist on v3 and is invented, like Slice 4's
  fallbacks — flag it.
- **[D36](../decisions-d33-d41.md#d36)** — stays federated and client-rendered, so the item content
  is absent from the SSR HTML. Accepted, per Slice 6's note.

## Open questions blocking this slice

- ✅ **[Q14](../questions-closed-q9-q16.md#q14) closed 2026-09-20 →
  [D48](../decisions-d48-d52.md#d48)**, and ⚠️ **this is the route where it pays most.**
  `/portfolio/$slug` is the link people actually share, and before D48 it would have
  previewed as nothing. So this slice owns the per-slug `head`: the item's title,
  description and `og:image`, emitted server-side from the fixtures while the visible item
  stays client-rendered by the remote.
- **[Q17](../open-questions.md#q17)** — ⚠️ **this is the slice Q17 actually blocks.** The
  item body *is* the `description` HTML, so this slice cannot render a page until the
  question is settled: raw `dangerouslySetInnerHTML`, sanitized HTML, or structured data.
  ⚠️ The ported copy also carries `target="_blank"` without `rel="noopener noreferrer"`
  throughout — fixed in the port under any of the three options, not carried over.
- **[Q2](../open-questions.md#q2)** — not a decision anyone can make at a desk, but this
  slice **does not exist in its current form if the spike gate in
  [Slice 3](./03-federation-header.md) fails.** Federation must compose with TanStack Start
  scoped to the client build; if it does not, the fallback is monorepo imports and this
  slice becomes a lib, not a remote.

[Q12](../questions-closed-q9-q16.md#q12) closed as [D42](../decisions-d42-d47.md#d42) — the item's images
arrive as props from the shell, which matters more here than anywhere else, since an item
page is mostly images and [D41](../decisions-d33-d41.md#d41) makes them published content.

[Q1](../questions-closed.md#q1) closed on 2026-09-20 as [D34](../decisions-d33-d41.md#d34), leaving
the invented error state noted above.

## What is on screen at the end

`/portfolio/<slug>` renders a real portfolio item from its own bundle, reachable by
clicking through from the homepage listing, with header and footer in place.

Stopping this remote shows the **portfolio fallback with navigation back to the
portfolio** — the one fallback in the plan that has somewhere to send the user, per the
architecture doc's strategy.

An unknown slug is a shell-level not-found, not a remote failure. Those are different
states and must not collapse into the same UI.

**Stubbed:** items come from `libs/shared/fixtures`, read through the same
`use-content-stub.ts` seam — which lives in `libs/shared/fixtures` alongside the data, not
in `libs/features/homepage`, so that this scope can import it at all
([D29](../decisions-d17-d32.md#d29)), and which **the coordinator authors** so two concurrent
agents are not both writing one file.

## Files this slice creates and modifies

**`apps/portfolio-item`** — skeleton

- `vite.config.ts` with the MF plugin, `exposes` and `base`
  ([D42](../decisions-d42-d47.md#d42)); `src/styles.css`; `src/main.tsx`; `src/bootstrap.tsx`
- ⚠️ `project.json` and `package.json` are **pre-created and tagged by Slice 4**

**`libs/features/portfolio-item`**

- `project.json`, `src/index.ts`, the item page and its parts, one component per file,
  with specs

**`apps/shell`** — the pre-created route slot, filled in

- `src/routes/portfolio.$slug.tsx`: resolves the slug, handles not-found, mounts the remote
  inside its boundary, and emits the per-slug `head`
  ([D48](../decisions-d48-d52.md#d48))

**Pre-created by the coordinator, filled by this slice**

- The portfolio-item `libs/shared/config` registry entry. ⚠️ **Named here from 2026-09-21**:
  [parallelization.md](../parallelization.md) always listed the registry among this slice's
  shared files, but this list omitted it while Slices 5 and 6 both named theirs — so it was
  the one registry entry nobody owned.

**`libs/shared/types`** and **`libs/shared/fixtures`** — ⚠️ **co-owned with Slice 6**

- The item shape and its data, **in the specific modules the coordinator named before the
  wave started**. `use-content-stub.ts` is the coordinator's file — this slice reads the
  per-slug signature it stubbed and does not author it. Do not edit either barrel; if a file
  outside the named set reports as modified since read, **halt**
  ([no-cross-plan-drift.md](../../../../.claude/rules/no-cross-plan-drift.md)).

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=portfolio-item,feature-portfolio-item,shared-types,shared-fixtures,shared-config,shell
```

⚠️ **Co-owns** `shared-types` and `shared-fixtures` with Slice 6, and shares `shell` with the
coordinator. Write only the modules assigned to this slice. Running the gate over these
projects means running it over Slice 6's in-flight work too — a failure in a module this
slice does not own is **reported, not fixed**. Add `shared-config` to the list if the
registry entry above is filled in this slice.

Plus screenshots: the item page, the fallback with the remote stopped, and the not-found
state.

## Notes for whoever builds this

- **Keep routing in the shell.** A remote that reads route params directly is coupled to
  the shell's route shape and cannot be rendered standalone in its own dev server.
- **Not-found and remote-failed are different.** Conflating them tells a visitor the site
  is broken when they typed a bad URL, and tells them the item does not exist when a deploy
  failed. Both are wrong, and the second is worse.
- After this slice, all four remotes exist and the composition is complete. Slice 8 makes
  it deployable; Slice 9 proves it holds together.
