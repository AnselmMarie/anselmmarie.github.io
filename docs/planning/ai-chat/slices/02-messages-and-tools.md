# Slice 2: Client tool executor (the chat moves the page)

**Status:** built and committed 2026-10-05 (`17b49f2`, `ff88fb5`, `95e1cde`, `9155856`), in review · **Layer:** fe-list · **Visible?** ✅ screen · **Depends on:** Slice 1
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) → AI CHAT, drawn ✅ for the bubbles. Undrawn behaviors are invented, see [design.md](../design.md#not-drawn-so-invented-flag-each-one-in-the-slice-report) ([D17](../decisions.md#d17))

## Decisions that bind this slice
- **D10**: two tools only, `scroll_to` and `navigate`, enum args. The browser executes them.
- **D11**: tool calls arrive as `tool-call` events from the contract.
- **D7 / B3**: the browser **re-validates** every tool call against the contract schema before acting. Anything invalid is ignored.
- **D13 / D14**: the chat is a remote and **never imports the router**.
  Navigation goes out as a `portfolio:navigate` CustomEvent. The shell root
  listens, re-validates the href, and calls `router.navigate`.

## Open questions blocking this slice
none

## What's on screen
- The bubbles and list already exist from Slice 1 (the design draws them).
- The stub now also emits tool calls. Asking "show me your work" **closes the
  drawer** and scrolls the page to `#work`; asking about a project opens
  `/portfolio/<slug>`. Reopening shows the conversation intact.
- A mono-caps note under that reply ("→ WORK"). Both behaviors are **invented**,
  see design.md.

## Stubbed
- Replies and tool calls still come from `use-chat-stub.ts`, keyword-matched in
  the fixture. **Real by:** Slice 5.

## Files

| File | New / modified | Purpose |
|---|---|---|
| `libs/features/chat/src/chat/chat.tsx` (+ `chat-tool-calls.spec.tsx`) | modified | Closes the drawer after a valid tool call, then runs it (invented, design.md). The tool-call specs went in their own file to keep `chat.spec.tsx` under 200 lines |
| `libs/features/chat/src/chat-messages/chat-message.tsx`, `chat-messages.tsx` | modified | Mono-caps "→ WORK" note under a reply that moved the page (invented). A reply with only a note still renders |
| `libs/features/chat/src/chat-transcript/chat-transcript.ts` (+ spec) | modified | `ChatMessage.note`; `applyChatEvent` sets it for a **valid** tool call; `ChatSessionOptions { onToolCall }`, the seam's new argument |
| `libs/features/chat/src/chat-tools/chat-tool-action.ts` (+ spec) | new | `toChatToolAction(event, pathname)`: pure, → `{ kind: 'scroll', id }` / `{ kind: 'navigate', href }` / `null`. `runChatToolAction`: `scrollIntoView`, or dispatches `portfolio:navigate`. No router import. **Diverges from the plan:** one file instead of `execute-chat-tool.ts` + a `use-chat-tool-executor` hook, because running an action holds no React state |
| `libs/features/chat/src/chat-tools/chat-tool-note.ts` (+ spec) | new | The note's words: the section's nav label or the project's title |
| `libs/features/chat/src/chat-stub/use-chat-stub.ts` (+ spec) | modified | Takes `{ onToolCall }` and calls it as each `tool-call` plays. `pickStubReply` returns the whole reply, `toStubEvents` puts the tool call after the text |
| `libs/shared/chat-contract/src/chat-tools/chat-tools.ts` (+ spec) | new | zod `scrollToInputSchema` / `navigateInputSchema` (strict, enums from the fixtures) and `parseChatToolCall`. Slice 3 hands the same schemas to Bedrock |
| `libs/shared/chat-contract/src/navigate-event/navigate-event.ts` (+ spec) | new | `CHAT_NAVIGATE_EVENT`, `ChatNavigateDetail`, `isAllowedHref(href)` (`/`, `/#<SECTION_IDS>`, `/portfolio/<known slug>`, exact matches only), `portfolioHref` |
| `apps/shell/src/chat-navigate/use-chat-navigate-listener.ts` (+ spec) | new | Shell side: listens, checks `isAllowedHref`, calls `router.navigate({ href })` |
| `apps/shell/src/routes/__root.tsx` | modified | Calls the listener hook once |
| `libs/shared/utils/src/anchor-href/anchor-href.ts` (+ spec) | moved | `git mv` from `libs/features/header/src/anchor-href/`. It now has a second consumer |
| `libs/shared/utils/src/index.ts` | modified | Export `anchorHref`, `HOME_PATH`, `WORK_HREF` |
| header import sites, header `index.ts` | modified | Import from `@portfolio/shared-utils`; the header barrel no longer re-exports them (nothing imported them from there) |
| `libs/features/chat/src/chat-stub/chat-replies.fixture.ts` | modified | `CHAT_STUB_TOOL_REPLIES`, matched first: Cosmikata / Pokémon Pet Shop → `navigate`, "your work" / "experience" → `scroll_to` |
| `package.json` of `shared-chat-contract` (+ `zod`, `shared-fixtures`), `shared-utils` (+ `shared-fixtures`), `feature-chat` (+ `shared-utils`, `shared-fixtures`), `shell` (+ `shared-chat-contract`); their `tsconfig.json` (`nx sync`); `pnpm-lock.yaml` | modified | Importer entries only. `zod` resolves to the 4.6.5 already in the lockfile |

✅ **The `anchor-href` move:** `type:shared` → `shared-fixtures` is allowed, so
`anchor-href.ts` keeps importing `WORK_SECTION_ID`. Lint confirms it.

⚠️ **Bundle cost:** the contract builds its slug enum from `PORTFOLIO_ITEMS`,
so the chat remote now bundles the portfolio fixtures (~42 KB of source).
Acceptable for now; a slug-only export would avoid it.

⚠️ **Not spec-covered:** the one line in `__root.tsx` that calls
`useChatNavigateListener()`. The root renders the whole document, so no spec
renders it; the browser check covers it until Slice 5's e2e does.

## Specs
- `execute-chat-tool`: valid `scroll_to` on `/` → in-page scroll; on
  `/portfolio/x` → navigate to `/#id`; valid `navigate` → `/portfolio/<slug>`;
  unknown section, unknown slug, unknown tool name, extra fields → `null`.
- `isAllowedHref`: accepts `/`, `/#work`, `/portfolio/<real slug>`; rejects an
  unknown section or slug, `https://evil.example`, `//evil.example`, and
  `javascript:`.
- Shell listener: an allowed href → `router.navigate` called; a disallowed href →
  not called; unmount removes the listener.
- **Through the parent panel** (spec-through-the-parent): a stub reply with a
  tool call reaches the executor and dispatches the event or scrolls. Deleting
  the forwarding line must make it fail. **Each spec is seen failing.**
- Header specs still pass after the move. The spec-file count matches before and after.

## Done when
- A screenshot showing a chat-triggered scroll, plus one of a project page opened from the chat.
- `typecheck`, `lint`, `test` green on `feature-chat`, `feature-header`,
  `shared-utils`, `shared-chat-contract`, `shell`.
