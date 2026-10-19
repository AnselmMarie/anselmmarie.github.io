# Slice 5: Connect the panel to the real API

**Status:** client built and committed 2026-10-05 (`0b8f776`, `753e9f2`, `1d565a7`), in review; deploy and live check not run · **Layer:** connect · **Visible?** ✅ screen · **Depends on:** Slices 2 and 4
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) → AI CHAT, drawn ✅ for the bubbles. Undrawn behaviors are invented, see [design.md](../design.md#not-drawn-so-invented-flag-each-one-in-the-slice-report) ([D17](../decisions.md#d17))

## Decisions that bind this slice
- **D5**: the client holds the conversation and trims it to the A4 caps before sending.
- **D7**: A1 client token, A7 UI, B5 eval run.
- **D21**: the client sends `/api/chat` through `AwsWafIntegration.fetch` when the WAF SDK URL is configured, and plain `fetch` otherwise (dev, e2e).
- **D11**: the client parses NDJSON into contract events and validates each one.
- **D24**: every POST carries `x-amz-content-sha256` (hex SHA-256 of the exact body bytes sent), or the Lambda OAC answers 403.
- **D26**: the WAF SDK URL is the stack's `ChatWafIntegrationUrl` output. ⚠️ Not emitted since **D29**, so production builds use plain `fetch` and the Challenge rule blocks sends until D29 is settled.
- **D27**: this slice's build-time calls (states as bubbles, disabled after a reply, event validation, the SDK URL `define`).

## Open questions blocking this slice
- **Q4**: Bedrock model access, for the live check only.
- **Q8**: the budget's service name, before `cdk deploy`.
- ~~**Q9**: the account's Lambda concurrency quota, before `cdk deploy`.~~ ✅ closed 2026-10-13 (limit 1,000).

## What changes on screen
- Replies come from Bedrock, streamed token by token.
- The WAF challenge runs silently before the first send (no widget).
- New states: **resting today** (quota), **disabled** (kill switch: the
  launcher is hidden), **blocked** (canned redirect), **error** (retry).

## Files

| File | Purpose |
|---|---|
| `libs/features/chat/src/chat-api/use-chat.ts` (+ spec) | Real hook: POST with the body hash, streamed events into the transcript, `isDisabled`, `retry` |
| `libs/features/chat/src/chat-api/read-chat-stream.ts` | Reads the body and hands each event over as its line completes (covered through `use-chat` and `Chat`) |
| `libs/features/chat/src/chat-api/parse-ndjson.ts` (+ spec) | Handles chunk boundaries that split lines; drops invalid lines |
| `libs/features/chat/src/chat-api/load-waf-fetch.ts` (+ spec) | Injects `challenge.js` once and resolves to `AwsWafIntegration.fetch`, or plain `fetch` with no SDK URL or a failed load |
| `libs/features/chat/src/chat-api/chat-request.ts` (+ spec) | History → capped request (A4), status bubbles left out; `sha256Hex` (D24) |
| `libs/features/chat/src/chat-transcript/chat-transcript.ts` (+ spec) | `status` on a message; status events replace the reply; `takeFailedTurn` for retry |
| `libs/features/chat/src/chat-messages/*` | Waiting dots (`chat-typing-dots.tsx`, new) and the retry button |
| `libs/features/chat/src/chat/chat.tsx` (+ 3 specs) | `use-chat` in place of the stub; launcher hidden when disabled |
| `libs/shared/chat/src/chat-stream-event/parse-chat-stream-event.ts` (+ spec) | The event schema (D27) |
| `apps/chat/vite.config.ts` | `define` the WAF SDK URL from `PORTFOLIO_CHAT_WAF_SDK_URL` |
| `infra/src/deploy/{aws-cli,deploy-remote}` (+ specs) | Read the optional output; pass it to the chat build only |
| `libs/features/chat/src/chat-stub/**` | **Deleted** |
| `e2e/chat.spec.ts` | Playwright with a routed `/api/chat` mock |

## Specs
- `parse-ndjson`: whole lines, split lines, a trailing partial line, an invalid line (dropped, not thrown).
- `use-chat`: each event type updates state correctly; network failure → error state; history trimmed to caps; the request carries `x-amz-content-sha256` matching the body it sends (D24).
- `load-waf-sdk`: no URL → plain `fetch`; script loads → the SDK's fetch; script error → plain `fetch`, and the request is still sent.
- Through the parent panel: a `resting` event shows the resting banner; `disabled` hides the launcher.
- E2E: open chat → "show me your work" (mocked stream with a `scroll_to`) → `#work` in view.

## Built (2026-10-05): the client half
- `feature-chat` 100 specs (98% statements / 91% branches), `shared-chat` 50, `infra` 138; e2e 27/27, including the 2 new chat specs against the composed production build.
- **Seen failing:** 17 negative controls (the hash header, the no-ending error, `setIsDisabled`, unmount abort, the post-end guard, the launcher's `isDisabled`, the `isStreaming` and `onRetry` forwarding in `Chat`, `isRetryable` in `ChatMessages`, the status filter, the trim loop, the split-line buffer, status replacement, single injection, the tool enum, the deploy env spread, the optional output). Each went red on its own assertion.
- **On screen** (the remote's standalone page, `localhost:4178`): the real error bubble + retry against dev's missing `/api/chat`; then, with `fetch` stubbed in the tab, the waiting dots, a streamed answer, the blocked redirect and the resting copy.
- **Not run:** the off-topic eval, `cdk deploy`, the remote deploy, the live check. Each needs the maintainer's go-ahead, and Q4, Q8 and Q9 first.

## Off-topic eval (B5)
Run `libs/api/chat/evals/off-topic.prompts.json` against the **deployed**
endpoint by hand. Record pass/fail per prompt in this file. Any failure →
tighten B1 or B2 and re-run before launch.

## Live check (maintainer's go-ahead required for `cdk deploy` and the first `chat` remote deploy)
- `cdk deploy` (Lambda, route, WAF, and the rest) and deploy the `chat` remote
  through the deploy CLI. It's a new entry in `REMOTES`, so the shell deploy must
  carry the new registry row too.
- Confirm `chat/remoteEntry.js` returns 200 on the live origin. D15 makes a
  missing remote **invisible**, so a launcher that never appears won't look
  broken, and this check is the only thing that proves the remote is there.
- Open anselmmarie.com, ask a real question → streaming text.
- Ask to see a project → navigation hop.
- `curl -X POST` `/api/chat` with no token → answered by WAF, and the Lambda's invocation count doesn't move.
- Flip `chat-enabled` to `false` → within the ~30s cache, the next send answers with the disabled copy, and the launcher stays hidden after the drawer closes (D27).
- Screenshots of all of the above.
