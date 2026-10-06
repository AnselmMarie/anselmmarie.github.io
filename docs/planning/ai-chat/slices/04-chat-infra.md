# Slice 4: Chat infrastructure (CDK)

**Status:** built 2026-10-05, uncommitted, in review · **Layer:** infra · **Visible?** — none · **Depends on:** Slice 3
**Design:** n/a

## Decisions that bind this slice
- **D1**: Node 22, arm64, matching `LAMBDA_RUNTIME` / `LAMBDA_ARCHITECTURE` in `shell-function.ts`.
- **D2 / D6**: IAM scoped to the one inference profile and its model ARNs.
- **D7**: guardrails A1 (WAF Challenge), A2, A3, A5 (table), A6, A7 (parameter) and B2 (`CfnGuardrail`) are built here.
- **D21**: A1 is a WAF Challenge rule scoped to `/api/chat*`, not Turnstile. No secret, no Secrets Manager.
- **D18**: A6 Budgets kill switch at $10 / month; the A5 limits ($1 / day, 30 per IP) passed as stack props / context.
- **D19**: on branch `feat/amarie/ai-chat-buildout`.
- **D20**: `ChatFunction` bundles `libs/api/chat` with esbuild.
- **D12**: Function URL `AWS_IAM` + OAC, invoke mode `RESPONSE_STREAM`.
- **D22**: the origin request policy forwards `CloudFront-Viewer-Address`.
- **D24**: a POST through Lambda OAC needs `x-amz-content-sha256`; the chat behavior forwards it.
- **D25**: A6 alerts go to an SNS topic; email only when `CHAT_ALERT_EMAIL` is set.
- **D26**: this slice's build-time calls (bundling, WAF construct, integration URL, guardrail version hash, pricing).

## Open questions blocking this slice
none (Q3 closed → D21). Two raised here block Slice 5's deploy, not this slice:
[Q8](../open-questions.md#q8) (budget service name) and
[Q9](../open-questions.md#q9) (account concurrency quota).

## Resources

| Resource | Notes |
|---|---|
| `ChatFunction` construct | Mirrors `ShellFunction`: esbuild bundle of `libs/api/chat`, 512 MB, ~30s timeout, **reserved concurrency 3** (A3), env from Slice 3's `read-chat-env` |
| Function URL | `AWS_IAM`, `InvokeMode.RESPONSE_STREAM` |
| CloudFront behavior `/api/chat*` | In `SiteDistribution`: OAC to the chat URL, `CachePolicy.CACHING_DISABLED`, POST allowed, origin request policy forwarding the viewer IP header |
| WAF web ACL (CLOUDFRONT scope, us-east-1) | Rate-based rule scoped to `/api/chat*` (A2), then a **Challenge** rule scoped down to `/api/chat*` (A1, D21), so page loads are never challenged. The application-integration URL becomes a stack output for the chat client (Slice 5). The stack is already in us-east-1 |
| DynamoDB table | On-demand, `pk` string, TTL attribute `expiresAt` (A5) |
| SSM parameter `chat-enabled` | Default `true` (A7) |
| `CfnGuardrail` + version | Denied topics, prompt-attack filter, content filters (B2). Its ID and version go to the function's env |
| IAM | `bedrock:InvokeModelWithResponseStream` + `bedrock:ApplyGuardrail` on exact ARNs; DynamoDB read/write on the table; SSM read on the parameter |
| AWS Budget + Budgets action | Cost filter on Bedrock. At the threshold, attach a deny-Bedrock managed policy to the chat role and email the maintainer (A6) |

## Files

| File | New / modified |
|---|---|
| `infra/src/chat-config/chat-config.ts` (+ spec) | new: model, path, limits, context overrides |
| `infra/src/chat-function/chat-function.ts` (+ spec) | new: function, URL, quota table, kill-switch parameter, IAM |
| `infra/src/chat-guardrail/chat-guardrail.ts` (+ spec) | new |
| `infra/src/chat-firewall/chat-firewall.ts` (+ spec) | new: web ACL + integration-URL lookup (D26; the plan had it in site-distribution) |
| `infra/src/chat-budget/chat-budget.ts` (+ spec) | new |
| `infra/src/site-distribution/site-distribution.ts` (+ spec, + `site-distribution-chat.spec.ts`) | modified: behavior, origin request policy, WAF, invoke permission |
| `infra/src/portfolio-stack.ts` | modified: wiring + outputs (the existing outputs spec covers the new ones) |
| `infra/src/main.ts` | modified: limits from context, alert email from env (no bundle dir: D26) |
| `infra/src/test-helpers/synth-stack.test-helpers.ts` | modified: takes stack-prop overrides |
| root `package.json` + `pnpm-lock.yaml` | modified: `esbuild` devDependency (D26) |

## Synth specs
- Function: runtime, arm64, reserved concurrency = 3, Function URL `AWS_IAM` + `RESPONSE_STREAM`.
- Distribution: the `/api/chat*` behavior exists, has caching disabled, allows POST, and uses OAC.
- WAF rate rule present and associated with the distribution.
- WAF Challenge rule present, scoped down to `/api/chat*` and ordered after the rate rule.
- The application-integration URL is a stack output.
- DynamoDB TTL enabled on `expiresAt`.
- The Guardrail ID and version are in the function env.
- The IAM policy names only the chosen model / profile ARNs (no `*`).
- The Budgets action targets the chat role.
- Each new assertion is seen failing with its resource property removed.

## Built (2026-10-05)
- 134 specs in `infra` (38 new, 2 restated); coverage on the touched files 99% statements / 93% branches.
- **Seen failing:** 22 negative controls, each removing the property its spec covers (reserved concurrency, `RESPONSE_STREAM`, TTL, the guardrail-version env var, a `*` resource, the version hash, the prompt-attack filter, the rate rule's scope-down, the challenge action, rule order, `webAclId`, the integration-URL output, POST, the viewer-IP header, caching, the chat invoke permission, the budget action's role, approval model, email-only-when-set, the policy-ARN condition, the limits guard). Each turned its spec red; each revert and restore was checked against the file.
- Two existing specs were restated, not weakened: the pointer behavior must still precede `/_remotes/*` (it's no longer index 0, because `/api/chat*` comes first), and **each** Function URL needs both CloudFront permissions.
- `cdk synth` succeeds (against a fake `aws-lambda` shell build, since the local build is an e2e `node-server` one). The bundled handler loads under Node with a stubbed `awslambda` global.
- ⚠️ **Merging this to master deploys it.** CI's deploy job runs `cdk deploy` whenever the shell is affected, so the first master deploy after merge creates the Lambda, WAF ($7 / month fixed, D26), table, guardrail and budget. Close Q8 and Q9 first.

## Done when
- `typecheck`, `lint`, `test` green on `infra`; `cdk synth` succeeds.
- **No `cdk deploy` in this slice.** Deploying is a maintainer decision in Slice 5.
