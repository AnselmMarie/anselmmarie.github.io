# Slice 4: Chat infrastructure (CDK)

**Status:** not started · **Layer:** infra · **Visible?** — none · **Depends on:** Slice 3
**Design:** n/a

## Decisions that bind this slice
- **D1**: Node 22, arm64, matching `LAMBDA_RUNTIME` / `LAMBDA_ARCHITECTURE` in `shell-function.ts`.
- **D2 / D6**: IAM scoped to the one inference profile and its model ARNs.
- **D7**: guardrails A2, A3, A5 (table), A6, A7 (parameter) and B2 (`CfnGuardrail`) are built here.
- **D18**: A6 Budgets kill switch at $10 / month; the A5 limits ($1 / day, 30 per IP) passed as stack props / context.
- **D19**: on branch `feat/amarie/ai-chat-buildout`.
- **D20**: `ChatFunction` bundles `libs/api/chat` with esbuild.
- **D12**: Function URL `AWS_IAM` + OAC, invoke mode `RESPONSE_STREAM`.

## Open questions blocking this slice
- **Q3**: the Turnstile secret has to exist in Secrets Manager (referenced by ARN, never inlined).

## Resources

| Resource | Notes |
|---|---|
| `ChatFunction` construct | Mirrors `ShellFunction`: esbuild bundle of `libs/api/chat`, 512 MB, ~30s timeout, **reserved concurrency 3** (A3), env from Slice 3's `read-chat-env` |
| Function URL | `AWS_IAM`, `InvokeMode.RESPONSE_STREAM` |
| CloudFront behavior `/api/chat*` | In `SiteDistribution`: OAC to the chat URL, `CachePolicy.CACHING_DISABLED`, POST allowed, origin request policy forwarding the viewer IP header |
| WAF web ACL (CLOUDFRONT scope, us-east-1) | Rate-based rule scoped to `/api/chat*` (A2). The stack is already in us-east-1 |
| DynamoDB table | On-demand, `pk` string, TTL attribute `expiresAt` (A5) |
| SSM parameter `chat-enabled` | Default `true` (A7) |
| `CfnGuardrail` + version | Denied topics, prompt-attack filter, content filters (B2). Its ID and version go to the function's env |
| IAM | `bedrock:InvokeModelWithResponseStream` + `bedrock:ApplyGuardrail` on exact ARNs; DynamoDB read/write on the table; SSM read on the parameter; Secrets read on the Turnstile secret |
| AWS Budget + Budgets action | Cost filter on Bedrock. At the threshold, attach a deny-Bedrock managed policy to the chat role and email the maintainer (A6) |

## Files

| File | New / modified |
|---|---|
| `infra/src/chat-function/chat-function.ts` (+ spec) | new |
| `infra/src/chat-guardrail/chat-guardrail.ts` (+ spec) | new |
| `infra/src/chat-budget/chat-budget.ts` (+ spec) | new |
| `infra/src/site-distribution/site-distribution.ts` (+ spec) | modified: behavior + WAF |
| `infra/src/portfolio-stack.ts` (+ spec) | modified: wiring + outputs |
| `infra/src/main.ts` | modified: pass the chat bundle dir |

## Synth specs
- Function: runtime, arm64, reserved concurrency = 3, Function URL `AWS_IAM` + `RESPONSE_STREAM`.
- Distribution: the `/api/chat*` behavior exists, has caching disabled, allows POST, and uses OAC.
- WAF rate rule present and associated with the distribution.
- DynamoDB TTL enabled on `expiresAt`.
- The Guardrail ID and version are in the function env.
- The IAM policy names only the chosen model / profile ARNs (no `*`).
- The Budgets action targets the chat role.
- Each new assertion is seen failing with its resource property removed.

## Done when
- `typecheck`, `lint`, `test` green on `infra`; `cdk synth` succeeds.
- **No `cdk deploy` in this slice.** Deploying is a maintainer decision in Slice 5.
