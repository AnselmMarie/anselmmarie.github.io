# Slice 3: Chat API handler (Bedrock streaming + in-code guardrails)

**Status:** built and committed 2026-10-05 (`dbfb8a2` rename, `d5abc13`, `841a938`), in review · **Layer:** api · **Visible?** — none · **Depends on:** Wave 0 (contract lib + dependencies)
**Design:** n/a

## Decisions that bind this slice
- **D1**: TypeScript, Node 22 Lambda, response streaming (`awslambda.streamifyResponse`).
- **D2 / D6**: Bedrock `ConverseStream`, Claude Haiku 4.5 inference profile, one model constant.
- **D4**: the system prompt is built from `@portfolio/shared-fixtures` at cold start and prompt-cached.
- **D5**: stateless. History comes from the client and is capped.
- **D7**: guardrails A4, A5, A7, B1, B2 (wiring), B3 and B4 are implemented here. A1 moved to Slice 4 (D21).
- **D18**: $1 / day budget and 30 messages per IP per day, read from env, not hardcoded.
- **D19**: on branch `feat/amarie/ai-chat-buildout`.
- **D20**: the handler lives in `libs/api/chat`.
- **D10 / D11**: tool specs and stream events come from `libs/shared/chat`.
- **D21**: bot protection (A1) is a WAF Challenge at CloudFront. The handler does **no** bot verification and reads no secret.
- **D22**: prices recorded, A5 counts spend in micro-dollars, `type:api` tag, guardrail sync mode, viewer IP header, fail closed.

## Open questions blocking this slice
none (Q3 closed → D21)

## Handler order (from guardrails.md)
WAF (A1 challenge, A2 rate rule) has already run at CloudFront by the time the
handler is invoked.

1. Kill switch: SSM `chat-enabled`, cached about 30s → `disabled`
2. zod: request schema from the contract (caps, `user`/`assistant` roles only) → 400
3. DynamoDB quota: per-IP (`ip#<hash>#<yyyy-mm-dd>`) and global (`global#<yyyy-mm-dd>`) → `resting`
4. `ConverseStream` with the system prompt (B1), `toolConfig` (B3), `maxTokens` ≈ 400 (B4), `guardrailConfig` (B2)
5. Map the Bedrock stream → NDJSON events. A guardrail intervention → `blocked`
6. On `metadata.usage`: atomic `ADD` to both counters (one reply per IP; spend in micro-dollars globally, D22)

IPs are **hashed** before they're stored. TTL is about 48h.

## Files

| File | Purpose |
|---|---|
| `libs/shared/chat/src/**` | (Wave 0) tool schemas, request schema, event union, limits constants |
| `libs/api/chat/src/handler/handler.ts` (+ spec) | Entry: runs the order above |
| `libs/api/chat/src/system-prompt/build-system-prompt.ts` (+ spec) | Fixtures → prompt text + scope rules (B1) |
| `libs/api/chat/src/bedrock-stream/bedrock-stream.ts` (+ spec) | ConverseStream call + event mapping |
| `libs/api/chat/src/quota/quota.ts` (+ spec) | Read / check / add counters |
| `libs/api/chat/src/kill-switch/kill-switch.ts` (+ spec) | Cached SSM read |
| `libs/api/chat/src/config/read-chat-env.ts` (+ spec) | Validates env at cold start; fails fast |
| `libs/api/chat/evals/off-topic.prompts.json` | The B5 prompt set (run in Slice 5) |

Pricing for the A5 conversion is recorded in [D22](../decisions.md#d22).

## What Slice 4 must supply (built here, read there)

| Env var | Value |
|---|---|
| `CHAT_TABLE_NAME` | the quota table (`pk` string, TTL `expiresAt`) |
| `CHAT_ENABLED_PARAM` | the SSM parameter name; only the string `true` enables |
| `CHAT_GUARDRAIL_ID` / `CHAT_GUARDRAIL_VERSION` | the `CfnGuardrail` and its version |
| `CHAT_DAILY_BUDGET_USD` | `1` (D18) |
| `CHAT_IP_DAILY_MESSAGES` | `30` (D18) |

- **Entry:** `libs/api/chat/src/index.ts`, export `handler` (uses the runtime's `awslambda.streamifyResponse`).
- **Origin request policy** must forward `CloudFront-Viewer-Address`, or every visitor shares one quota row per edge.
- **IAM:** `bedrock:InvokeModelWithResponseStream` on the `us.anthropic.claude-haiku-4-5-20251001-v1:0` profile and its regional model ARNs, `bedrock:ApplyGuardrail`, `dynamodb:BatchGetItem` + `UpdateItem`, `ssm:GetParameter`.

## Specs (mocked Bedrock, DynamoDB, SSM, fetch)
- Text + toolUse stream → the exact NDJSON sequence ending in `done`.
- Invalid body → 400. A `system` role or oversize history → 400.
- Per-IP or global quota exhausted → `resting`, **Bedrock not called**.
- Kill switch off → `disabled`, **Bedrock not called**.
- Guardrail intervention → `blocked`.
- Usage metadata → the IP counter gains one reply and the global counter the reply's cost in micro-dollars (D22).
- The system prompt contains every section ID and slug, and the scope rules.
- **Each "not called" spec is seen failing** with its guard removed.

## Built (2026-10-05)
- 72 specs in `api-chat`, 35 in `shared-chat`; coverage 99% / 98% statements.
- Seen failing: removing the kill-switch, zod and quota guards each turns its "Bedrock not called" spec red (1, 4 and 2 specs); removing the `guardrail_intervened` mapping turns the `blocked` spec red.
- ⚠️ The prompt-cache point is set, but Haiku 4.5 only caches a prefix above its minimum size. If the fixture prompt is shorter, the cache point is a no-op; check `cacheReadInputTokens` in the live check.

## Done when
- `typecheck`, `lint`, `test` (with coverage ≥ 80%) green on `shared-chat` and `api-chat`.
- The report states the slice is invisible and nothing deployed.
