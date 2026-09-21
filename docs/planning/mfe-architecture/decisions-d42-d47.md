# Decisions D42–D47 — The second round, and the tooling prune

Q11 through Q16, raised on 2026-09-20 by re-reading the plan against the repository as it
actually stood, and answered the same day.

Part of the decisions log. The index, and the rule that decisions are never
renumbered and never deleted, are in [decisions.md](./decisions.md).

| # | Decision |
|---|---|
| [D42](#d42) | Content images travel in the props payload from the shell; only component-owned UI assets ship with a remote |
| [D43](#d43) | The Header navigates by anchor, so no router is shared |
| [D44](#d44) | ESLint owns correctness and the module boundaries; Biome owns formatting |
| [D45](#d45) | Node 22, pinned by `.nvmrc` |
| [D46](#d46) | The cosmikata tooling is pruned; 15 rules are archived, not deleted |
| [D47](#d47) | `worktree-safety.md`'s base branch is unresolved and stays that way |

---

<a id="d42"></a>**D42 — Content images travel in the props payload from the shell; only
component-owned UI assets ship with a remote.** Closes
[Q12](./questions-closed-q9-q16.md#q12). Two rules, because there are two kinds of asset and they
have opposite answers.

**1. Content images — portfolio photos, thumbnails — live with the shell** and their URL is
supplied to the remote as data, never constructed by the remote.

This falls straight out of [D15](./decisions-d01-d16.md#d15): the shell owns content and hands it over as props.
An image *is* content. So `libs/shared/fixtures` carries the URL, the shell passes it, and
the remote renders `<img src={props.item.image}>` without ever resolving a path itself. A
remote that never builds an asset URL cannot get the origin wrong.

⚠️ **The reason this is right rather than merely easy: it is what Contentful turns into.**
Post-MVP those URLs become absolute `images.ctfassets.net` links inside the content payload.
If the images ship inside a remote's bundle today, that later becomes a migration. If they
arrive as data today, the Contentful plan changes a fixture value and nothing else. The
seam [D15](./decisions-d01-d16.md#d15) already describes is the same seam.

The cost is honest and small: an image change redeploys the shell, which nicks
[D12](./decisions-d01-d16.md#d12). It is accepted because it is **temporary** — this is fixture-era content that
Contentful replaces — and because the alternative duplicates the same photo into both the
Homepage and Portfolio Item bundles, which two remotes needing one image otherwise forces.

**2. Component-owned UI assets — an icon, a font, a background SVG that is part of how a
component looks — ship with the remote**, and each remote's Vite `base` **must** be set to
its deployed CloudFront URL.

This is where [Q12](./questions-closed-q9-q16.md#q12)'s dev/prod trap actually lives, and it does not
go away under rule 1. A relative asset URL in a federated remote resolves against the
**page's** origin, not the bundle's. On localhost they are the same and every check passes;
behind CloudFront, with the remote under a versioned key prefix ([R12](./risks.md#r12)),
it 404s. [Slice 3](./slices/03-federation-header.md) sets `base` and the other remotes copy
the pattern.

<a id="d43"></a>**D43 — The Header navigates by anchor, so no router is shared.** Closes
[Q13](./questions-closed-q9-q16.md#q13). The Header's links are in-page jumps to sections, not route
changes, which removes the coupling the question was about: **the shared-dependency set
stays `react`, `react-dom`, and `@portfolio/ui-*`.** No router singleton, no `onNavigate`
prop, no injected `Link`. The Header emits plain `<a href="#id">`.

Three mechanics that follow, and the middle one is the one that will otherwise ship broken:

**The fixed-header offset is a theme token, not a measurement.** The header is fixed, so a
raw anchor jump lands with the section's top under the header. The fix is
`scroll-margin-top` on each section, sized from the header-height token in `libs/ui/theme`
— the same token the Header sets its own height from. ⚠️ This is the interesting part: the
Header and the Homepage are **different remotes** that must agree on one number, and
[D26](./decisions-d17-d32.md#d26)'s shared preset is what lets them do it at build time instead of passing a value
across the federation boundary at runtime. No JS measures anything.

⚠️ **The anchor target lives in a remote that has not loaded yet.** The sections are inside
the Homepage remote, which arrives after hydration ([D36](./decisions-d33-d41.md#d36)). So a cold deep link to
`/#work`, or a click before the remote mounts, finds no element — and **the browser does not
retry.** It fails silently, which is this plan's recurring failure shape. The shell
therefore re-applies `location.hash` once the Homepage remote mounts. The shell already
wraps each remote in a boundary ([D16](./decisions-d01-d16.md#d16), Slice 4), so it is the layer that knows.

**Off the homepage the anchors are `/#id`, not `#id`.** On `/portfolio/$slug` there is no
`#work` to scroll to, so the Header's links must carry the path. A plain anchor does a full
page load, which is acceptable and keeps the boundary; if that is later unwanted, the shell
intercepts same-origin anchor clicks with one listener — still without the remote importing
a router.

<a id="d44"></a>**D44 — ESLint owns correctness and the module boundaries; Biome owns
formatting.** Closes [Q11](./questions-closed-q9-q16.md#q11). The maintainer added
`eslint.config.mjs` on 2026-09-20 with `@nx/enforce-module-boundaries` at `error`, which is
the half that matters: [D27](./decisions-d17-d32.md#d27) and [D29](./decisions-d17-d32.md#d29) are import-graph rules and now have a
mechanism rather than a convention. `biome.json` stays as the formatter and import
organizer.

⚠️ **As committed, neither file ran correctly**, and both were repaired the same day under
[D46](#d46) — `tools/eslint/module-boundaries.mjs` now exists and the plugins are declared.
[Q15](./questions-closed-q9-q16.md#q15) closed with that repair. Slice 1 no longer owns the repair;
it owns installing and proving it, and tagging every project so the constraints are not
silently inert.

<a id="d45"></a>**D45 — Node 22, pinned by `.nvmrc`.** Closes
[Q16](./questions-closed-q9-q16.md#q16) in substance. `.nvmrc` (22) and `.npmrc` were added
2026-09-20, so [D24](./decisions-d17-d32.md#d24)'s premise is on its way to being true.

One residue for [Slice 8](./slices/08-independent-deployment.md), which is not a decision:
its workflow must read the same `.nvmrc` rather than restating a version. The other residue —
`package.json` carrying no `packageManager` or `engines` field — was closed by [D46](#d46),
which pinned pnpm 10.33.0 and Node 22.

<a id="d46"></a>**D46 — The cosmikata tooling is pruned; 15 rules are archived, not deleted.**
Closes [Q15](./questions-closed-q9-q16.md#q15) and discharges [R10](./risks.md#r10)'s mitigation,
which had no owner until now. Done 2026-09-20.

**Archived to `.claude/rules-archive/`** — 15 of 47, leaving 32 active. They describe a
stack this project does not have: a database (`drizzle-migrations`, `id-generation`,
`platform-user-id-column-naming`), Expo/React Native (`expo-public-env-vars`,
`main-app-platform`, `no-router-push`), an i18n layer (`i18n-all-locales`,
`i18n-no-silent-failures`, `no-em-dash-translations`, `no-hardcoded-strings`,
`button-label-lowercase`), a Zustand store layer (`zustand-selector-hooks`), and a
`@cosmikata` design system with a Figma token pipeline (`design-system`,
`design-audit-in-slice`, `no-design-token-edits`).

⚠️ **Moved rather than deleted, and the reason is mechanical, not sentimental.**
`.claude/*` is gitignored and **nothing under it is tracked**, so a deleted rule file has no
recovery path at all — not a revert, not a reflog. `.claude/rules-archive/README.md` records
why each one went and the one-line `mv` that restores it.

**Three archived rules leave a real gap**, and the archive says so rather than letting it
pass silently. `design-system.md`'s substance — build from the shared library, never
hand-roll a primitive, never use a raw palette value — applies here in full; only its
package names are wrong. **[Slice 2](./slices/02-ui-libs.md) writes a `@portfolio` version**
as it creates `libs/ui/*`. `design-audit-in-slice.md` wants rewriting once sibling screens
exist to audit against, Slice 5 at the earliest. And the lowercase-button voice is a design
choice rather than an i18n one, so it belongs in that Slice 2 rule if the v3 site has it.

**Also repaired the same day**, all of it previously half-ported:

- **`eslint.config.mjs`** — the missing `tools/eslint/module-boundaries.mjs` was written
  against this workspace's own tag vocabulary, so [D2](./decisions-d01-d16.md#d2),
  [D25](./decisions-d17-d32.md#d25), [D27](./decisions-d17-d32.md#d27) and
  [D29](./decisions-d17-d32.md#d29) have a mechanism —
  ⚠️ **conditional on every project being tagged.** `@nx/enforce-module-boundaries` is
  *silently inert* for a project carrying no matching tag: it is unconstrained and the rule
  passes rather than failing. So the claim in this sentence is only true once Slice 8's
  project-tag check exists, and until then these four decisions are enforced for the
  projects somebody remembered to tag. Stale ignores (`.wrangler`, `_wip`, `mockServiceWorker.js`,
  `libs/shared/assets`) removed; `@typescript-eslint/no-deprecated` raised from `warn` to
  `error` because an empty workspace has no backlog to grandfather.
- **`coding-conventions.md`** — the "No Pressable" section was React Native and is gone. The
  arrow-function and no-prop-drilling-wrapper conventions stay.
- **`.nxignore`** — reduced to `.claude/worktrees`; the `_wip` entry and its cosmikata plan
  citation are gone.
- **`biome.json`** — an `@portfolio/**` import group added. It previously had none, so this
  workspace's own packages would not have been grouped ([D21](./decisions-d17-d32.md#d21)).
- **`package.json`** — the deleted v3 site's Next.js manifest replaced with a workspace root:
  `packageManager` pinned to pnpm 10.33.0 and `engines` to Node 22 (completing
  [D45](#d45)), the seven devDependencies the lint and format gates need, and `next` plus
  the whole `eslint-config-next` set removed ([D6](./decisions-d01-d16.md#d6)).

⚠️ **None of this runs yet.** There is no `node_modules`, no `nx.json`, and no project to
lint. The configs are correct and parse; [Slice 1](./slices/01-workspace-and-shell.md)
installs and proves them.

<a id="d47"></a>**D47 — `worktree-safety.md`'s base branch is unresolved and stays that
way.** The rule requires every worktree to be cut from `develop` and halts otherwise. **This
repo has no `develop`** — its branches are `master`, `development`, and the version lines.

Left as-is deliberately rather than edited during the [D46](#d46) prune: which branch is the
integration branch is the maintainer's call, not a find-and-replace. ⚠️ Until it is answered,
**any worktree this repo creates will trip that rule's halt condition** on its
`origin/develop` ancestry check. It is recorded here rather than in
[open-questions.md](./open-questions.md) because it blocks no slice — the plan's work happens
in the main checkout.
