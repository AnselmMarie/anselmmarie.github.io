# Open Questions

Every unanswered question lives here, with the slice it blocks. A question is
never raised inside a slice's prose and left there — that is how a discussion
gets lost.

When one is answered: write the answer as a numbered decision in
[decisions.md](./decisions.md), move the entry to
[questions-closed.md](./questions-closed.md) with a closure note, update the
table below, and update the binding block of every slice that named it. All
four, in the same change.

**One is open: [Q22](#q22).** The four raised on 2026-09-22 by reading the two design
exports ([D76](./decisions-d76-d81.md#d76)) all closed that same day.

| Q | Blocked | Status |
|---|---|---|
| [Q22](#q22) | Slice 17 — its whole scope | ⏳ **open**, raised 2026-09-23 |
| [Q18](./questions-closed-q18-q21.md#q18) | Slices 11, 13, 15 — the hero images | ✅ closed → [D85](./decisions-d85-d87.md#d85) |
| [Q19](./questions-closed-q18-q21.md#q19) | Slice 15 — the gallery contents | ✅ closed → [D86](./decisions-d85-d87.md#d86) |
| [Q20](./questions-closed-q9-q16.md#q20) | *(was Slice 10 — font delivery)* | ✅ closed → [D82](./decisions-d82-d83.md#d82) |
| [Q21](./questions-closed-q18-q21.md#q21) | Slices 11, 13, 14 — one figure | ✅ closed → [D87](./decisions-d85-d87.md#d87) |

⚠️ **Slices 11–16 still have no blocked field.** A slice that finds one raises it here
rather than deciding it alone.

<a id="q22"></a>
### Q22 — which UI and navigation issues does Slice 17 fix?

**Raised 2026-09-23 by the maintainer**, after Slices 10–14 landed: *"there are still a
good amount of UI/navigation issues that need to be dealt with."* That is the whole of
Slice 17's scope ([D102](./decisions-d101-d102.md#d102)), and the list hasn't been written
down yet.

**Blocks:** Slice 17 entirely. Slice 9 indirectly, since it runs after 17.

**What an answer needs, per issue:** the surface (route + viewport), what happens, what
should happen, and whether the design shows the right answer or it's a new decision.

**What not to do:** audit the site and treat the findings as the list. An audit can
*propose* additions for the maintainer to accept. The list itself is the maintainer's.

---

## Closed

All twenty-one questions are closed, full text and closure notes intact, across three
files: [questions-closed.md](./questions-closed.md) (Q1–Q8),
[questions-closed-q9-q16.md](./questions-closed-q9-q16.md) (Q9–Q17, plus Q20), and
[questions-closed-q18-q21.md](./questions-closed-q18-q21.md) (Q18, Q19, Q21). ⚠️ **Both
splits were forced by the 500-line cap** in
[plan-split-into-files.md](../../../.claude/rules/plan-split-into-files.md) — the first at
548 lines on 2026-09-20, the second on 2026-09-22 when these three would have taken the
second file to ~558. Nothing was dropped or reworded in either cut, and ⚠️ **neither
filename records its range** — links already written to them keep resolving, which is why.

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
| [Q18](./questions-closed-q18-q21.md#q18) | Slices 11, 13, 15 | ✅ → [D85](./decisions-d85-d87.md#d85) |
| [Q19](./questions-closed-q18-q21.md#q19) | Slice 15 | ✅ → [D86](./decisions-d85-d87.md#d86) |
| [Q20](./questions-closed-q9-q16.md#q20) | Slice 10 | ✅ → [D82](./decisions-d82-d83.md#d82) |
| [Q21](./questions-closed-q18-q21.md#q21) | Slices 11, 13, 14 | ✅ → [D87](./decisions-d85-d87.md#d87) |
