# Decision D53 — Where the portfolio content comes from

The index is [decisions.md](./decisions.md). Its own file because it is one decision on a
topic of its own — content provenance — rather than part of a round of questions closing.

<a id="d53"></a>**D53 — The portfolio content and images are ported from commit `39bbe56`,
which is `version-2`, `version-3` and the base of the deployed site alike.** Maintainer's
call, 2026-09-21.

## The choice offered was not a choice

The instruction was "take from the version-2 repo or the deleted version-3". Verified
against the repo: **`version-2` and `version-3` are the same commit.**

```
version-2         39bbe56…
version-3         39bbe56…
origin/version-2  39bbe56…
origin/version-3  39bbe56…
afe39bd^          39bbe56…   ← the parent of the "clean up" commit that deleted it all
```

So the deleted v3 tree and the version-2 branch are one tree reachable four ways. There is
nothing to choose between, and no second source to reconcile against. `git show
version-3:<path>` is the most legible way to reach it.

## ⚠️ The local `master` branch is stale — do not port from it

This is the trap the verification turned up, and it is the reason this entry names a commit
rather than a branch:

| Ref | Tip | Portfolio images | Has Pokémon Pet Shop |
|---|---|---|---|
| `version-2` / `version-3` | `39bbe56` | 85 | ✅ yes |
| `origin/master` (deployed) | `72260b8` | 85 | ✅ yes — content **identical** to `version-3` |
| **local `master`** | `802729e` | **76** | ❌ **no** |

`version-3` is an **ancestor of `origin/master`**, and their `src/store/*` files are
byte-identical — so the deployed site and the version branches agree, and
[D34](./decisions-d33-d41.md#d34)'s "the `version-3` / `master` branches" is accurate about
the *remote* master. The **local** `master` is a diverged, behind branch that merely shares
the name. Porting from it silently drops the whole **Pokémon Pet Shop** item — the newest
project, and the one [D48](./decisions-d48-d52.md#d48)'s own worked example cites as
`/portfolio/pokemon-pet-shop`.

## What is ported

| What | Where it lives at `39bbe56` | Size |
|---|---|---|
| The record shape | `src/store/index.ts` — `PortfolioDataInter`, `ImagesDataInter`, `VideosDataInter` | 3 interfaces |
| Active projects | `src/store/active.data.ts` | 110 lines |
| Other projects | `src/store/other.data.ts` | 400 lines |
| The skills lists | `src/routes/homepage/skill-list/skill-list.const.ts` | 39 lines |
| Images | `public/images/portfolio/**` | 85 files, 6 folders |

**Nine items**, and their ids are the `/portfolio/$slug` slugs [Slice 7](./slices/07-portfolio-item-mfe.md)
routes: `pokemon-pet-shop`, `cosmikata`, `cosmikata-design-system`, `older-cosmikata`,
`csp-generator-app`, `cw-breeze-thru`, `rove-logix`, `rove-logix-ui-update`,
`cr-caterpillar`.

**The data is internally consistent: 65 image paths referenced, 0 missing.** Verified by
resolving every `/images/…` string in both data files against the tree. Twenty of the 85
files are never referenced — leftovers from earlier versions (`instagram*`, `filezilla*`,
`cosmikata-new-0*`) — so the port takes the 65 that are referenced and leaves the rest.

⚠️ **`static/media/**` is NOT a source.** Those 64 images are CRA build output with
content-hashed filenames (`rebrand01.78bfc4a1480be022a411.jpg`). They duplicate the
`public/` originals at older revisions. Porting them would produce unreachable files with
unusable names.

⚠️ **The folder names do not match the slugs.** `cricket-wireless` holds `cw-breeze-thru`'s
images, `corporate-reports` holds `cr-caterpillar`'s, and `freelancing-concepts` holds
several items' between them. **The `thumbnail` and `images[].src` paths in the data are
authoritative**; do not infer an item's images from a directory name.

## Where it lands

- **Data and shapes** → `libs/shared/types` and `libs/shared/fixtures`, per
  [D22](./decisions-d17-d32.md#d22), [D29](./decisions-d17-d32.md#d29) and
  [D41](./decisions-d33-d41.md#d41). The v3 Zustand store is **not** ported — it is a state
  container for a Next.js app, and this plan's seam is `use-content-stub.ts`
  ([D15](./decisions-d01-d16.md#d15)). What ports is the data and the shape, not the store.
- **Images** → `apps/shell/public/images/portfolio/**`, keeping the existing paths so every
  `src` string in the data stays correct unedited. The shell serves them because
  [D42](./decisions-d42-d47.md#d42) has content images travelling in the props payload *from
  the shell* — a remote never composes a content URL. [Slice 8](./slices/08-independent-deployment.md)
  decides whether they move to their own S3 origin; nothing before it depends on that.

## What this does not settle

**How the HTML in `description` renders.** Every item's `description` is an HTML string
(`<p>`, `<ul>`, `<a target="_blank">`), not plain text. That needs a rendering decision and
it is raised as [Q17](./open-questions.md#q17) rather than decided here.

**`videos`** are YouTube embed URLs (`https://www.youtube.com/embed/…`), so they carry no
local asset and no porting work — but an embedded iframe is a third-party surface, and the
item page is the only place it appears.
