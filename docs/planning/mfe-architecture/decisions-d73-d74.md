# Decisions D73–D74 — what building Slice 7 forced

<a id="d73"></a>**D73 — the shell resolves the portfolio item and then never hands it to the
remote. `/portfolio/<slug>` rendered the wrong item.** ✅ **Fixed 2026-09-21** — see
*Resolution* below. Found by the Slice 7 agent,
verified by the coordinator, 2026-09-21.

`MfeRemoteMount` renders its lazy remote with **no props at all**:

```tsx
// libs/features/shell/src/mfe-loader/mfe-remote-mount.tsx:130
<RemoteComponent />
```

and `apps/shell/src/remotes/portfolio-item-remote.tsx` passes `slug` only to the *mount*,
where it is used for the diagnostic payload and the `route` label — never forwarded to the
remote. So the chain breaks at its last link:

| Step | State |
|---|---|
| `portfolio.$slug.tsx` resolves the item via `portfolioItemBySlug` | ✅ correct, built in Slice 4 |
| The route's `head` emits that item's title / description / `og:image` | ✅ correct, Slice 7 |
| The route decides not-found vs. mount from the resolved item | ✅ correct, Slice 4 |
| **The remote receives the item** | ❌ **nothing is passed** |

**The visible symptom is the worst kind: a wrong page that looks right.**
`/portfolio/<any-slug>` renders the remote's own standalone preview item —
`pokemon-pet-shop` — while the server-rendered `<head>` correctly describes the slug that
was asked for. So the tab title, the share preview and the `og:image` say one project and
the page shows another, and **nothing errors**.

## ⚠️ Why nothing caught it, which is the part worth keeping

This is [spec-through-the-parent.md](../../../.claude/rules/spec-through-the-parent.md)'s
exact failure, one level up from where that rule usually bites — in the **shell's mount**
rather than in a feature lib's call site. Every layer's own specs are green and correct:

- The remote's specs render `PortfolioItem` with an `item` prop supplied **by the spec**,
  which plays the part of the parent and always remembers.
- `MfeRemoteMount`'s specs assert loading, error and retry behaviour — not prop forwarding,
  because until now **no remote took a prop.** Header, Footer and Homepage take none, so
  `<RemoteComponent />` was correct for all three and stayed correct-looking for the fourth.
- Typecheck cannot see it: the remote is loaded through `lazy(() => import('portfolio-item/PortfolioItem'))`
  across a federation boundary, so its props are not typed at the mount at all.

The fix is a prop hop in **two shell files**, both closed to every wave agent — so the agent
correctly reported it rather than reaching for it. It is the coordinator's, and it is the
largest open item left in the wave.

⚠️ **Whatever fix lands must be proven by a spec that renders through the mount** and fails
when the forwarding line is deleted. A spec that hands `PortfolioItem` an `item` directly
will pass either way and prove nothing — that is how this got here.

### ✅ Resolution, 2026-09-21

`MfeRemoteMount` gained a generic `remoteProps`, spread onto the lazy component;
`portfolio-item-remote.tsx` forwards the item it now receives; `portfolio.$slug.tsx` passes
the item it had already resolved. Three lines of substance in three files.

The generic is the part worth noting: `onLoadRemote` is typed
`() => Promise<{ default: ComponentType<TRemoteProps> }>`, so the **call site** declares what
it is handing over and the compiler checks it — which is as much type safety as is available
across a federation boundary, where the remote's real props are not visible at all.

Proven per [prove-the-spec-can-fail.md](../../../.claude/rules/prove-the-spec-can-fail.md):
the forwarding was removed and `mfe-remote-mount-props.spec.tsx` went red with
*"nothing arrived"* in place of the slug, then restored and re-run green. Those specs live in
their own file — the mount's own spec crossed the 200-line cap, and prop forwarding is a
distinct enough concern to be findable.

Confirmed in the browser on the composed page: `/portfolio/cr-caterpillar` renders
**Caterpillar Inc. News App** with the matching tab title, where it previously drew
`pokemon-pet-shop` under a correct `<head>`.

---

<a id="d74"></a>**D74 — no portfolio image has been ported; all 43 referenced files 404, and
no slice could have ported them.** ✅ **Fixed 2026-09-21** — see *Resolution* below. Found by the Slice 7 agent, verified 2026-09-21.

`apps/shell/public/` **does not exist**. Every `thumbnail` and `images[].src` in the
fixtures resolves to nothing, and the `og:image` values D48 emits point at the same missing
files.

The numbers, recounted against the eight live items ([D71](./decisions-d71-d72.md#d71)):

| | Count |
|---|---|
| Unique image paths referenced by the 8 live items | **43** |
| Of those, present in v3's tree at `39bbe56` | **43 — none missing** |
| Files in `39bbe56:public/images/portfolio/**` | 85 |
| Unreferenced leftovers (incl. the commented-out ninth item's) | 42 |
| Size of the 43 referenced files | **4.5 MB** (the full 85 are 13.3 MB) |

⚠️ **D53's figures were "65 referenced, 20 unused" and both are wrong for the live set** —
they counted paths inside the commented-out block and non-unique occurrences. The live
figure is 43 referenced and 42 unreferenced.

## ⚠️ The structural cause: the port was assigned to a slice that could not do it

[Slice 6](./slices/06-homepage-mfe.md) carries the instruction
`public/images/portfolio/** → apps/shell/public/images/portfolio/**`. But
[parallelization.md](./parallelization.md) closes **all of `apps/shell/**`** to every wave
agent, and that closure is correct — three concurrent agents in the shell is what the wave
was designed to prevent.

So the images were assigned to an agent that was simultaneously forbidden from writing them.
**Neither agent was wrong and neither could have delivered it.** This is the third seam
contradiction found in this plan on the same day, after the `apps/shell` route exception and
the eight-vs-nine count — and all three share one cause: **a file list written in a slice
doc was never reconciled against the ownership table**.

The port is the **coordinator's**, like every other `apps/shell` write. It is mechanical —
the 43 referenced files, checked out from `39bbe56`, paths unchanged so every `src` string
in the fixtures stays correct unedited — and it is a decision the maintainer should take
knowingly, because it puts 4.5 MB of binaries into the diff.

### ✅ Resolution, 2026-09-21

The 43 files referenced by the eight live items were extracted from `39bbe56` into
`apps/shell/public/images/portfolio/**`, paths unchanged, so every `src` string in the
fixtures resolves without an edit. The 42 unreferenced leftovers were **not** taken.

Cross-checked both ways rather than trusting either side: all 43 paths named in the fixtures
resolve to a file on disk, and all 43 came from the commit. That check is what confirms the
Slice 7 agent's ported path strings against the real tree — including the two folders whose
names do not match their slugs (`cricket-wireless`, `corporate-reports`), which was the trap
D53 warned about.

Confirmed in the browser: the homepage tiles and the item galleries draw real images.

⚠️ **The seam contradiction that caused it is not fixed by porting the files.** Slice 6's
file list still tells a future reader that the images are its job, and
[parallelization.md](./parallelization.md) still forbids it. If that slice is ever re-run
from its doc, it will hit the same wall.
