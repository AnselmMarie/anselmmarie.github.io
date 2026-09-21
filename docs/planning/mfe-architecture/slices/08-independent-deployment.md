# Slice 8 — Independent deployment: GitHub Actions, `nx affected`, AWS

**Status:** not started · **Visible?** — none · **Depends on:** Slices 5, 6, 7
**Design:** not applicable — no UI surface

The **first of the plan's two invisible slices** — [Slice 9](./09-e2e-composition.md) is the
other — and they sit together at the end, where a run of three cannot form. (This file
claimed to be the only one until 2026-09-21; Slice 9 was mis-marked `✅ screen` and adds no
surface.) It exists to make [D12](../decisions-d01-d16.md#d12) true rather than aspirational.

## Decisions that bind this slice

- **[D31](../decisions-d17-d32.md#d31)** — the host is AWS: remotes to S3 behind CloudFront, the
  shell's SSR server to Lambda. Supersedes [D5](../decisions-d01-d16.md#d5) (Cloudflare Workers).
- **[D10](../decisions-d01-d16.md#d10)** / **[D11](../decisions-d01-d16.md#d11)** — configuration lives in
  the deployment environment; the repo carries only `.env.example`. No real credential
  enters the repo or a workflow file. Contentful's own secrets are the Contentful plan's
  job, but the mechanism is established here. ⚠️ **D10's own text says "Cloudflare"** — it
  was written before the host moved and now carries a *superseded in form by D31* note
  pointing at Lambda environment configuration. The rule it states is unchanged: the secrets
  live wherever the function runs, never in the repo or in GitHub.
- **[D49](../decisions-d48-d52.md#d49)** — ⚠️ **the Lambda is `arm64`.** The CDK function
  definition, the workflow's build step and `.npmrc`'s `supportedArchitectures` must all
  agree; a mismatch fetches native binaries for the wrong architecture and surfaces at
  runtime, in the host. Slice 1 pinned the constants in `infra/src/portfolio-stack.ts`; this
  slice is where they become a deployed function.
- **[D50](../decisions-d48-d52.md#d50)** — the project-tag check below reads
  `nx show projects --json`, which returns the **bare** names. So does every `nx affected`
  call in the workflow. The `@portfolio/` scope appears only in `package.json`.
- **[D52](../decisions-d48-d52.md#d52)** — `pnpm check:file-size` exists from Slice 1 and runs
  in `lint-staged` at commit time. ⚠️ **That only covers commits made locally**, so the
  pull-request workflow runs it too, alongside the gates — otherwise a push from anywhere
  that skips hooks bypasses the 200-line cap entirely.
- **[D12](../decisions-d01-d16.md#d12)** — an MFE deploys without rebuilding the application.
- **[D23](../decisions-d17-d32.md#d23)** — one workflow, driven by `nx affected`. Not five
  path-filtered workflows, which never fire for a `libs/ui/*` change and so silently leave
  consumers on a stale design system.
- **[D24](../decisions-d17-d32.md#d24)** — **no Docker**, on the two reasons that survived the host
  change. Note the original third reason ("the runtime is serverless, so nothing runs a
  container") was withdrawn: Lambda *does* support container images. Zip packaging is the
  default here; a container image would be a packaging choice inside this slice, not a
  reversal of D24.
- **[D27](../decisions-d17-d32.md#d27)** — because the logic lives in `libs/features/*`, the Nx
  graph maps a feature change to exactly one app. The structure and the deploy mechanism
  reinforce each other.

- **[D35](../decisions-d33-d41.md#d35)** — the site is served from AWS and the repository name
  constrains nothing. GitHub Pages is not used. **Choosing the actual domain is this slice's
  work**, as mechanics rather than as an open decision. The old Pages site stays on `master`
  until this one is ready.
- **[D37](../decisions-d33-d41.md#d37)** — the infrastructure is described in **AWS CDK**, as an Nx
  project created back in Slice 1. [D23](../decisions-d17-d32.md#d23) is unchanged: Actions decides
  what to deploy, CDK describes what it deploys into.
- **[D39](../decisions-d33-d41.md#d39)** — ⚠️ **this slice owns the React-major CI check.** Because
  the shared config uses `strictVersion: false`, that check is the only thing preventing
  [R2](../risks.md#r2), and without it the arrangement is a disabled guard rather than a
  relocated one. It is not optional and it does not belong to a later slice.

## Open questions blocking this slice

**None.** [Q3](../questions-closed.md#q3) and [Q10](../questions-closed-q9-q16.md#q10) both closed on
2026-09-20, as [D35](../decisions-d33-d41.md#d35) and [D37](../decisions-d33-d41.md#d37).

## What this slice delivers

- `.github/workflows/deploy.yml` — computes `nx affected` against the base ref and deploys
  only the apps that actually changed: remotes sync to S3, the shell publishes a new Lambda
  version.
- **Immutably versioned remote deployments.** Each remote deploy lands under its own key
  prefix so a previous build stays addressable, which is what the architecture doc's
  rollback requirement depends on.
- Remote URLs supplied as Lambda environment values and read by `libs/shared/config` at
  runtime, so the shell is deployed once and repointed per environment rather than rebuilt.
- AWS credentials for the workflow via **GitHub OIDC** with a scoped IAM role, rather than
  a long-lived access key stored as a secret.
- A documented rollback: an **explicit deployment operation** pointing the registry at a
  known-good version, never an automatic version switch on failure.

## Files this slice creates and modifies

- `.github/workflows/deploy.yml`, plus a CI workflow running the gates on pull requests
- The infrastructure definitions in **CDK** ([D37](../decisions-d33-d41.md#d37)) — S3 buckets, the
  CloudFront distribution and its cache behaviors, the Lambda function and its invocation
  path, IAM roles. The CDK project exists from Slice 1; this slice fills it in.
- **The React-major CI check** required by [D39](../decisions-d33-d41.md#d39), in the pull-request
  workflow alongside the gates.
- **`pnpm check:file-size`** in the same pull-request workflow
  ([D52](../decisions-d48-d52.md#d52)), so the cap holds for commits that never ran the
  pre-commit hook.
- **A project-tag check.** ⚠️ `@nx/enforce-module-boundaries` is **silently inert** for any
  project carrying no matching tag — it is unconstrained, and the rule passes rather than
  failing. So CI asserts every project in `nx show projects --json` has both a `type:` and a
  `scope:` tag. Without it, [D2](../decisions-d01-d16.md#d2), [D25](../decisions-d17-d32.md#d25),
  [D27](../decisions-d17-d32.md#d27) and [D29](../decisions-d17-d32.md#d29) are enforced only for the
  projects somebody remembered to tag, which is the worst of both worlds: a gate that
  reports green over a growing hole.
- Root `package.json` deploy scripts
- `libs/shared/config` — reading remote URLs from the environment rather than a constant
- `docs/` — a short deploy-and-rollback runbook

## Gates

```bash
pnpm nx run-many -t typecheck lint test
```

And three verifications the workflow itself has to pass, which are the point of the slice:

1. **Change one feature lib** (`libs/features/footer`), confirm `nx affected` lists
   **only** `footer`, and confirm only that app deploys.
2. **Change `libs/ui/theme`**, confirm `nx affected` lists **every** app. This is the
   negative control, and it is the case that catches
   [R6](../risks.md#r6). A workflow that passes the first check and fails this one is worse
   than no workflow, because it looks correct while leaving the site on a stale design
   system.
3. **Roll a remote back and confirm a real browser sees the rollback**, not a cached
   `remoteEntry.js`. Per [R12](../risks.md#r12) this is the AWS-shaped failure mode: the
   registry repoints, the deploy reports success, and CloudFront keeps serving the old
   bundle. Verify from a cold cache, not from the AWS console.

## Notes for whoever builds this

- **Cross-package imports must go through package names**, never relative paths across
  project boundaries, or the Nx graph does not see the edge and `affected` under-reports.
  Worth grepping for before trusting the first check above.
- **Measure the cold start** ([R11](../risks.md#r11)) before deciding whether provisioned
  concurrency is warranted. Workers had effectively none and Lambda does; this is the one
  regression the host change definitely introduces, and it deserves a number rather than a
  guess.
- Deploy the shell last in any run that includes it, so a remote it references is already
  live when it goes out.
