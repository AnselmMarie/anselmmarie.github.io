# Decision D110

How `ci.yml`'s deploy job picks what to deploy and signs in, decided on 2026-09-25 while
building Slice 8. [decisions.md](./decisions.md) is the index.

<a id="d110"></a>
## D110 — the deploy's base is the last green run on `master`; master runs are never cancelled; the deploy role has a fixed name

**Coordinator's call, 2026-09-25, while finishing Slice 8. Awaiting the maintainer's
review with the slice.**

- **Base = the last successful run of `ci.yml` on `master`**, found by
  `nrwl/nx-set-shas`. Not `github.event.before`. With `before`, a run whose deploy failed,
  or a queued run that GitHub's concurrency superseded, would never deploy its changes: the
  next run would diff only against its own parent and call them unaffected. A failed run
  never becomes a base, so its changes stay "affected" until one succeeds.
- **A push to `master` is never cancelled mid-run.** The workflow's concurrency was
  `cancel-in-progress: true` for every ref. That is right for a pull request and wrong for a
  deploy: a cancel could leave a remote uploaded but unreleased, or the shell's assets
  uploaded under the old Lambda. It is now `true` for pull requests only.
- **`nx.json` has `"defaultBase": "master"`.** Nx defaults to `main`, which this repository
  does not have, so every command that computes a base printed
  `fatal: ambiguous argument 'main'` (seen from `nx graph` on 2026-09-25). The deploy passes
  `--base` explicitly and was never affected; anything run locally without one was.
- **The deploy role is named `portfolio-github-deploy`** (`GITHUB_DEPLOY_ROLE_NAME` in
  `infra/src/site-config/site-config.ts`), rather than letting CloudFormation generate one.
  With a fixed name, `ci.yml` states the role's ARN outright, and first-time setup has no
  step that copies an ARN into a GitHub variable. ⚠️ `ci.yml` repeats the name, so the two
  change together. The ARN is not a credential ([D10](./decisions-d01-d16.md#d10)); the
  trust policy (only `master` of this repository) is what protects the role.
- **The React-major check reads what each package resolves**, not the range it declares
  ([D39](./decisions-d33-d41.md#d39)). There is no root pin: twelve packages each declare
  `^19.3.0`, and a range says nothing about which copy pnpm linked.

**What it does not change:** [D23](./decisions-d17-d32.md#d23)'s one workflow, and the
`gates` job's use of `run-many` over `affected`, which stays deliberate. Skipping unchanged
work is the point of the deploy, not of the gates.
