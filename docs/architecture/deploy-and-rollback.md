# Deploy and Rollback

How `anselmmarie.com` is deployed, and how to undo a deploy. Built by Slice 8 of the MFE
plan; the decisions behind it are
[D107–D109](../planning/mfe-architecture/decisions-d107-d109.md).

## The shape, in one paragraph

One CloudFront distribution in front of one private S3 bucket and the shell's Lambda, all in
`us-east-1`, account `694951015005`. Each remote is uploaded as an **immutable version**
under `_remotes/<remote>/<version>/` (`<version>` = the commit's 12-character SHA), and
reached through a small **pointer** at `_remotes/<remote>/remoteEntry.js` that is never
cached. The shell is built once against the pointers. So a remote deploys, and rolls back,
by rewriting its pointer; the shell is not rebuilt ([D12](../planning/mfe-architecture/decisions-d01-d16.md#d12)).

## Normal deploys: merge to `master`

`.github/workflows/ci.yml` does it. On a push to `master`, after `gates` and `e2e` pass, the
`deploy` job:

1. takes as its base the commit of the **last green run** on `master` (`nrwl/nx-set-shas`),
   so a failed or superseded run's changes are not skipped;
2. assumes the `portfolio-github-deploy` role through GitHub OIDC. No AWS key is stored in
   GitHub, and the role trusts only `master` of this repository;
3. runs `pnpm aws:deploy`, which asks `nx affected` what changed and deploys only that:
   each affected remote first (build → upload version → rewrite pointer → invalidate the
   pointer), then the shell last if it or `infra` changed (build → upload static files →
   `cdk deploy`).

A change to one feature lib deploys one remote. A change to `libs/ui/*` deploys every app.

## First-time setup (once)

Nothing here is automated, on purpose: it creates the account-level pieces CI then uses.

```bash
aws sso login --profile ansPortfolio
export AWS_PROFILE=ansPortfolio
```

**1. Bootstrap CDK** in the account and region.

```bash
pnpm --filter @portfolio/infra exec cdk bootstrap aws://694951015005/us-east-1
```

**2. Build the shell for Lambda and deploy the stack.** The deploy CLI reads the bucket
and distribution from the stack's outputs, so the stack has to exist before it can run.

```bash
NITRO_PRESET=aws_lambda pnpm nx run shell:build --skip-nx-cache
pnpm --filter @portfolio/infra exec cdk deploy
```

⚠️ **The deploy waits on the certificate.** While it waits, open ACM in `us-east-1` (or
the CloudFormation events), copy the validation CNAME, and add it in Cloudflare as
**DNS only (grey cloud)**. The deploy continues once ACM sees it.

**3. Point the domain at CloudFront.** From the stack output `DistributionDomainName`, add
two CNAMEs in Cloudflare, both **DNS only (grey cloud)**:

| Name | Target |
|---|---|
| `anselmmarie.com` (apex; Cloudflare flattens it) | `<id>.cloudfront.net` |
| `www` | `<id>.cloudfront.net` |

⚠️ **Never proxy (orange cloud) any of these records.** A proxied record puts Cloudflare's
cache in front of CloudFront. No deploy invalidates that cache, so a pointer rewrite could be
hidden behind it ([R12](../planning/mfe-architecture/risks.md#r12)), and ACM validation
breaks.

**4. Upload every remote and the shell's static files.**

```bash
pnpm aws:deploy --all --head "$(git rev-parse HEAD)"
```

After this, merges to `master` deploy on their own.

## Rollback

Rollback is an **explicit operation naming a known-good version**. Nothing switches versions
automatically on failure.

### A remote

```bash
pnpm aws:versions footer                 # every version in the bucket, and the current one
pnpm aws:rollback footer 0123456789ab    # point footer at that version
```

`rollback` refuses a version whose `remoteEntry.js` is not in the bucket, so it cannot point
a remote at nothing. It rewrites the pointer and invalidates it, and the next page load
takes the old version. Every version ever deployed is still in the bucket: uploads never
delete, and the CI role cannot delete.

⚠️ **The next merge that affects that remote deploys over the rollback.** Fix forward, or
revert the commit on `master`.

### The shell

The shell is a Lambda inside the stack, so it rolls back by deploying an earlier build of it.
Either revert the commit on `master` and let CI deploy, or from a checkout of the known-good
commit:

```bash
NITRO_PRESET=aws_lambda pnpm nx run shell:build --skip-nx-cache
pnpm --filter @portfolio/infra exec cdk deploy
```

Its old static files are still in the bucket (the upload never deletes), so pages rendered by
either version keep their assets.

## Checking a deploy from a cold cache

Per [R12](../planning/mfe-architecture/risks.md#r12), the console reporting success is not
proof. Check what a browser gets:

```bash
curl -sI https://anselmmarie.com/_remotes/footer/remoteEntry.js | grep -i cache-control
curl -s  https://anselmmarie.com/_remotes/footer/remoteEntry.js   # names the live version
```

The pointer must answer `no-cache, no-store, must-revalidate` and name the version you
expect. For a full check, run the E2E suite against the deployed site.

## When something fails

| Symptom | Cause |
|---|---|
| `Stack PortfolioStack has no output …` | The stack is not deployed yet; do first-time setup step 2 |
| `No shell server build at …` | Build the shell first (`NITRO_PRESET=aws_lambda …`) |
| `… preset "node-server", not "aws-lambda"` | The last shell build was `pnpm e2e:build`'s; rebuild for Lambda |
| `… was not made for https://anselmmarie.com/_remotes/…` | A stale remote build; the CLI always builds with `--skip-nx-cache`, so something else wrote `dist/` |
| `ExpiredToken` locally | `aws sso login --profile ansPortfolio` |
| CI: `Not authorized to perform sts:AssumeRoleWithWebIdentity` | The run is not on `master`, or the stack (which creates the role) is not deployed |
