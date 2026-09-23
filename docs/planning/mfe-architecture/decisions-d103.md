# Decision D103

<a id="d103"></a>
## D103 — the specs strip reads `13+ years shipping`; supersedes D87's strip figure

**Maintainer's call, 2026-09-23.** The strip above the hero goes back to the
design's own `13+ years shipping`. [D87](./decisions-d85-d87.md#d87) had
corrected it to `15+`, reading 2011 → 2026 off the oldest Experience row.

**What changes and what doesn't.**

| Where | Before | After |
|---|---|---|
| the specs strip | `15+ years shipping` (D87) | `13+ years shipping` |
| the About stats card | `13+` · `Years in lead & architect roles` | unchanged |

⚠️ **The two figures now show the same number.** D87's point was that they
measure different things. They still do, but both now count from 2013, the
Cricket Manager row. Neither overstates the Experience list, whose oldest row
is still 2011. The strip just no longer counts the two Corporate Reports years.

**Binds:** `libs/shared/fixtures/src/homepage/homepage.fixture.ts` (`specs`),
and the specs that assert the figure, `homepage.fixture.spec.ts` and
`libs/features/homepage/src/homepage/homepage.spec.tsx`.
