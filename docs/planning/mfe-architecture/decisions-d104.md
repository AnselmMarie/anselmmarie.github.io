# Decision D104

<a id="d104"></a>
## D104 — Slices 16 and 17 are done; Q22 closes without a written issue list

**Maintainer's call, 2026-09-23:** *"17 is done / 16 should be done."* Both slices are
marked done on that word. The next slice is [9](./slices/09-e2e-composition.md).

**Slice 17.** The fixes were made and merged without the issue list ever being written
down, so [Q22](./questions-closed-q18-q21.md#q22) closes as *answered by the work*
instead of by a list. ⚠️ **Nobody recorded which PR carried the fixes.** PR #47
(`8aba011`, "enhancements fixes") is the likeliest: it moved the header nav onto shadcn
`NavigationMenu`, moved Experience onto shadcn `Accordion`, and added loading skeletons.
Slice 17's issue table stays empty rather than being filled in after the fact. Per
[Q22](./questions-closed-q18-q21.md#q22), rebuilding the list from an audit would be
guessing which issues the maintainer meant.

**Slice 16.** The strip merged in PR #45 (`ab5c139`). The slice's two manual checks were
never recorded as run: the footer up on `/portfolio/<slug>`, and the footer **down** on
both pages. The second is the slice's reason for existing, and no spec asserts it.

**What this hands Slice 9.** [D102](./decisions-d101-d102.md#d102) put Slice 17 first so
the E2E suite asserts the fixed navigation. That still holds, but with no issue list,
Slice 9 has nothing to check the fixes against. Its specs assert what the site does now.
⚠️ **The footer-down check has also moved into Slice 9.** Its failure-isolation specs are
now the first thing that will look at the page with the footer stopped. A computed-style
or visual assertion on the footer fallback there covers what Slice 16 left open.

**Binds:** [slices/16-footer-strip.md](./slices/16-footer-strip.md),
[slices/17-ui-navigation-fixes.md](./slices/17-ui-navigation-fixes.md),
[slices/09-e2e-composition.md](./slices/09-e2e-composition.md).
