# Open Questions

When one is answered: write it as a decision in [decisions.md](./decisions.md),
mark it `✅ closed → D<n>` here, and update the binding block of every slice
that names it. All three, in the same change.

| Q | Raised | Blocks | Status |
|---|---|---|---|
| [Q1](#q1) | 2026-10-01 | Slices 1, 2, 5 | ✅ closed → [D17](./decisions.md#d17) (D16 superseded) |
| [Q2](#q2) | 2026-10-01 | Slices 3, 4 | ✅ closed → [D18](./decisions.md#d18) |
| [Q3](#q3) | 2026-10-01 | Slices 3, 4, 5 | ✅ closed → [D21](./decisions.md#d21) |
| [Q4](#q4) | 2026-10-01 | Slice 5 (live check only) | open |
| [Q5](#q5) | 2026-10-01 | All code | ✅ closed → [D19](./decisions.md#d19) |
| [Q6](#q6) | 2026-10-01 | Slice 3 | ✅ closed → [D20](./decisions.md#d20) |
| [Q7](#q7) | 2026-10-01 | Slice 1 | ✅ closed → [D13](./decisions.md#d13) |
| [Q8](#q8) | 2026-10-05 | Slice 5 (`cdk deploy`) | open |
| [Q9](#q9) | 2026-10-05 | Slice 5 (`cdk deploy`) | open |

<a id="q1"></a>
## Q1: Chat panel design

**✅ Closed → [D17](./decisions.md#d17).** First closed on 2026-10-01 as D16
("build anyway"). Then on 2026-10-02 the maintainer supplied the design in
`_design/Anselm Marie Portfolio.html`, which supersedes it.

No design exists for the launcher, the panel, or its states. Per
plan-design-links, building without one means inventing the UI.

**Options:** a Claude Design or Figma link, **or** "build it anyway", in which
case Slice 1 uses existing `@portfolio/ui-components` and theme tokens and
flags every control as invented in its report.
When this was asked on 2026-10-01, the maintainer gave no preference.

<a id="q2"></a>
## Q2: Spending limits

**✅ Closed 2026-10-02 → [D18](./decisions.md#d18).** The maintainer took the suggested
starting points below.

Three numbers are needed:

| Limit | Guardrail | Suggested starting point |
|---|---|---|
| Monthly $ that triggers the Budgets kill switch | A6 | $10 / month |
| Daily $ budget, converted to tokens | A5 | $1 / day |
| Messages per IP per day | A5 | 30 |

<a id="q3"></a>
## Q3: Cloudflare Turnstile keys

**✅ Closed 2026-10-05 → [D21](./decisions.md#d21).** Turnstile is replaced by an
AWS WAF Challenge rule, so there are no keys to create. The original question
is kept below.

A Turnstile site key (public, used by the widget) and a secret key (Secrets
Manager, used by the Lambda) have to be created in the Cloudflare dashboard by
the maintainer.

<a id="q4"></a>
## Q4: Bedrock model access

Claude Haiku 4.5 must be enabled in the Bedrock console (us-east-1) on the
deploy account before the live check in Slice 5.

<a id="q5"></a>
## Q5: Branch

**✅ Closed 2026-10-02 → [D19](./decisions.md#d19).** Code goes on the current branch,
`feat/amarie/ai-chat-buildout` (contains `origin/version-3`, no upstream). The
original question is kept below.

All code goes on a branch cut from `version-3`. Proposed:
`feat/amarie/ai-chat` off `origin/version-3`, upstream unset after creation.
On 2026-10-01 the maintainer asked for these plan files only, with no branch,
so nothing has been created.

<a id="q6"></a>
## Q6: Where the handler lives

**✅ Closed 2026-10-02 → [D20](./decisions.md#d20).** `libs/api/chat`, as the plan assumed.

`libs/api/chat` (a lib, bundled by the infra construct) **or**
`apps/chat-api` (an app with its own build target). The plan assumes
`libs/api/chat` plus an esbuild bundle in the CDK construct, matching how
`ShellFunction` takes a prebuilt directory.

<a id="q7"></a>
## Q7: Shell lib vs. remote MFE

**✅ Closed 2026-10-01 → [D13](./decisions.md#d13).** The maintainer chose a
separate remote MFE. The navigation consequence is [D14](./decisions.md#d14).
The original question is kept below.

[D9](./decisions.md#d9) proposes a plain feature lib mounted in the shell root.
The alternative is a sixth federated remote (`apps/chat`) that deploys on its
own. A remote buys an independent deploy and costs the federation plumbing
plus the router-singleton question that D43 avoided for the header.

⚠️ **D36 in the MFE plan says every visible surface is federated and
client-rendered** (cited in `apps/shell/src/routes/__root.tsx` on `version-3`).
A chat panel mounted directly in the shell would be the first visible surface
that isn't a remote, so D9 contradicts D36 as written. Resolve this before
Slice 1. Either make the chat a remote (`apps/chat`, like `header` / `footer`),
or record an explicit exception to D36.

<a id="q8"></a>
## Q8: The service name A6's budget filters on

Anthropic models on Bedrock bill as an AWS Marketplace service named after the
model (reported as e.g. `Claude Sonnet 4 (Amazon Bedrock Edition)`), not as
`Amazon Bedrock`. Slice 4 filters on both `Amazon Bedrock` and
`Claude Haiku 4.5 (Amazon Bedrock Edition)` (`CHAT_BUDGET_SERVICES` in
`infra/src/chat-config/chat-config.ts`). If neither matches what Cost Explorer
shows for this account, the budget sees $0 and **A6 never trips**. A5 still caps
each day.

**To close:** after the first real chat request, open Cost Explorer → group by
Service, and copy the exact name into `CHAT_BUDGET_SERVICES`.

<a id="q9"></a>
## Q9: Lambda concurrency quota on the deploy account

A3 reserves 3 concurrent executions. Lambda refuses a reservation that would
leave fewer than 100 unreserved, so on an account whose total quota is still the
new-account default (10), **`cdk deploy` fails** at the chat function.

**To close:** `aws lambda get-account-settings --profile ansPortfolio` →
`AccountLimit.ConcurrentExecutions` must be ≥ 103. If it isn't, request an
increase through Service Quotas before Slice 5's deploy.

