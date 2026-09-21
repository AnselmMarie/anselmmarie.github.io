# Risks and Production Considerations

Runtime failure handling is specified separately and
in full in
[docs/architecture/mfe-failure-and-fallback-behavior.md](../../architecture/mfe-failure-and-fallback-behavior.md);
this file covers everything else that can go wrong, and what the plan does about it.

## The risks that could end the plan

<a id="r1"></a>
### R1 — Module Federation may not compose with TanStack Start's build

**Likelihood:** unknown. **Impact:** total — it invalidates the composition model.

**Narrowed on 2026-09-20.** The runtime half of this risk is resolved: Cloudflare confirmed
server-side federation is impossible on `workerd` ([D30](./decisions-d17-d32.md#d30)), the host has
moved to Lambda ([D31](./decisions-d17-d32.md#d31)), and client-side federation was never in doubt
on either platform.

What remains is the build half. TanStack Start owns the Vite config and the server build
output, and `@module-federation/vite` also participates in that build. Federation must be
scoped to the **client environment only** and must leave the SSR build untransformed.
Nothing has proven that.

*Mitigation:* the spike gate in [Slice 3](./slices/03-federation-header.md), run before any
other remote exists. ✅ **Run on 2026-09-21, and it passed** — [Q2](./questions-closed.md#q2)
closed as [D55](./decisions-d55.md#d55), so **this risk is retired**: federation composes with
Start's build and stays out of the `aws-lambda` server bundle when scoped with
`applyToEnvironment`. The cheap fallback — monorepo imports, which stays cheap only because
the logic lives in `libs/features/*` and not inside the remote apps
([D27](./decisions-d17-d32.md#d27)) — was not needed. ⚠️ What D55 did **not** prove travels
on: no Lambda invocation, no multi-remote interaction, and a dev-mode remote against a
built shell does not work.

<a id="r2"></a>
### R2 — Two copies of React in one page

**Likelihood:** moderate. **Impact:** high, and the symptoms mislead.

Hooks throw, context silently resolves to defaults, and the stack trace points at a
component far from the cause. It usually arrives via a version bump to one remote.

*Mitigation:* React and React DOM as shared singletons with **`strictVersion: false`**, one
React major pinned at the workspace root, and **a CI check that every app resolves that same
major** ([D39](./decisions-d33-d41.md#d39), closing [Q4](./questions-closed.md#q4)) — which moves the
mismatch from a visitor's browser to a red build. Plus a Slice 9 E2E assertion that the page
composes rather than only that it renders.

<a id="r3"></a>
⚠️ **R3 occurred on 2026-09-20, in Slice 1.** It is no longer a predicted risk; it is a
demonstrated one, with a known trigger. Tailwind 4 auto-detects sources from the Vite root
and skips `node_modules` — and every workspace lib is a symlink in `node_modules` — so the
shell's layout classes resolved to nothing and the page rendered **completely unstyled with
a green build, a green typecheck and a green test run**. It was caught by looking at the
screen. The fix is an `@source` declaration per lib ([D51](./decisions-d48-d52.md#d51)), held
in `libs/ui/theme` from [Slice 2](./slices/02-ui-libs.md); the automated check is
[Slice 9](./slices/09-e2e-composition.md)'s computed-style assertion, which is the only one
in the plan. **Every new lib is one forgotten line away from a repeat.**


### R3 — Tailwind classes tree-shaken out of a lib

**Likelihood:** ⚠️ **occurred** — see the note above. **Impact:** moderate, and it **fails
silently** — the component renders unstyled rather than erroring, past every gate.

The `@source` declarations must cover every `libs/ui/*` and `libs/features/*` path a build
consumes ([D51](./decisions-d48-d52.md#d51)). Tailwind 4 auto-detects from the build root and
**skips `node_modules`**, which is exactly where pnpm symlinks every workspace lib — so a lib
contributes no classes at all until something names it explicitly.

*Mitigation:* the shared preset in `libs/ui/theme` owns the glob list rather than each app
restating it ([D26](./decisions-d17-d32.md#d26)).

⚠️ **The browser-level net is thinner than it could have been.** A Storybook story would
catch this in a real browser at Slice 2; [Q8](./questions-closed.md#q8) closed as
[D38](./decisions-d33-d41.md#d38) and declined one. So **nothing renders a component against a real
stylesheet until Slice 9**, and the decline carries its obligation there: Slice 9 asserts a
**computed style** on a shared-design-system component per remote. Asserting an element is
present does not catch a class that was tree-shaken away.

<a id="r4"></a>
### R4 — A `VITE_`-prefixed secret ships to the browser

**Likelihood:** low in this plan, higher once Contentful lands. **Impact:** severe and
public — this is a public repository and a public bundle.

Vite inlines `VITE_*` variables into client code by construction.

*Mitigation:* no content credential is ever named `VITE_*`; Contentful configuration lives
in AWS only, with real secrets in Parameter Store or Secrets Manager rather than Lambda
environment variables ([D10](./decisions-d01-d16.md#d10), [D31](./decisions-d17-d32.md#d31)); the repo
carries only `.env.example` ([D11](./decisions-d01-d16.md#d11)). The Contentful plan owns a grep
gate for this, and it should be written the day that plan starts, not the day it finishes.

## Operational risks

<a id="r5"></a>
### R5 — A remote's deployment and the shell's expectation drift apart

The shell references a remote at a URL. If that URL serves a bundle built against a
different shared-dependency set, the failure appears at load time in the browser, not at
deploy time in CI.

*Mitigation:* immutable, versioned remote deployments and explicit rollback, per the
architecture doc. Shared-dependency versions come from the workspace root, so every remote
built in CI is built against the same ones.

<a id="r6"></a>

### R6 — `nx affected` deploys too little

The precision that makes Slice 8 worthwhile is also its risk: if the Nx graph does not see
a dependency, a consumer is not redeployed and the site runs on a stale remote.

*Mitigation:* every cross-package import goes through a package name, never a relative path
across project boundaries, so the graph sees it. Slice 8 verifies the negative case
explicitly: change `libs/ui/theme`, confirm `nx affected` lists **every** app.

<a id="r7"></a>

### R7 — A remote is slow rather than broken

A remote that hangs is worse than one that fails: the boundary never catches anything, and
the user waits.

*Mitigation:* the loading state and bounded retry from the architecture doc. Slice 4 should
treat a timeout as a failure and route it into the same fallback, rather than leaving the
loading state open indefinitely.

<a id="r8"></a>
### R8 — The cost of five independently deployed units ✅ resolved → [D33](./decisions-d33-d41.md#d33)

Five deployables is five things to monitor, five things to roll back, and five build
pipelines. That is the price of independent deployability, and for a portfolio site it is
worth naming out loud as a real cost rather than an obvious win.

**Resolved 2026-09-20, not mitigated.** [D33](./decisions-d33-d41.md#d33) settles that the
architecture is the deliverable and the site is the vehicle, so the cost is the point.

⚠️ This entry's original closing line — *"if the site is ever served predominantly from one
remote, the architecture is doing more work than the problem requires"* — is **withdrawn**.
Doing more work than the problem requires is the exercise. Kept visible rather than deleted,
because it is the argument most likely to be re-derived by a later reader looking at a
five-pipeline portfolio site.

<a id="r11"></a>

### R11 — Lambda cold starts, which Workers did not have

**New with [D31](./decisions-d17-d32.md#d31).** **Likelihood:** certain. **Impact:** moderate, and
concentrated on exactly the visitor who matters most — the first one after a quiet period.

Workers has effectively no cold start. Lambda does: a Node SSR function that has been idle
pays hundreds of milliseconds to low seconds before it renders anything. A portfolio site
has precisely the traffic profile that maximises this — long idle stretches punctuated by a
single visitor following a link.

It compounds with [D36](./decisions-d33-d41.md#d36), and now permanently: the cold start delays the
shell, and then the remotes still have to load client-side before any content appears. With
all four surfaces federated, there is no path where content arrives in the first response.

*Mitigation:* keep the SSR bundle small, and treat provisioned concurrency or a warming
ping as a Slice 8 decision made against measurements rather than assumed up front. Worth
measuring before optimising; worth not being surprised by.

<a id="r12"></a>

### R12 — CloudFront caches a rollback away

**New with [D31](./decisions-d17-d32.md#d31).** **Likelihood:** high on the first rollback attempt.
**Impact:** high — the failure mode is "the rollback appeared to work and did not".

The architecture doc requires rollback to be an explicit deployment operation pointing the
registry at a known-good version. If `remoteEntry.js` is served from a cached,
version-stable URL, repointing the registry changes nothing a visitor sees until the cache
expires.

*Mitigation:* version the remote path itself so each deploy is a distinct immutable key,
and let the registry — not the cache — decide which version loads. Where an invalidation is
genuinely needed, Slice 8 makes it part of the deploy rather than a manual step someone
remembers. This is the AWS-shaped version of the immutable-deployment requirement, and
[Q5](./questions-closed.md#q5) records the specific mechanics left to settle.

## Plan-process risks

<a id="r9"></a>
### R9 — Building the UI with no design ✅ mostly closed → [D34](./decisions-d33-d41.md#d34)

[Q1](./questions-closed.md#q1) closed on 2026-09-20: **the live v3 site is the visual
reference**, so slices 4 through 7 build against something that exists rather than inventing
it. The design carries over; the Next.js implementation does not ([D6](./decisions-d01-d16.md#d6)).

**What remains** is the remote-failure fallbacks, which have no v3 equivalent because a site
with no remotes has no failure UI. Slice 4 invents those.

*Mitigation:* every invented fallback control is flagged in Slice 4's completion report, one
line each.

<a id="r10"></a>
### R10 — The rules directory does not belong to this repo

`.claude/rules/` holds 47 files copied from cosmikata. Among them are rules for Drizzle
migrations, Expo env vars, i18n locale files, Zustand stores, and React Native platform
handling, none of which apply to a Vite + TanStack Start portfolio site. The plan rules and
the spec-discipline rules clearly do apply; a good third of the directory clearly does not.

The copy was also **partial** — cosmikata's `component-needs-story.md` is not here, which
is why [Q8](./questions-closed.md#q8) was framed as adopting a rule rather than interpreting
one. It closed as [D38](./decisions-d33-d41.md#d38): not adopted, so the omission is now a decision
rather than an accident. That resolves this one instance and not the underlying problem —
nobody can tell an intentional exclusion from an accidental one for the rest of the
directory, which is why a half-ported rule set is a risk rather than just untidy.

*Mitigation — ✅ done 2026-09-20, [D46](./decisions-d42-d47.md#d46).* 15 of the 47 were archived to
`.claude/rules-archive/` with a per-file reason, leaving 32 active, and the root configs
(`eslint.config.mjs`, `.nxignore`, `biome.json`, `package.json`) were repaired in the same
change. Moved rather than deleted: `.claude/*` is gitignored and untracked, so a deletion
there has no recovery path.

⚠️ **The second half of this risk — "a rule that is absent for no recorded reason gets
rediscovered as a surprise" — is now handled by the archive's README**, which states why
each file went and how to restore it. That is the part that turns a prune into a record.
