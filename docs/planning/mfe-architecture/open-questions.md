# Open Questions

Every unanswered question lives here, with the slice it blocks. A question is never raised
inside a slice's prose and left there — that is how a discussion gets lost.

When one is answered: write the answer as a numbered decision in
[decisions.md](./decisions.md), move the entry to
[questions-closed.md](./questions-closed.md) with a closure note, update the table below,
and update the binding block of every slice that named it. All four, in the same change.

**None are open.** [Q17](./questions-closed-q9-q16.md#q17) — the last one — closed on
2026-09-21 as [D69](./decisions-d69.md#d69): a portfolio `description` stays an HTML string
and is sanitized with `dompurify` at the render boundary. Its full entry and closure note
moved to [questions-closed-q9-q16.md](./questions-closed-q9-q16.md#q17).

⚠️ **An empty file is a state, not an invitation.** Slices 8 and 9 have not been built, and
a question they raise belongs here rather than inside a slice's prose — that is the burial
this file exists to prevent.

[Q2](./questions-closed.md#q2) — the spike gate Slice 3 answered by building rather than
deciding — **closed on 2026-09-21** as [D55](./decisions-d55.md#d55): all four checks
passed, and the configuration it proved is recorded there. Its full entry moved to
[questions-closed.md](./questions-closed.md#q2) with its closure note.
[Q14](./questions-closed-q9-q16.md#q14) closed on 2026-09-20 as
[D48](./decisions-d48-d52.md#d48), which is what unblocked the route tree in Slice 1.

All seventeen — fifteen closed on 2026-09-20, plus Q2 and Q17 on 2026-09-21 — live in
[questions-closed.md](./questions-closed.md) and its second half, full text and closure
notes intact. ⚠️ **This
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
| [Q17](./questions-closed-q9-q16.md#q17) | Slice 7 (⚠️ raised as "6, 7") | ✅ → [D69](./decisions-d69.md#d69) |
