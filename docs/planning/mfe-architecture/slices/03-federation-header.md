# Slice 3 — Module Federation, proved with the Header

**Status:** not started · **Visible?** ✅ screen · **Depends on:** Slice 2
**Design:** the live v3 site ([D34](../decisions-d33-d41.md#d34)) — appearance only; no Next.js
code is ported ([D6](../decisions-d01-d16.md#d6))

⚠️ **The riskiest slice in the plan.** It carries a spike gate, and it may end in a report
rather than a working remote. That is an acceptable outcome; building slices 5 through 7 on
an unproven seam is not.

## Decisions that bind this slice

- **[D1](../decisions-d01-d16.md#d1)** — the remote is a standalone React + Vite app.
- **[D2](../decisions-d01-d16.md#d2)** — the shell consumes it; it knows nothing of the shell
  beyond the props it receives.
- **[D8](../decisions-d01-d16.md#d8)** / **[D9](../decisions-d01-d16.md#d9)** / **[D36](../decisions-d33-d41.md#d36)**
  — the shell SSRs the page and the remote loads and hydrates on the client. **No federated
  SSR.** Not as a first pass, not as an experiment. D36 closed the question of whether to
  reconsider, and the answer was no.
- **[D39](../decisions-d33-d41.md#d39)** — React and React DOM are shared with `singleton: true`,
  **`strictVersion: false`**, the version pinned once at the workspace root. ⚠️ This slice
  writes the shared-dependency config, so it also **records the CI requirement that Slice 8
  implements**: a check that every app resolves the same React major. Without it,
  `strictVersion: false` is a disabled guard rather than a relocated one.
- **[D19](../decisions-d17-d32.md#d19)** — `@module-federation/vite`, using **runtime** remote
  resolution. The remote URL comes from `libs/shared/config` at runtime and is never baked
  into the shell's bundle; that property is what [D12](../decisions-d01-d16.md#d12) depends on.
- **[D27](../decisions-d17-d32.md#d27)** — `apps/header` is a skeleton whose `exposes` map points
  at `libs/features/header`. The remote's public surface is one line of config.
- **[D43](../decisions-d42-d47.md#d43)** — the Header is fixed, and the offset it creates is handled
  by `scroll-margin-top` on the target sections, sized from the **header-height token in
  `libs/ui/theme`**. This slice adds that token. ⚠️ The Header and the Homepage are different
  remotes that must agree on one number; [D26](../decisions-d17-d32.md#d26)'s shared preset is what
  lets them do it at build time instead of across the federation boundary.

## Open questions blocking this slice

- **[Q2](../open-questions.md#q2)** — **narrowed, not closed.** The runtime half is
  answered: server-side federation was impossible on `workerd`
  ([D30](../decisions-d17-d32.md#d30)) and the host has since moved to Lambda
  ([D31](../decisions-d17-d32.md#d31)), while client-side federation works on both. What is still
  unproven is that `@module-federation/vite` and TanStack Start's build coexist, with
  federation scoped to the **client environment only**. This slice is the answer path.
[Q4](../questions-closed.md#q4) also blocked this slice and closed on 2026-09-20 as
[D39](../decisions-d33-d41.md#d39), above.

Two more were raised on 2026-09-20 and both closed the same day:

- **[Q13](../questions-closed.md#q13) → [D43](../decisions-d42-d47.md#d43)** — ⚠️ **the Header
  navigates by anchor, not by route.** Its links are in-page jumps to sections. So the
  shared-dependency set this slice writes stays `react`, `react-dom`, `@portfolio/ui-*` —
  **no router singleton**, no `onNavigate` prop, no injected `Link`. The Header emits plain
  `<a href="#id">`, and `/#id` when it is not on the homepage.
- **[Q12](../questions-closed.md#q12) → [D42](../decisions-d42-d47.md#d42)** — content images
  arrive as props from the shell, so a remote never builds a content URL. But
  **component-owned** UI assets ship with the remote, so ⚠️ **this slice sets Vite `base` to
  the remote's deployed CloudFront URL** and the other remotes copy the pattern. A relative
  asset URL resolves against the page's origin, which is the shell's — identical on
  localhost, wrong behind CloudFront.

## The spike gate

**Before building anything in the file list below**, prove the seam:

1. A throwaway remote exposing a component that renders one string.
2. The shell loading it at runtime, after SSR, **from the built Lambda handler** — not
   only from the Vite dev server, because that is not where it has to work. The SSR build
   must come out untransformed by the federation plugin; if federation has leaked into the
   server bundle, this is where it shows.
   ⚠️ Note what the spike does **not** need to prove any more: that the server can load a
   remote. It cannot, and it is not meant to ([D32](../decisions-d17-d32.md#d32)).
3. React confirmed as a single instance (a hook in the remote, state that survives a
   re-render from the shell).
4. ⚠️ **An asset referenced by the remote resolves from the remote's origin, not the
   shell's** ([D42](../decisions-d42-d47.md#d42)). Serve the spike's remote from a *different* port
   than the shell and reference one image from it. Same-origin dev servers hide this
   entirely, which is exactly why it belongs in the spike rather than in a later slice.

If all four pass — including the cross-origin asset check, which is the one a same-origin
dev server hides — discard the spike and build the real slice. If any fails, **stop and
report** with what broke and how far it got. Do not work around it by introducing federated
SSR, and do not proceed to [Slice 4](./04-error-boundaries.md).

The fallback positions, in order: load remotes purely client-side outside Start's build
graph; host the MF runtime inside a client-only boundary; back out to monorepo imports
(cheap, because of [D27](../decisions-d17-d32.md#d27)) and revisit federation later.

## What is on screen at the end

The shell's page with a **real Header**, rendered from a separately built bundle, styled by
the shared theme so it is visually indistinguishable from the rest of the page. Stopping
the header's dev server and reloading shows the page still rendering — without a graceful
fallback yet, which is Slice 4.

**Stubbed:** the header's content is hardcoded in its feature lib. Navigation targets may
point at routes that do not exist yet.

## Files this slice creates and modifies

**`apps/header`** — skeleton only

- `project.json`, `vite.config.ts` with the MF plugin, `tailwind.config.ts` extending the
  preset, `src/main.tsx` (standalone dev entry), `src/bootstrap.tsx`
- The `exposes` map, pointing at `@portfolio/feature-header`
- The `shared` config: `react`, `react-dom`, `@portfolio/ui-components`,
  `@portfolio/ui-theme`

**`libs/features/header`**

- `project.json`, `src/index.ts`, the Header component and its parts, each with specs

**`libs/shared/config`** — modified

- The remote registry gains its first real entry: name, dev URL, production URL source
- The registry's spec

**`apps/shell`** — modified

- The MF host config, the runtime registry read, and the client-side mount point in the
  layout

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=header,feature-header,shared-config,shell,feature-shell
```

Plus: the composed page in a browser, the header's own dev server running standalone, and a
screenshot of both.

## Notes for whoever builds this

- **Run the remote standalone too.** An MFE that only renders inside the shell is harder to
  develop and harder to debug. `apps/header`'s `main.tsx` exists for exactly that.
- **The registry is a seam, not a convenience.** Slices 5 through 7 all write to it
  concurrently, so its shape is settled here and pre-populated in Slice 4.
- Write down what the spike actually proved, in the completion report, including anything
  it did *not* cover. The next three slices will be trusting it.
