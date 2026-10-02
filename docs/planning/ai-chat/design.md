# Design: The Chat Drawer

**Source:** [`_design/Anselm Marie Portfolio.html`](../../../_design/Anselm%20Marie%20Portfolio.html),
the `<!-- AI CHAT -->` block near the end of the `x-dc` template, plus its
`chat*` render values in the component script. It's the export dated
**2026-10-02**, newer than the 2026-09-22 export that MFE D76 adopted. The chat
block is new in this export.

⚠️ `_design/` is gitignored (`.gitignore:9`), so this link resolves only on the
maintainer's machine. That's the same open issue as the MFE plan's
`design-sources.md`. The values below are transcribed so the plan doesn't
depend on the file being present.

## What's drawn

| Part | Drawn as |
|---|---|
| **Launcher** | Fixed bottom-right, 24px in. A 56px circle, `ink` fill, `accent-bright` Tabler `message-circle` icon (1.6rem), shadow `0 8px 24px rgba(14,26,25,.28)`, hover `scale(1.06)`. **Hidden while the drawer is open.** `aria-label="Open AI chat"` |
| **Scrim** | Full-viewport, `backdrop` at 35% opacity, 0.3s fade. A press on it closes the drawer |
| **Drawer** | A **right-side drawer**, not a bottom popup. Fixed `14px` from top, right and bottom (`spacing-frame`). Width `min(400px, 100vw − 28px)`, `surface` fill, `rule` border, `radius-card` (22px), shadow `0 16px 48px rgba(14,26,25,.25)`. Slides in from the right: `translateX(calc(100% + 28px))` → `0`, 0.35s `cubic-bezier(.16,1,.3,1)` (the accordion's easing) |
| **Header** | "Chat", `font-display` 700, 1.2rem, `-0.02em`. A 36px round close button (Tabler `x`, hover `surface-sunk`, `aria-label="Close chat"`). `rule` bottom border, 18px padding |
| **Messages** | A scrolling column with 18px padding (120px at the bottom so the last bubble clears the input), 18px gap. Bubbles are capped at 80% width, 0.9rem, line-height 1.5, `text-wrap: pretty` |
| — visitor | Right-aligned, `ink` fill, `paper` text, radius `16 16 4 16` |
| — assistant | Left-aligned, `accent-bright` fill, `ink` text, radius `16 16 16 4` |
| **Auto-scroll** | To the bottom when the drawer opens and whenever messages change |
| **Composer** | Pinned to the drawer's bottom over a white fade (`#FFF` 0–72%, then transparent). A pill input (44px, `rule` border, white fill, `font-body` 0.92rem, placeholder "Ask something…", focus border `accent`) and a 44px round send button (Tabler `send`, `ink` fill, `paper` icon, hover `accent-bright` fill + `ink` icon, `aria-label="Send"`). Empty or whitespace input doesn't send |
| **Greeting** | The first assistant message: "Hi! I can answer questions about Anselm's work, experience, and skills." |
| **Sample exchange** | Four Q&A pairs (projects, leadership, backend, availability). **Demo content**, not UI. It becomes the Slice 1 stub fixture, and its answers set the tone the B1 system prompt aims for |

## Token mapping (all exist in `libs/ui/theme/src/theme.css`)

| Design value | Token |
|---|---|
| `#14211E` | `ink` |
| `#EAE7DE` | `paper` |
| `#3FD9A4` | `accent-bright` |
| `#1C7A5E` | `accent` |
| `#F3F1EB` | `surface` |
| `#DFDBD1` | `surface-sunk` |
| `#D5D0C4` | `rule` |
| `rgba(14,26,25,.35)` | `backdrop/35` |
| 22px radius | `radius-card` |
| 999px radius | `radius-pill` |
| 14px inset | `spacing-frame` |
| `#FFFFFF` (input + fade) | **no token.** `white` is the one raw palette value, allowed by design-system.md because no token carries it |

## Components

| Need | Build from | Notes |
|---|---|---|
| Drawer + scrim + Esc / outside press | **New `ChatSheet`** in `libs/ui/components`, wrapping the existing `Sheet` primitive (`side="right"`) | Same override pattern as `MenuSheet`: panel classes undo the generated ones. Modal is fine here: the launcher is hidden while it's open, so MenuSheet's trigger problem doesn't apply. The generated backdrop is restyled to `backdrop/35` through `className`. If the generated sheet can't take that, stop and report rather than editing the primitive (D25) |
| Icons | **Extend `UiIcon`** with `message-circle`, `send`, `x` | One icon library (D75) |
| Round icon buttons (launcher, close, send) | **New `IconButton`** in `libs/ui/components` over the existing `Button` primitive, with `tone: 'ink' \| 'ghost'` and `size: 44 \| 56 \| 36` | It's the first use of the Button primitive, so it **resolves design-system.md's casing placeholder**: these buttons are icon-only, so casing doesn't arise. Record that, not a guess |
| Pill text input | Pull shadcn **`input`** on demand (D40) and wrap it as **`PillInput`** in `libs/ui/components` | No input primitive exists yet |
| Message bubble | `chat-message.tsx` in `libs/features/chat` | Feature-specific, so it doesn't belong in ui-components |

## Not drawn, so invented (flag each one in the slice report)

| Behavior | Slice | Proposed |
|---|---|---|
| A streaming reply (a bubble that grows) | 1 | The assistant bubble renders as text arrives, with no caret |
| Waiting before the first token | 5 | Three-dot pulse in an assistant bubble |
| What happens when a tool call moves the page | 2 | **Close the drawer** so the visitor sees the scroll or page change, and keep the conversation |
| The note in the bubble when the chat navigated | 2 | One mono-caps line, e.g. "→ WORK" |
| Resting today / disabled / blocked / error | 5 | Assistant-styled bubble text. Error adds a retry link |
| Turnstile placement | 5 | Invisible mode, no visible widget |
| Character counter (A4's 500-char cap) | 1 | **Not shown.** `maxLength=500` on the input only, which keeps the drawn composer unchanged |
