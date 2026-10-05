# Slice 5: Connect the panel to the real API

**Status:** not started · **Layer:** connect · **Visible?** ✅ screen · **Depends on:** Slices 2 and 4
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) → AI CHAT, drawn ✅ for the bubbles. Undrawn behaviors are invented, see [design.md](../design.md#not-drawn-so-invented-flag-each-one-in-the-slice-report) ([D17](../decisions.md#d17))

## Decisions that bind this slice
- **D5**: the client holds the conversation and trims it to the A4 caps before sending.
- **D7**: A1 client token, A7 UI, B5 eval run.
- **D21**: the client sends `/api/chat` through `AwsWafIntegration.fetch` when the WAF SDK URL is configured, and plain `fetch` otherwise (dev, e2e).
- **D11**: the client parses NDJSON into contract events and validates each one.

## Open questions blocking this slice
- **Q4**: Bedrock model access, for the live check only.

## What changes on screen
- Replies come from Bedrock, streamed token by token.
- The WAF challenge runs silently before the first send (no widget).
- New states: **resting today** (quota), **disabled** (kill switch: the
  launcher is hidden), **blocked** (canned redirect), **error** (retry).

## Files

| File | Purpose |
|---|---|
| `libs/features/chat/src/chat-api/use-chat.ts` (+ spec) | Real hook: POST, stream reader, NDJSON parse, contract validation. Same signature as the stub |
| `libs/features/chat/src/chat-api/parse-ndjson.ts` (+ spec) | Handles chunk boundaries that split lines |
| `libs/features/chat/src/chat-api/load-waf-sdk.ts` (+ spec) | Injects the WAF integration script once and resolves to `AwsWafIntegration.fetch`, or to plain `fetch` when no SDK URL is configured or the script fails to load |
| `apps/chat/vite.config.ts` | `define` the WAF SDK URL from `PORTFOLIO_CHAT_WAF_SDK_URL` at build time. The deploy CLI sets it from Slice 4's stack output. **Proposed**; confirm the config path while building |
| `libs/features/chat/src/chat-status/chat-status.tsx` (+ spec) | Resting / blocked / error banners |
| `libs/features/chat/src/chat-stub/**` | **Deleted** |
| `e2e/chat.spec.ts` | Playwright with a routed `/api/chat` mock |

## Specs
- `parse-ndjson`: whole lines, split lines, a trailing partial line, an invalid line (dropped, not thrown).
- `use-chat`: each event type updates state correctly; network failure → error state; history trimmed to caps.
- `load-waf-sdk`: no URL → plain `fetch`; script loads → the SDK's fetch; script error → plain `fetch`, and the request is still sent.
- Through the parent panel: a `resting` event shows the resting banner; `disabled` hides the launcher.
- E2E: open chat → "show me your work" (mocked stream with a `scroll_to`) → `#work` in view.

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
- Flip `chat-enabled` to `false` → the launcher disappears within the cache TTL.
- Screenshots of all of the above.
