# Slice 5 — Footer MFE

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 4
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))
**Wave:** runs concurrently with Slices 6 and 7 — see
[parallelization.md](../parallelization.md)

The second remote, and the one that proves the Slice 3 pattern generalizes. It is
deliberately the smallest of the three.

## Decisions that bind this slice

- **[D1](../decisions-d01-d16.md#d1)** / **[D2](../decisions-d01-d16.md#d2)** — standalone React + Vite
  remote, consumed by the shell.
- **[D8](../decisions-d01-d16.md#d8)** / **[D36](../decisions-d33-d41.md#d36)** — client-side load and
  hydrate. No SSR for the remote, and that is now settled rather than provisional.
- **[D19](../decisions-d17-d32.md#d19)** — registered in the runtime registry, same as the header.
- **[D26](../decisions-d17-d32.md#d26)** — extends the shared Tailwind preset. It must not ship its
  own theme.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/footer` is a skeleton; the footer lives in
  `libs/features/footer`.

- **[D34](../decisions-d33-d41.md#d34)** — the footer is built to match the **live v3 site's**
  footer. Its content and layout are no longer invented, so the report describes divergences
  from v3 rather than flagging inventions.

## Open questions blocking this slice

- **[Q2](../open-questions.md#q2)** — not a decision anyone can make at a desk, but this
  slice **does not exist in its current form if the spike gate in
  [Slice 3](./03-federation-header.md) fails.** Federation must compose with TanStack Start
  scoped to the client build; if it does not, the fallback is monorepo imports and this
  slice becomes a lib, not a remote.

[Q1](../questions-closed.md#q1) closed on 2026-09-20 as
[D34](../decisions-d33-d41.md#d34).

## What is on screen at the end

A real footer at the bottom of the page, rendered from its own bundle, matching the rest of
the page visually. Stopping its dev server shows the footer fallback while the header and
the page content keep rendering, which is the failure-isolation claim becoming observable
for the first time with two remotes in play.

**Stubbed:** footer copy and links are hardcoded in the feature lib.

## Files this slice creates and modifies

**`apps/footer`** — skeleton

- `project.json`, `vite.config.ts` with the MF plugin and the `exposes` map,
  `tailwind.config.ts`, `src/main.tsx`, `src/bootstrap.tsx`

**`libs/features/footer`**

- `project.json`, `src/index.ts`, the footer component and its parts, with specs

**Pre-created by the coordinator, filled by this slice**

- The footer's `libs/shared/config` registry entry
- The footer mount in the shell layout

⚠️ **Nothing else.** The route tree, the other registry entries, the ui barrels, and the
root manifests belong to other agents in this wave or to the coordinator. Touching one of
them is the collision
[no-cross-plan-drift.md](../../../../.claude/rules/no-cross-plan-drift.md) describes; if a
file outside this list reports as modified since read, **halt and report**.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=footer,feature-footer
```

Run on this agent's own projects only. Plus a screenshot of the composed page and one of
the footer fallback with the remote stopped.

## Notes for whoever builds this

- Copy the header's app skeleton rather than reinventing it. Divergence between two remote
  configs is a maintenance cost with no upside, and any real difference belongs in a
  decision.
- The doc permits omitting the footer entirely when it fails, rather than rendering a
  fallback. Pick one deliberately and say which in the report.
