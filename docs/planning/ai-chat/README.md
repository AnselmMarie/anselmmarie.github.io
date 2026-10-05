# AI Chat: Portfolio Assistant

An AI chat on anselmmarie.com that answers questions about the portfolio (bio,
experience, projects) and **moves the visitor around the site**: it scrolls to a
homepage section or opens a `/portfolio/$slug` page. The backend is a
**TypeScript Node.js 22 Lambda** calling **Claude on Amazon Bedrock**, with
streamed replies and layered guardrails that cap the bill and keep the
assistant on topic.

**Target codebase:** the Nx / TanStack Start site on the **`version-3`** branch
(`b3657e9`, #52). Every path in this plan was checked against that branch.
Code goes on `feat/amarie/ai-chat-buildout`, which contains `version-3`
([D19](./decisions.md#d19)).

## Design source

| Screen | Template | Status | Link |
|---|---|---|---|
| Chat launcher (floating button) | `_design/Anselm Marie Portfolio.html` → `<!-- AI CHAT -->` | ✅ drawn | [open](../../../_design/Anselm%20Marie%20Portfolio.html) |
| Chat drawer (header, messages, composer) | same block | ✅ drawn | [open](../../../_design/Anselm%20Marie%20Portfolio.html) |
| Streaming, waiting, resting / disabled / blocked / error states | — | **not drawn**, so invented and flagged | — |

Design of record: [D17](./decisions.md#d17). The drawn values, the token
mapping, the components to build, and every invented behavior are in
[design.md](./design.md). ⚠️ `_design/` is gitignored, so these links are local-only.

## First visible checkpoint

**First visible checkpoint:** Slice 1, the chat launcher and panel.
**Where:** any route on the shell (dev: `localhost:3000`) → a floating launcher
in the bottom corner, served by the new **`chat` remote** (`apps/chat`, dev port
4178, [D13](./decisions.md#d13)). It can also be opened standalone at
`localhost:4178`.
**On screen:** the launcher opens the right-side chat drawer from the design, with the greeting and a composer. Sending a message
shows a scripted reply.
**Stubbed:** the whole backend. Replies come from `use-chat-stub.ts` and
`chat-replies.fixture.ts`.
**Real by:** Slice 5 (connect).

## Flow

**Flow:** frontend-first
**Order:** form (Slice 1) → list + tool executor (2) → API (3) → infra (4) →
connect (5)
**Placeholder data:** `libs/features/chat/src/chat-stub/chat-replies.fixture.ts`,
read only through `use-chat-stub.ts`. Deleted in Slice 5.
**Database:** no relational database layer. The one DynamoDB quota table is
infrastructure and lives in Slice 4.
**Services:** no separate services package. The client data access is one hook,
`use-chat`, inside `libs/features/chat`, which the `chat` remote renders
([D13](./decisions.md#d13)).
**Base in parallel:** none planned. Slice 3 *could* run alongside Slices 1–2.
See [parallelization.md](./parallelization.md).

## Slices

| # | Layer | Scope | Visible? | Status | File |
|---|---|---|---|---|---|
| 1 | fe-form | `chat` remote MFE + the drawn launcher, drawer, bubbles and composer on stub replies | ✅ screen | committed, in review | [01-chat-panel.md](./slices/01-chat-panel.md) |
| 2 | fe-list | Client tool executor (`scroll_to` / `navigate`) + shell navigate listener | ✅ screen | not started | [02-messages-and-tools.md](./slices/02-messages-and-tools.md) |
| 3 | api | Contract lib + handler + Bedrock streaming + in-code guardrails | — none | not started | [03-chat-api.md](./slices/03-chat-api.md) |
| 4 | infra | Lambda, CloudFront route, WAF, DynamoDB, Guardrail, budget kill switch | — none | not started | [04-chat-infra.md](./slices/04-chat-infra.md) |
| 5 | connect | Real streaming, WAF challenge token, states, off-topic eval | ✅ screen | not started | [05-connect.md](./slices/05-connect.md) |

No more than two invisible slices run in a row (3, 4).

## Other files

- [design.md](./design.md): what the design draws, token mapping, components, and invented behaviors.
- [architecture.md](./architecture.md): request path, stream protocol,
  timing, and why TypeScript.
- [guardrails.md](./guardrails.md): bill protection (A1–A7) and on-topic
  controls (B1–B5).
- [decisions.md](./decisions.md): the numbered decisions log.
- [open-questions.md](./open-questions.md): everything unanswered, and which
  slice each blocks.
- [parallelization.md](./parallelization.md): dependency graph, shared files,
  waves, and file counts.
