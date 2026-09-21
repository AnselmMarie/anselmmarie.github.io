# Open Questions

Every unanswered question lives here, with the slice it blocks. A question is never raised
inside a slice's prose and left there — that is how a discussion gets lost.

When one is answered: write the answer as a numbered decision in
[decisions.md](./decisions.md), move the entry to
[questions-closed.md](./questions-closed.md) with a closure note, update the table below,
and update the binding block of every slice that named it. All four, in the same change.

**One is open.** [Q17](#q17), raised by [D53](./decisions-d53.md#d53), and it wants an
answer before Slice 6.

[Q2](./questions-closed.md#q2) — the spike gate Slice 3 answered by building rather than
deciding — **closed on 2026-09-21** as [D55](./decisions-d55.md#d55): all four checks
passed, and the configuration it proved is recorded there. Its full entry moved to
[questions-closed.md](./questions-closed.md#q2) with its closure note.
[Q14](./questions-closed-q9-q16.md#q14) closed on 2026-09-20 as
[D48](./decisions-d48-d52.md#d48), which is what unblocked the route tree in Slice 1.

The other sixteen — fifteen closed on 2026-09-20, plus Q2 on 2026-09-21 — live in
[questions-closed.md](./questions-closed.md), full text and closure notes intact. ⚠️ **This
file was split at 548 lines**, over the 500-line cap in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md); nothing was
dropped in the cut.

| Q | Blocks | Status |
|---|---|---|
| [Q1](./questions-closed.md#q1) | Slices 4, 5, 6, 7 | ✅ → [D34](./decisions-d33-d41.md#d34) |
| [Q2](./questions-closed.md#q2) | Slice 3 | ✅ → [D55](./decisions-d55.md#d55) |
| [Q3](./questions-closed.md#q3) | Slice 8 | ✅ → [D35](./decisions-d33-d41.md#d35) |
| [Q4](./questions-closed.md#q4) | Slice 3 | ✅ → [D39](./decisions-d33-d41.md#d39) |
| [Q5](./questions-closed.md#q5) | Slice 8 | ✅ → [D31](./decisions-d17-d32.md#d31) |
| [Q6](./questions-closed.md#q6) | Slice 9, launch | ✅ → [D41](./decisions-d33-d41.md#d41) |
| [Q7](./questions-closed.md#q7) | Slice 2 | ✅ → [D40](./decisions-d33-d41.md#d40) |
| [Q8](./questions-closed.md#q8) | Slice 2 | ✅ → [D38](./decisions-d33-d41.md#d38) |
| [Q9](./questions-closed-q9-q16.md#q9) | Slices 6, 7, SSR model | ✅ → [D36](./decisions-d33-d41.md#d36) |
| [Q10](./questions-closed-q9-q16.md#q10) | Slices 1 and 8 | ✅ → [D37](./decisions-d33-d41.md#d37) |
| [Q11](./questions-closed-q9-q16.md#q11) | Slice 1, D27/D29 enforcement | ✅ → [D44](./decisions-d42-d47.md#d44) |
| [Q12](./questions-closed-q9-q16.md#q12) | Slices 3, 6, 7 | ✅ → [D42](./decisions-d42-d47.md#d42) |
| [Q13](./questions-closed-q9-q16.md#q13) | Slice 3 | ✅ → [D43](./decisions-d42-d47.md#d43) |
| [Q14](./questions-closed-q9-q16.md#q14) | Slices 1, 6, 7 | ✅ → [D48](./decisions-d48-d52.md#d48) |
| [Q15](./questions-closed-q9-q16.md#q15) | Slice 1 | ✅ → [D46](./decisions-d42-d47.md#d46) |
| [Q16](./questions-closed-q9-q16.md#q16) | Slice 1 | ✅ → [D45](./decisions-d42-d47.md#d45) |
| [**Q17**](#q17) | Slices 6, 7 | **open** |

---

<a id="q17"></a>
## Q17 — How does the HTML in a portfolio `description` render?

**Raised:** 2026-09-21 · **Blocks:** Slices 6 and 7 · **From:** [D53](./decisions-d53.md#d53)

Every ported item's `description` is an **HTML string**, not plain text:

```html
<p>As a personal challenge, I designed and built …
   <a href="https://github.com/…" target="_blank">Github mfe branch</a>.</p>
<p>The tech stack includes:</p>
<ul><li>React</li><li>React Native/Expo</li>…</ul>
```

Paragraphs, lists, and external links with `target="_blank"`. The v3 site rendered these
with `dangerouslySetInnerHTML`. Three ways forward:

1. **Keep the HTML, render it with `dangerouslySetInnerHTML`.** Cheapest, and it is the
   maintainer's own content in the maintainer's own repo, so the injection risk today is
   nil. ⚠️ But the Contentful plan makes this field **editor-supplied**, and at that point
   the same component is rendering third-party HTML — so the decision outlives the fixture.
2. **Keep the HTML and sanitize it** on the way in. Costs a dependency and a little size in
   a federated remote; survives the Contentful transition unchanged.
3. **Convert to structured data now** — `paragraphs: string[]`, `bullets: string[]`,
   `links: {href, label}[]` — and render it as components. Most work up front, no HTML in
   the payload at all, and the cleanest thing to map Contentful's rich text onto later.

⚠️ Note `target="_blank"` without `rel="noopener noreferrer"` appears throughout the ported
copy. Whichever option is taken, that gets fixed in the port rather than carried over.

**Not urgent for Slice 1**, which ships only route metadata. It blocks the first slice that
renders an item body.
