# Open Questions

Every unanswered question lives here, with the slice it blocks. A question is never raised
inside a slice's prose and left there — that is how a discussion gets lost.

When one is answered: write the answer as a numbered decision in
[decisions.md](./decisions.md), move the entry to
[questions-closed.md](./questions-closed.md) with a closure note, update the table below,
and update the binding block of every slice that named it. All four, in the same change.

**Two are open, and only one wants an answer: [Q14](#q14).** [Q2](#q2) is a spike gate that
[Slice 3](./slices/03-federation-header.md) answers by building, not something anyone can
settle at a desk.

The other fourteen closed on 2026-09-20 and live in
[questions-closed.md](./questions-closed.md), full text and closure notes intact. ⚠️ **This
file was split at 548 lines**, over the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md); nothing was
dropped in the cut.

| Q | Blocks | Status |
|---|---|---|
| [Q1](./questions-closed.md#q1) | Slices 4, 5, 6, 7 | ✅ → [D34](./decisions-d33-d41.md#d34) |
| [**Q2**](#q2) | Slice 3 | **open — a spike gate, not a decision** |
| [Q3](./questions-closed.md#q3) | Slice 8 | ✅ → [D35](./decisions-d33-d41.md#d35) |
| [Q4](./questions-closed.md#q4) | Slice 3 | ✅ → [D39](./decisions-d33-d41.md#d39) |
| [Q5](./questions-closed.md#q5) | Slice 8 | ✅ → [D31](./decisions-d17-d32.md#d31) |
| [Q6](./questions-closed.md#q6) | Slice 9, launch | ✅ → [D41](./decisions-d33-d41.md#d41) |
| [Q7](./questions-closed.md#q7) | Slice 2 | ✅ → [D40](./decisions-d33-d41.md#d40) |
| [Q8](./questions-closed.md#q8) | Slice 2 | ✅ → [D38](./decisions-d33-d41.md#d38) |
| [Q9](./questions-closed.md#q9) | Slices 6, 7, SSR model | ✅ → [D36](./decisions-d33-d41.md#d36) |
| [Q10](./questions-closed.md#q10) | Slices 1 and 8 | ✅ → [D37](./decisions-d33-d41.md#d37) |
| [Q11](./questions-closed.md#q11) | Slice 1, D27/D29 enforcement | ✅ → [D44](./decisions-d42-d47.md#d44) |
| [Q12](./questions-closed.md#q12) | Slices 3, 6, 7 | ✅ → [D42](./decisions-d42-d47.md#d42) |
| [Q13](./questions-closed.md#q13) | Slice 3 | ✅ → [D43](./decisions-d42-d47.md#d43) |
| [**Q14**](#q14) | Slices 1, 6, 7 | **open** |
| [Q15](./questions-closed.md#q15) | Slice 1 | ✅ → [D46](./decisions-d42-d47.md#d46) |
| [Q16](./questions-closed.md#q16) | Slice 1 | ✅ → [D45](./decisions-d42-d47.md#d45) |

---

<a id="q2"></a>
## Q2 — Does `@module-federation/vite` compose with TanStack Start? (open, narrowed)

**Raised:** 2026-09-20 · **Partially answered:** 2026-09-20 · **Blocks:** Slice 3, and
therefore 5, 6, 7

**What is now settled** → [D30](./decisions-d17-d32.md#d30), [D31](./decisions-d17-d32.md#d31). Cloudflare
confirmed that Module Federation cannot run server-side on `workerd` (no `eval` /
`new Function`, no dynamic `import()` of a remote URL), while client-side federation works
normally. That blocked only federated SSR, which [D9](./decisions-d01-d16.md#d9) had already
declined — and the host has since moved to AWS anyway, so the `workerd` constraint no
longer applies to this plan at all.

**What is still open.** The plugin-coexistence half. The `@cloudflare/vite-plugin`
conflict is gone with the host, but TanStack Start still owns the Vite config and the
Lambda build output, and `@module-federation/vite` still participates in that build.
Federation must be **scoped to the client environment only** and must not transform the SSR
build. Nothing has proven that, and no amount of planning will.

**Answer path:** the spike gate in [Slice 3](./slices/03-federation-header.md). If the two
do not compose, **stop and report** rather than building three more remotes on a broken
seam. Fallback positions, in order of preference: load remotes purely client-side outside
Start's build graph; host the MF runtime in a client-only boundary; or back out to monorepo
imports (cheap, because of [D27](./decisions-d17-d32.md#d27)) and revisit.

---

<a id="q14"></a>
## Q14 — Should the shell server-render metadata even though it does not server-render content?

**Raised:** 2026-09-20 · **Blocks:** Slices 1, 6, 7

[D36](./decisions-d33-d41.md#d36) accepted, in full, that "link previews get nothing from the
content surfaces". That is true of the *rendered content*. It is **not** necessarily true of
the metadata, and the difference is cheap.

The shell runs on Lambda, owns the route, and imports `libs/shared/fixtures` at build time —
the same fixtures the Homepage and Portfolio Item render from. So it can emit a real
`<title>`, description, and Open Graph tags **server-side, per route**, while the visible
content still arrives via federation exactly as D36 decided. A link to
`/portfolio/pokemon-pet-shop` would then preview correctly even though its body is
client-rendered.

This does not reopen [D36](./decisions-d33-d41.md#d36) and does not federate anything. It recovers
the link-preview half of the cost D36 accepted, at the price of the shell reading the
fixtures — which it may already do for the not-found case in
[Slice 7](./slices/07-portfolio-item-mfe.md).

Also unanswered alongside it: `robots.txt`, a sitemap, and whether either is wanted at all.
