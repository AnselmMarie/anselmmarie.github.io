# Slice 1: `chat` remote MFE, launcher and drawer (on stub replies)

**Status:** not started · **Layer:** fe-form · **Visible?** ✅ screen · **Depends on:** Wave 0 (contract lib + manifests)
**Design:** [`_design/Anselm Marie Portfolio.html`](../../../../_design/Anselm%20Marie%20Portfolio.html) → `<!-- AI CHAT -->`, drawn ✅. Transcribed in [design.md](../design.md) ([D17](../decisions.md#d17))

## Decisions that bind this slice
- **D3**: built on `version-3`.
- **D8**: frontend-first. This slice puts the panel on screen with stub data.
- **D13**: the chat is its own federated remote. `apps/chat` exposes `./Chat`
  on dev port 4178, wired exactly like `footer`.
- **D15**: a failed chat remote renders nothing (no notice, no skeleton).
- **D17**: build to the drawn launcher + right-side drawer, from theme tokens and
  ui-components. Add `ChatSheet`, `IconButton`, `PillInput` and three `UiIcon` names.
- **D11**: messages use the event types from `libs/shared/chat-contract`, even in the stub.
- MFE **D16**: the shell never imports the chat's package. Anything the shell
  passes through `remoteProps` is declared on the shell side.
- MFE **D36 / D55**: the remote is client-only. `ClientOnly` keeps
  `import('chat/Chat')` out of the SSR Lambda bundle.

## Open questions blocking this slice
- **Q5**: no branch yet.

## What's on screen
- The drawn launcher: a 56px ink circle with a mint message icon, bottom-right,
  on every route, loaded from the `chat` remote. It's hidden while the drawer is open.
- Clicking it dims the page (scrim) and slides in the **right-side drawer**:
  "Chat" header + close, the greeting bubble, and the pill composer.
- Sending appends a visitor bubble (ink, right) and a **scripted** assistant reply
  (mint, left) that streams in. Auto-scrolls to the newest. No network.
- Esc, the close button, and a press on the scrim all close it.
- `apps/chat` also runs standalone at `localhost:4178`, like the other remotes.

## Stubbed
- The entire backend. `use-chat-stub.ts` returns replies from
  `chat-replies.fixture.ts`, emitted as contract-shaped `text-delta` events on a
  timer so the streaming feel is real.
- **Real by:** Slice 5.

## Files

### The remote and its feature lib (new)

| File | Purpose |
|---|---|
| `apps/chat/{project.json,package.json,tsconfig.json,vite.config.ts,index.html}` | Remote app scaffold, copied from `apps/footer`. `exposes: { './Chat': … }`, `DEV_PORT = 4178`, `strictPort` |
| `apps/chat/src/{main.tsx,bootstrap.tsx,styles.css}` | Standalone entry, as in `apps/footer` |
| `libs/features/chat/{project.json,package.json,tsconfig*.json,vitest.config.ts}` | Lib scaffold (manifest parts done in Wave 0) |
| `libs/features/chat/src/index.ts` | Barrel: exports `Chat` |
| `libs/features/chat/src/chat/chat.tsx` (+ spec) | Root: open state, launcher (`IconButton tone="ink" size={56}`), `ChatSheet` |
| `libs/features/chat/src/chat-messages/chat-messages.tsx` (+ spec) | Scrolling column + auto-scroll on open and on change |
| `libs/features/chat/src/chat-messages/chat-message.tsx` | One bubble: visitor or assistant tone and radius, from design.md |
| `libs/features/chat/src/chat-composer/chat-composer.tsx` (+ spec) | White fade + `PillInput` (`maxLength={500}`, A4) + send `IconButton` |
| `libs/features/chat/src/chat/chat-greeting.const.ts` | The drawn greeting text |
| `libs/features/chat/src/chat-stub/use-chat-stub.ts` (+ spec) | The one seam Slice 5 swaps. Same signature as the real `use-chat` |
| `libs/features/chat/src/chat-stub/chat-replies.fixture.ts` | Scripted replies, taken from the design's sample exchange |

### Shared UI (new or modified in `libs/ui/*`)

| File | Change |
|---|---|
| `libs/ui/components/src/chat-sheet/chat-sheet.tsx` (+ spec) | **New.** Wraps the `Sheet` primitive, `side="right"`: the inset 14px, 400px, `radius-card`, `surface` panel; `backdrop/35` scrim; title slot + close. Override pattern copied from `MenuSheet` |
| `libs/ui/components/src/icon-button/icon-button.tsx` (+ spec) | **New.** Round icon-only button over the `Button` primitive. `tone: 'ink' \| 'ghost'`, `size: 36 \| 44 \| 56`, required `label` (becomes `aria-label`) |
| `libs/ui/primitives/src/input.tsx` | **Generated** by `shadcn add input` (D40). Never hand-edited |
| `libs/ui/components/src/pill-input/pill-input.tsx` (+ spec) | **New.** 44px pill, `rule` border, white fill, focus border `accent` |
| `libs/ui/components/src/ui-icon/ui-icon.tsx` (+ spec) | Add `message-circle`, `send`, `x` |
| `libs/ui/components/src/index.ts`, `libs/ui/primitives/src/index.ts` | Barrel entries |
| `.claude/rules/design-system.md` | Replace the Button-casing placeholder: the first Button use is icon-only, so casing still isn't settled for text buttons. Say that instead of guessing |

### The wiring, following every place `footer` is registered (modified)

| File | Change |
|---|---|
| `libs/shared/types/src/remote/remote.ts` | Add `'chat'` to `RemoteName` |
| `libs/shared/config/src/remote-registry/remote-registry.ts` (+ spec) | `DEFAULT_CHAT_ORIGIN = 'http://localhost:4178'`, `CHAT_ORIGIN`, a `chat` row with `exposedModule: './Chat'` |
| `apps/shell/vite.config.ts` | `chat` federation remote entry |
| `apps/shell/src/remotes/remotes.d.ts` | `declare module 'chat/Chat'` |
| `apps/shell/src/remotes/chat-remote.tsx` (+ spec) | **New.** `ClientOnly` + `MfeRemoteMount mfe="chat" exposedModule="Chat"`, `fallback={() => <></>}` (D15), no skeleton, `onLoadRemote` as a module-level const |
| `apps/shell/src/routes/__root.tsx` | Mount `<ChatRemote />` once, outside the route `Outlet`, so it persists |
| `infra/src/site-config/site-config.ts` (+ spec) | Add `'chat'` to `REMOTES`. The deploy CLI and deploy plan read this list |
| `e2e/support/remotes.ts` | Add `chat` to `RemoteName`, the origin list (`PORTFOLIO_CHAT_ORIGIN`), and both page compositions |
| `.env.example` | `PORTFOLIO_CHAT_ORIGIN`, `PORTFOLIO_CHAT_VERSION` |

⚠️ **Check while building:** the CI workflow, and anything else that has to
change when a remote is added. Grep `version-3` for `portfolio-item` and
`PORTFOLIO_FOOTER` and match every hit. A missed spot means the shell 404s
`chat/remoteEntry.js` in production while dev works, and D15 makes that
failure **silent by design**, so the deploy check has to look for it.

## Conventions that apply
- One component per file; section folders one level deep (lib-section-folders).
- Build from `@portfolio/ui-components` and theme tokens, with no raw palette
  classes (design-system). The **one** raw value is `white` for the composer,
  which has no token (design.md).
- New components are pulled because this slice needs them (D40). The feature
  never imports `@portfolio/ui-primitives` directly (module boundaries).
- Props: data → booleans (`isOpen`) → `on*` callbacks (`onClose`, `onSend`).

## Specs
- The launcher opens the drawer and is gone while it's open; close, Esc and a scrim press close it.
- Composer: an empty or whitespace message doesn't send; the input caps at 500;
  send calls `onSend` and clears the input.
- The greeting is the first message on open.
- `IconButton`: renders its `label` as the accessible name; each tone renders.
  `ChatSheet`: open/close through `onOpenChange`, labelled by its title.
  `PillInput`: forwards value/change. `UiIcon`: the three new names render.
  (No class or style assertions, per testing-conventions.)
- Through the parent `Chat`: sending shows the user message, then the stub reply streams in.
- Typing and the send button are keyboard-reachable; the panel has a labelled dialog role.
- `chat-remote.spec.tsx`: mounts through `MfeRemoteMount` with the federated
  stub (`apps/shell/src/test-stubs/federated-module.tsx`); a failed load renders
  nothing and doesn't throw (D15). Seen failing with the fallback swapped for a notice.
- `remote-registry.spec.ts`: the `chat` row resolves to the right origin and `./Chat`.

## Done when
- Screenshots of the closed launcher and the open drawer inside the shell with a
  stubbed exchange, at desktop and mobile width, **side by side with the design**.
- An invented-behavior list in the report, taken from design.md (streaming bubble, no counter).
- Screenshot of the standalone remote at `localhost:4178`.
- `typecheck`, `lint`, `test` green on `chat`, `feature-chat`, `shell`,
  `shared-types`, `shared-config`, `infra`, `ui-components`, `ui-primitives`. E2E composition spec green.
- The report says the replies are **stubbed until Slice 5**.
