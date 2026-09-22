# Decisions D63–D67 — what building Slice 4 forced

The index is [decisions.md](./decisions.md). Their own file because all five came out of
building [Slice 4](./slices/04-error-boundaries.md) on 2026-09-21. Three of them
([D63](#d63), [D65](#d65), [D66](#d66)) are things the architecture doc implies but does
not say, and the implementation could not stay silent about.

---

<a id="d63"></a>**D63 — the homepage section list moved to `@portfolio/shared-fixtures`
as `SITE_SECTIONS`, with its shape as `SiteSection` in `@portfolio/shared-types`.** Forced
by building, 2026-09-21.

[D43](./decisions-d42-d47.md#d43) made the section `id`s a contract between the Header
remote and the Homepage remote, and
[`header-sections.const.ts`](../../../libs/features/header/src/header-sections.const.ts)
warned in its own comment that a rename one side does not follow **fails silently** — the
link scrolls nowhere and nothing throws.

Slice 4's header fallback is the **third** reader. It cannot import
`@portfolio/feature-header`: [D16](./decisions-d01-d16.md#d16) forbids a fallback depending
on the remote it stands in for, and `@nx/enforce-module-boundaries` blocks `scope:shell`
from reaching `scope:header` at `error`. So the only two options were a hardcoded copy of
the ids in the shell — a second source of truth that **no spec in this workspace could
compare against the first** — or extraction.

Extracted. [D29](./decisions-d17-d32.md#d29)'s threshold is the second consumer and this is
the third. `HEADER_SECTIONS` survives as the Header's name for the same array, so Slice 3's
barrel, specs and call sites are unchanged.

⚠️ **This edits a Slice 3 file while Slice 3 is awaiting review.** Flagged rather than done
quietly: the alternative was shipping the silent-drift hazard D43 was written to prevent.

---

<a id="d64"></a>**D64 — `RemoteEntry` carries a `version`, defaulting to `dev`.** Forced by
building, 2026-09-21.

The architecture doc's *Error Reporting* asks for the MFE's deployment/version in every
diagnostic payload, and its *Immutable Deployment Interaction* turns on the shell knowing
which version it referenced when a failure happened — without it, a rollback is guesswork
about what was actually live.

There was nowhere for that value to come from. It is now a field on the registry row, read
from `PORTFOLIO_<REMOTE>_VERSION` and falling back to `dev`.
[Slice 8](./slices/08-independent-deployment.md) injects the real per-environment
identifier; until then every payload honestly reads `dev`.

---

<a id="d65"></a>**D65 — the boundary's `fallback` is a render prop, and the retry counter
lives in the mount, not in the boundary.** Forced by building, 2026-09-21.

The architecture doc sketches `fallback={<HeaderFallback />}`. An element cannot be handed
the retry action or the remaining count, so `fallback` is
`(props: MfeFallbackProps) => ReactElement` instead. It returns an element, so it is a
render prop and keeps its descriptive name under
[prop-naming-and-order.md](../../../.claude/rules/prop-naming-and-order.md).

The second half is the load-bearing one. **`React.lazy` caches the rejected promise from a
failed import.** A boundary that clears its own error re-renders the *same* lazy component,
React re-serves the *same* rejection, and the fallback reappears instantly — a retry button
that looks like it works and does not. A working retry has to produce a **new** lazy
component, which only the owner of the import can do. So `MfeRemoteMount` holds `attempt`,
rebuilds the `lazy` from it, and remounts the boundary by `key` — which is also how the
boundary satisfies the doc's *"reset its error state when the MFE is successfully
retried"*.

⚠️ The spec that proves this counts the import calls rather than reading the DOM. A spec
asserting only that the fallback went away would pass against the broken version too.

---

<a id="d66"></a>**D66 — an unknown `/portfolio/$slug` is a shell-level not-found, and it is
deliberately not a fallback.** Forced by building, 2026-09-21.

A remote that failed might work on a retry; a slug that does not exist never will.
Collapsing the two would put a "try again" in front of someone whose link is simply wrong,
and would let a real outage hide behind a not-found. The shell resolves the item **before**
the remote is asked for ([D4](./decisions-d01-d16.md#d4) — routing belongs to the shell),
and renders `PortfolioNotFound` in that case.

⚠️ **Invented UI**, like Slice 4's fallbacks — v3 has no equivalent page. Flagged per
[plan-design-links.md](../../../.claude/rules/plan-design-links.md).

---

<a id="d67"></a>**D67 — the Slice 5–7 wave's per-file split, settled before any agent
starts.** 2026-09-21.

[parallelization.md](./parallelization.md) requires the coordinator to name which module of
the co-owned `libs/shared/types` and `libs/shared/fixtures` each agent may open, because
pre-creating a barrel does not make the data modules inside it disjoint. The table is in
[parallelization.md](./parallelization.md#the-named-per-file-split-for-the-wave) and every
module carries an `OWNER:` banner in its own header, so an agent that opens the wrong file
is told so by the file rather than by the plan.

`use-content-stub.ts` is the coordinator's and **no agent may edit it**. It is written with
all three read signatures — `useHomepageContent`, `usePortfolioItems`, `usePortfolioItem` —
already in place.

---

<a id="d68"></a>**D68 — Slice 4 ships all four remotes *runnable*, with placeholder
components, rather than three empty project directories.** Maintainer's call, 2026-09-21.

⚠️ **This is a deliberate expansion of Slice 4 and a reduction of slices 5–7.** It was taken
after two failed attempts at the smaller version:

1. **First attempt** — `project.json` with `dev` / `build` / `preview` targets and no
   `vite.config.ts`. `nx dev footer` started Vite on its defaults, bound a **random free
   port** instead of 4175, printed a URL and exited 0. Every gate passed.
2. **Second attempt** — the targets removed, so the failure was at least honest
   (`Cannot find configuration for task footer:dev`). The maintainer's response was the
   decisive one: *"I can't run footer, homepage and portfolio-item by itself."* An MFE you
   cannot start is not a scaffold, it is a directory.

So each of the three now carries the **full app skeleton** — `vite.config.ts` copied from
`apps/header` ([D55](./decisions-d55.md)), `index.html`, `main.tsx`, `bootstrap.tsx`,
`styles.css`, `tsconfig.json` and its targets — plus a **placeholder component** at the real
name (`Footer`, `Homepage`, `PortfolioItem`) in its feature lib.

**What this buys:**

- `pnpm nx dev <remote>` works for all four, on its `strictPort` port, serving
  `remoteEntry.js`. `.claude/launch.json` carries all five apps.
- The composed page renders **four live remotes**, so the federation pipeline is proven
  end to end before the wave rather than after it.
- Failure isolation became *demonstrable on demand*: stop any one server and that region's
  fallback appears while the others keep rendering. Before this, the page could only ever
  show fallbacks.
- **[D43](./decisions-d42-d47.md#d43) got its first live verification.** The Homepage
  placeholder carries the real `SITE_SECTIONS` ids and `scroll-mt-header`, so a cold load of
  `/#other-projects` was observed scrolling on arrival, with `scroll-margin-top` computing to
  `64px` from the shared theme token.

**What it costs, stated plainly:**

- Slices 5–7 are smaller than their files describe. Each is now "replace one component and
  its spec", and most likely touches nothing in its `apps/` directory.
- ⚠️ **Three placeholders are on the composed page**, and a placeholder that ships is the
  obvious hazard. The guard is a spec per component asserting the string
  `"Slice N fills this"` — it **fails the moment the real component lands**, so the
  placeholder cannot survive its own slice, and it cannot be quietly left in either.

⚠️ **Not a licence to keep expanding Slice 4.** The line held is *wiring, not content*: no
placeholder makes a decision its slice owns — not a field, not a column, not a control. The
Homepage placeholder renders the section ids because they are an existing contract
([D63](#d63)); it renders no section content.
