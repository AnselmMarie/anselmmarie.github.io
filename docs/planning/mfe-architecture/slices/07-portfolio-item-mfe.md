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
  report says so. The item copy is real, ported from the v3 item pages.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/portfolio-item` is a skeleton.
- **[D42](../decisions-d42-d47.md#d42)** — the item's images arrive in the props payload. This
  remote composes no asset URL, so an image survives a rollback of this remote unchanged.
- **[D34](../decisions-d33-d41.md#d34)** — the item page matches the **live v3 site's** portfolio
  item page. ⚠️ Its *error state* does not exist on v3 and is invented, like Slice 4's
  fallbacks — flag it.
- **[D36](../decisions-d33-d41.md#d36)** — stays federated and client-rendered, so the item content
  is absent from the SSR HTML. Accepted, per Slice 6's note.

## Open questions blocking this slice

- **[Q14](../open-questions.md#q14)** — server-rendered metadata, and ⚠️ **this is the route
  where it pays most.** `/portfolio/$slug` is the link people actually share, and today it
  would preview as nothing.
- **[Q2](../open-questions.md#q2)** — not a decision anyone can make at a desk, but this
  slice **does not exist in its current form if the spike gate in
  [Slice 3](./03-federation-header.md) fails.** Federation must compose with TanStack Start
  scoped to the client build; if it does not, the fallback is monorepo imports and this
  slice becomes a lib, not a remote.

[Q12](../questions-closed.md#q12) closed as [D42](../decisions-d42-d47.md#d42) — the item's images
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
([D29](../decisions-d17-d32.md#d29)).

## Files this slice creates and modifies

**`apps/portfolio-item`** — skeleton

- `project.json`, `vite.config.ts` with the MF plugin and `exposes`,
  `tailwind.config.ts`, `src/main.tsx`, `src/bootstrap.tsx`

**`libs/features/portfolio-item`**

- `project.json`, `src/index.ts`, the item page and its parts, one component per file,
  with specs

**`apps/shell`** — the pre-created route slot, filled in

- `src/routes/portfolio.$slug.tsx`: resolves the slug, handles not-found, mounts the remote
  inside its boundary

**`libs/shared/types`** and **`libs/shared/fixtures`** — the item shape and its data

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=portfolio-item,feature-portfolio-item,shared-types,shared-fixtures,shell
```

⚠️ Shares `shared-types` and `shared-fixtures` with Slice 6, and `shell` with the
coordinator. Write only this slice's own files inside them.

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
