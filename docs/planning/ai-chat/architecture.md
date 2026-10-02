# Architecture

## Request path

```
`chat` remote MFE (apps/chat → ./Chat, mounted once in the shell root via
ChatRemote, so it persists across routes. D13)
  │ POST /api/chat  { messages, turnstileToken }
  ▼
CloudFront (existing SiteDistribution)
  │ behavior /api/chat*  · WAF rate rule · no caching · POST allowed
  ▼
Chat Lambda Function URL
  │ auth AWS_IAM + Origin Access Control (same pattern as the Shell, D108)
  │ invoke mode RESPONSE_STREAM · Node 22 · arm64 · reserved concurrency
  │
  ├─ kill switch (SSM)  → off: "disabled" event, no model call
  ├─ Turnstile verify   → bad: 403, no model call
  ├─ zod request caps   → bad: 400, no model call
  ├─ quota check (DynamoDB per-IP + global daily) → over: "resting" event
  └─ Bedrock ConverseStream (Claude Haiku 4.5, guardrailConfig, cached system prompt)
        │
  ◄─────┘ streamed NDJSON events back to the browser
```

The browser carries out tool calls. The server never scrolls or navigates
anything.

| Tool | Browser action |
|---|---|
| `scroll_to({ sectionId })` | On `/`: `document.getElementById(id).scrollIntoView()`. Elsewhere: dispatch `portfolio:navigate` with `anchorHref(id, pathname)` → `/#id` |
| `navigate({ slug })` | Dispatch `portfolio:navigate` with `/portfolio/<slug>` |

### Navigation across the remote boundary (D14)

The chat is a remote, and remotes don't import `@tanstack/react-router`: D43
kept the header off the router singleton, and the chat follows the same rule.
Instead:

```
chat remote ── window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { href } }))
                      │
shell root  ── useChatNavigateListener: validate href (/, /#<section>, /portfolio/<known slug>)
                      └─► router.navigate({ href })  →  MfeHashReapply scrolls to #section
```

- The event name and the `{ href }` payload type are exported from
  `libs/shared/chat-contract`, so both sides agree at compile time.
- The shell **re-validates** the href (B3). A remote can't use the event to send
  the visitor anywhere outside the site.
- If the shell has no listener (an older shell, or the remote running
  standalone), nothing happens. The chat stays usable and just doesn't move the
  page.

`anchorHref()` already exists in
`libs/features/header/src/anchor-href/anchor-href.ts`. A second consumer means
it moves to `libs/shared/utils` (see Slice 2).

## The model's knowledge: no RAG

`libs/shared/fixtures` already exports everything the assistant needs to know:
`HOMEPAGE_CONTENT`, `PORTFOLIO_ITEMS`, `portfolioItemBySlug`, `SECTION_IDS`,
`SITE_SECTIONS`. The handler builds its system prompt from those imports at
cold start and marks it for **prompt caching**.

- The corpus is a few thousand tokens, small enough to send whole. A vector DB
  would add cost and moving parts without improving accuracy.
- The tool enums (`sectionId` ∈ `SECTION_IDS`, `slug` ∈ `PORTFOLIO_ITEMS`) come
  from the same source. Renaming a section breaks the build instead of leaving
  the chat pointing at nothing.

## Stream protocol (NDJSON, one event per line)

| `type` | Payload | Meaning |
|---|---|---|
| `text-delta` | `{ text }` | Append to the assistant message |
| `tool-call` | `{ name, input }` | Validated against the contract, then executed in the browser |
| `done` | `{ }` | End of turn |
| `resting` | `{ reason: 'ip' \| 'global' }` | A quota was hit. No model call was made |
| `disabled` | `{ }` | Kill switch is off |
| `blocked` | `{ }` | Bedrock Guardrails intervened. The panel shows a canned redirect |
| `error` | `{ code }` | Generic failure. Never leaks internals |

The types live in `libs/shared/chat-contract`, which both sides import.

## Why a request takes 1–5 seconds

| Step | Typical time |
|---|---|
| CloudFront → Lambda, validation, quota check | ~10–50 ms |
| Lambda cold start (first request after a quiet spell) | ~200–400 ms |
| Bedrock reads the prompt and returns the **first token** | ~0.3–1 s |
| Bedrock **generates the rest** of a ~300-token reply, one token at a time | ~2–4 s |

The model writes one token (about ¾ of a word) at a time, at roughly 80–150
tokens per second. Streaming puts the first words on screen after about half a
second. The ~400-token output cap keeps the total short.

## Why TypeScript (not Rust or Python)

- **The model dominates the timing.** The handler's own work is milliseconds,
  so Rust's speed gains nothing.
- **Streaming is native on Node.** Lambda response streaming is built into the
  managed Node runtime. Python and Rust need a custom runtime or the Lambda Web
  Adapter.
- **One contract for both sides.** Tool schemas, event types and the valid
  section IDs are a TypeScript lib that both the browser and the Lambda import.
- **It matches the repo.** The `infra/` CDK stack is TypeScript, already on Node
  22 and arm64, and the Nx / vitest / biome gates apply unchanged.
- **Python's strengths don't apply.** Training, fine-tuning, or running
  embedding models yourself are all out of scope.
