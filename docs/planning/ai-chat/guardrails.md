# Guardrails

No single control stops abuse, so they're stacked. Two goals:

1. **The worst case is a known, small dollar amount.**
2. **Off-topic use is refused, and isn't worth the effort when it slips through.**

No guardrail is perfect. B1–B5 make off-topic use rare. A5 and A6 cap what it
costs when one gets through.

## A. Bill protection (outermost first)

| # | Control | What it stops | Built in |
|---|---|---|---|
| A1 | **Cloudflare Turnstile** token, verified by the Lambda before any model call | Scripts and bots calling the API directly. DNS is already on Cloudflare, and Turnstile is free | Slice 3 (verify), Slice 5 (widget) |
| A2 | **WAF rate-based rule** on `/api/chat*`, e.g. 20 requests per 5 min per IP → block | One person hammering it | Slice 4 |
| A3 | **Lambda reserved concurrency**, e.g. 3 | A spike can never fan out into dozens of parallel Bedrock calls | Slice 4 |
| A4 | **Request caps** (zod): ≤ 12 turns of history, ≤ 500 chars per user message, ≤ 6k chars total; only `user` / `assistant` roles accepted. Output `maxTokens` ≈ 400 | Huge prompts, long essays, a client-injected system prompt | Slice 3 |
| A5 | **Per-IP daily quota + global daily token budget**: one DynamoDB table, TTL rows, atomic `ADD` counters fed by Bedrock's `usage` metadata from each stream. Over a limit → a `resting` event with no model call | Slow-drip abuse that stays under the rate limit. **The hard daily ceiling** | Slice 3 (logic), Slice 4 (table) |
| A6 | **AWS Budgets action**: when this project's monthly Bedrock spend passes $N, automatically attach a deny-Bedrock IAM policy to the chat role, and email the maintainer | Anything that gets past A1–A5. An automatic kill switch at the AWS level | Slice 4 |
| A7 | **Manual kill switch**: SSM parameter `chat-enabled`, read with a short in-memory cache. The frontend hides the launcher when it's off | Turning it off instantly, without a deploy | Slice 3 (read), Slice 4 (parameter), Slice 5 (UI) |

**Cost reducers:** Haiku 4.5 (the cheapest capable Claude model) and prompt
caching on the fixture-built system prompt, so most input tokens are billed at
the cached rate.

**Setting A5's budget:** pick a dollar figure, then convert it to tokens using
current Bedrock pricing for the chosen model, checked when Slice 3 is built.
Don't write a price into this plan from memory. The limits are set in
[D18](./decisions.md#d18): $10 / month (A6), $1 / day and 30 messages per IP (A5).

## B. Keeping it on topic

| # | Control | Effect | Built in |
|---|---|---|---|
| B1 | **Scoped system prompt**: discuss only Anselm, the portfolio projects, the site, and how to get in touch. Anything else gets one short, polite redirect. No writing code, no homework, no general knowledge, no role-play | The main control | Slice 3 |
| B2 | **Bedrock Guardrails** through `guardrailConfig` on ConverseStream: *denied topics* (general coding help, homework, unrelated people and companies, politics), *prompt-attack filter*, content filters | Enforced outside the model, so an injection that fools the model still gets blocked. Shows as a `blocked` event | Slice 3 (wiring), Slice 4 (`CfnGuardrail`) |
| B3 | **Only two tools, enum arguments only**: `scroll_to(sectionId ∈ SECTION_IDS)`, `navigate(slug ∈ PORTFOLIO_ITEMS)`. No fetch, no code execution, no free-text URL. The browser re-validates every tool call against the contract before acting | Even a jailbroken model can't make the site *do* anything else | Slices 2, 3 |
| B4 | **Small `maxTokens`** (from A4) | A successful jailbreak gets about one paragraph | Slice 3 |
| B5 | **Off-topic eval set**: about 30 adversarial prompts ("write me a Python script", "ignore your instructions…", "what's the capital of France"), each expected to refuse or redirect. Run by hand against real Bedrock before launch and after any prompt or model change. **Not in CI**, because every run costs money | Evidence the scope holds | Slice 5 |

## What the handler checks, in order

1. Kill switch (A7) → `disabled`
2. Turnstile (A1) → 403
3. zod caps and roles (A4) → 400
4. Per-IP and global quota (A5) → `resting`
5. Only then: Bedrock, with B1 + B2 + B4 applied
6. After the stream: add the `usage` tokens to both counters (A5)

Every rejection in steps 1–4 happens **before** any model call, so a rejected
request costs a Lambda invocation and nothing else.
