# Decisions D101–D102

The re-ordering of the plan's tail, decided on 2026-09-23 before Slices 15 and 16 started.
[decisions.md](./decisions.md) is the index.

<a id="d101"></a>
## D101 — Slice 9 (E2E) runs before Slice 8 (deployment)

**Maintainer's call, 2026-09-23.** This supersedes the tail of
[D80](./decisions-d76-d81.md#d80)'s order. The two slices keep their numbers, for the
reason D80 gives.

```text
… → {12, 13→14, 15, 16} → 17 → 9 → 8
```

**Why this order works.** The "8 → 9" edge claimed that E2E asserts the *deployed* app. Slice
9's own notes contradict that: it runs "against a production-like build, not the dev
servers". A local `vite build` of the shell and all four remotes, served together, is that
build. Nothing in the suite needs AWS.

**What it buys:**

- **Deployment is gated from its first run.** Slice 8's deploy workflow runs after an E2E
  suite that already exists, so the first deploy of the site is also the first gated one.
  In the old order, Slice 8 shipped a pipeline with nothing checking failure isolation, and
  Slice 9 added that check afterwards.
- **Slice 8's three verifications get a tool.** "Roll a remote back and confirm a real
  browser sees it" ([R12](./risks.md#r12)) is a browser check. With the suite in place it
  can be a Playwright run against the deployed URL, not a manual look.
- **The workflow already exists.** `.github/workflows/ci.yml` runs the gates today. Slice 9
  adds its E2E job there, and Slice 8 adds the deploy jobs to the same file, per
  [D23](./decisions-d17-d32.md#d23)'s one-workflow rule. Neither slice creates the file.

**What moves with it:**

- **"The MVP is complete" moves from Slice 9 to Slice 8.** The public site exists once
  Slice 8 deploys it.
- Slice 9's dependency becomes Slices 15, 16 and 17. Slice 8's becomes Slice 9.
- Slice 8's "one feature changed → one app deploys" and "theme changed → every app deploys"
  checks still run in Slice 8, because they test `nx affected`, not the page.

⚠️ **One thing Slice 9 can no longer check: CloudFront caching** ([R12](./risks.md#r12)).
A local build has no CDN in front of it. That check stays in Slice 8, which can now run it
with the suite rather than by hand.

<a id="d102"></a>
## D102 — the remaining UI and navigation issues get their own slice, before E2E

**Maintainer's call, 2026-09-23.** After Slices 10–14 landed, the maintainer found a good
number of UI and navigation issues still open. Slices 15 and 16 cover one surface each and
don't own them, so they go into a new **[Slice 17](./slices/17-ui-navigation-fixes.md)**.

**Why before Slice 9.** Slice 9 asserts navigation, the anchor contract and computed
styles. A suite written before the fixes would either assert the broken behaviour, and then
need rewriting, or skip it, and then not cover it. This is the same reason D80 put the
redesign ahead of E2E.

**Why after 15 and 16.** ⚠️ **Proposed by the coordinator, not yet confirmed by the
maintainer.** If the issues block work on 15 and 16, Slice 17 moves ahead of them. Two
reasons for this placement: The detail page and the footer strip are two of the
surfaces the issues may touch, so fixing the page before it's rebuilt means fixing it
twice. And "after the whole redesign is up" is the first point the issue list can be
complete.

⚠️ **The issue list is not recorded yet.** It is
[Q22](./open-questions.md#q22), and it blocks Slice 17. The slice's scope comes from that
list. Nobody should reconstruct it by auditing the site and guessing which findings the
maintainer meant.
