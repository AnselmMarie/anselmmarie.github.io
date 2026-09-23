# Slice 17 — The remaining UI and navigation issues

**Status:** ⛔ blocked on [Q22](../open-questions.md#q22) · **Visible?** ✅ screen ·
**Depends on:** Slices 15, 16 (placement proposed, see [D102](../decisions-d101-d102.md#d102))
**Design:** [both exports](../design-sources.md) — drawn ✅ for the surfaces they cover.
Per issue, the table below records whether the design shows the answer.

A clean-up slice for the redesigned site, running after the last redesign slice and before
the E2E suite that would otherwise lock the current behaviour in.

## Decisions that bind this slice

- **[D102](../decisions-d101-d102.md#d102)** — this slice exists, and its scope is the
  maintainer's issue list, not an audit.
- **[D101](../decisions-d101-d102.md#d101)** — Slice 9 runs after this one, so every
  navigation behaviour fixed here is one Slice 9 asserts.
- **[D81](../decisions-d76-d81.md#d81)** / **[D96](../decisions-d88-d100.md#d96)** — the
  anchor contract: five anchors, `SITE_SECTIONS` built from `SECTION_IDS`, never a literal.
  A navigation fix that touches an anchor goes through that contract.
- **[D100](../decisions-d88-d100.md#d100)** — the anchor offset is verified in the browser,
  four anchors at 84px. ⚠️ **Re-run that check after any fix that touches the header,
  a section's spacing or `--spacing-anchor`.** Specs don't measure it.
- **[D84](../decisions-d82-d83.md#d84)** / **[D94](../decisions-d88-d100.md#d94)** — the
  nav bar is flush and full-bleed, and the menu control is a `<button>` with its 44px tap
  target pulled out of the 56px row. Don't undo either as a side effect.
- **[D95](../decisions-d88-d100.md#d95)** — the header variant is checked at the shell, not
  the region. A fix to the detail page's `← All work` bar needs its spec there.

## Open questions blocking this slice

- **[Q22](../open-questions.md#q22)** — the issue list. Blocks the whole slice.
  → [open-questions.md](../open-questions.md#q22)

## The issues

⚠️ **Empty until Q22 is answered.** One row per issue, filled from the maintainer's list:

| # | Surface (route · viewport) | What happens | What should happen | Design shows it? | Owner project |
|---|---|---|---|---|---|
| — | | | | | |

The **Owner project** column is what makes this slice plannable. An issue in
`libs/features/header` and an issue in `libs/features/homepage` are in different remotes
and could be split across agents. An issue in `libs/ui/theme`, `libs/ui/components` or the
shell is closed to wave agents ([parallelization.md](../parallelization.md)) and is the
coordinator's.

## Files this slice creates and modifies

Unknown until the table is filled. Record them per issue, in section folders per the
lib section-folder rule. Every fix ships with a spec
([no-deferred-specs.md](../../../../.claude/rules/no-deferred-specs.md)). A spec for a
navigation fix is **seen failing** first
([prove-the-spec-can-fail.md](../../../../.claude/rules/prove-the-spec-can-fail.md)).

Estimated: **unknown**, pending Q22. If the list lands past ~40 files, split the slice by
owner project rather than by issue.

## Gates

```bash
pnpm nx run-many -t typecheck lint test --projects=<the owner projects from the table>
```

Then in the composed app, for every row: the surface at the named viewport, before and
after, with a screenshot of each. And the [D100](../decisions-d88-d100.md#d100) anchor
check, whatever the list contains.

## Notes for whoever builds this

- **An issue the design answers is a bug. An issue it doesn't is a decision.** Write the
  second kind up as a numbered decision before building it, not in the completion report.
- Keep the table as the report. Mark each row `fixed` / `not reproducible` / `moved`,
  and name the spec that covers it.
