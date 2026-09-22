# Decision D75 — the brand marks are Tabler, drawn by one shared component

<a id="d75"></a>**D75 — the LinkedIn and GitHub links render as Tabler icons from a single
`SocialIcon` in `@portfolio/ui-components`.** Maintainer's call, 2026-09-21, closing the
divergence Slices 5 and 6 both reported.

v3 draws these two links as **Radix** marks (`GitHubLogoIcon`, `LinkedInLogoIcon`) at 30×30
in slate-800. Both wave agents shipped **text labels** instead, and both flagged it — not
from preference but because adding an icon dependency mutates a root manifest, which
[plan-parallelization.md](../../../.claude/rules/plan-parallelization.md) pulls out of every
parallel slice. Neither agent was permitted to fix what it had correctly identified.

⚠️ **The same divergence appearing in two independent slices is the signal worth keeping.**
It was not two oversights; it was one structural constraint surfacing twice. A wave that
forbids manifest work should expect its agents to hand back exactly this shape of finding,
and the coordinator should expect to spend a pass closing them.

## What was chosen

**Tabler** (`@tabler/icons-react`), not v3's Radix set — the maintainer's call. The marks are
equivalent; the library is not the one v3 used, and that is a deliberate, recorded divergence
rather than a port.

## Where it lives, and why that is not `ui-components`' own file

`SocialIcon` is in `libs/ui/components` — **two feature libs render it**, the footer and the
homepage hero, which is [D29](./decisions-d17-d32.md#d29)'s extraction threshold met rather
than anticipated.

But the **name union** `SocialIconName` lives in `@portfolio/shared-types`, not beside the
component:

- The homepage's links are **fixture data** (`homepage.fixture.ts`), and a fixture cannot
  import from `libs/ui/*` — `type:shared` may depend only on `type:shared`
  ([D29](./decisions-d17-d32.md#d29), enforced by `@nx/enforce-module-boundaries`).
- A second copy of the union in the UI package would mean the fixture and the component
  agreeing **by luck rather than by the compiler** — [D56](./decisions-d56.md#d56)'s lesson
  about `cn`, in type form.
- `type:ui-components` **may** depend on `type:shared`, so the canonical union in
  `shared-types` is reachable from both sides. That asymmetry is what makes the placement
  legal, and it is the only placement that is.

## ⚠️ The accessibility consequence, which is not incidental

Replacing a text label with a mark **removes the link's accessible name**. The name now comes
from `aria-label` alone, and the `<svg>` is `aria-hidden` so the link is announced once
rather than twice.

That change quietly invalidated an existing spec: the footer's forwarding assertion compared
each link's `textContent` to its label, and after the marks landed it was comparing `''` to
`''` — **green, and testing nothing.** It now asserts the accessible name. This is the
[prove-the-spec-can-fail](../../../.claude/rules/prove-the-spec-can-fail.md) failure mode
arriving by side effect: nobody edited that spec, and a passing suite would have hidden it.

Two assertions guard the new shape: one that the link keeps an accessible name, and one that
the mark is `aria-hidden`. Verified in the live DOM as well as in jsdom — both footer links
report their `aria-label` on the composed page.
