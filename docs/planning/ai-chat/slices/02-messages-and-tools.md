# Slice 2: Client tool executor (the chat moves the page)

**Status:** not started · **Layer:** fe-list · **Visible?** ✅ screen · **Depends on:** Slice 1
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) → AI CHAT, drawn ✅ for the bubbles. Undrawn behaviors are invented, see [design.md](../design.md#not-drawn-so-invented-flag-each-one-in-the-slice-report) ([D17](../decisions.md#d17))

## Decisions that bind this slice
- **D10**: two tools only, `scroll_to` and `navigate`, enum args. The browser executes them.
- **D11**: tool calls arrive as `tool-call` events from the contract.
- **D7 / B3**: the browser **re-validates** every tool call against the contract schema before acting. Anything invalid is ignored.
- **D13 / D14**: the chat is a remote and **never imports the router**.
  Navigation goes out as a `portfolio:navigate` CustomEvent. The shell root
  listens, re-validates the href, and calls `router.navigate`.

## Open questions blocking this slice

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
| `libs/features/chat/src/chat/chat.tsx` (+ spec) | modified | Closes the drawer after a tool call runs (invented, design.md) |
| `libs/features/chat/src/chat-messages/chat-message.tsx` | modified | Mono-caps "→ WORK" note under a reply that moved the page (invented) |
| `libs/features/chat/src/chat-tools/execute-chat-tool.ts` (+ spec) | new | Pure: (event, pathname) → `{ kind: 'scroll', id }` or `{ kind: 'navigate', href }`, or `null` when invalid |
| `libs/features/chat/src/chat-tools/use-chat-tool-executor.ts` (+ spec) | new | Applies the action: `scrollIntoView`, or dispatches `portfolio:navigate`. No router import |
| `libs/shared/chat-contract/src/navigate-event/navigate-event.ts` (+ spec) | new | `CHAT_NAVIGATE_EVENT`, the `{ href }` type, and `isAllowedHref(href)` (`/`, `/#<SECTION_IDS>`, `/portfolio/<known slug>`) |
| `apps/shell/src/chat-navigate/use-chat-navigate-listener.ts` (+ spec) | new | Shell side: listens, checks `isAllowedHref`, calls `router.navigate({ href })` |
| `apps/shell/src/routes/__root.tsx` | modified | Calls the listener hook once |
| `libs/shared/utils/src/anchor-href/anchor-href.ts` (+ spec) | moved | `git mv` from `libs/features/header/src/anchor-href/`. It now has a second consumer |
| `libs/shared/utils/src/index.ts` | modified | Export `anchorHref`, `HOME_PATH`, `WORK_HREF` |
| header import sites | modified | Import from `@portfolio/shared-utils` |
| `libs/features/chat/src/chat-stub/chat-replies.fixture.ts` | modified | Add tool-call scripts |

⚠️ **The `anchor-href` move needs care.** `anchor-href.ts` imports
`WORK_SECTION_ID` from `@portfolio/shared-fixtures`. Check that
`type:shared` → `shared-fixtures` is allowed in
`tools/eslint/module-boundaries.mjs`. If it isn't, pass the section ID in
instead of importing it.

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
