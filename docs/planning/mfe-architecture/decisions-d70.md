# Decision D70 — the v3 site has no footer either

<a id="d70"></a>**D70 — v3 has no footer, so Slice 5's footer is invented; only the two
social URLs are ported.** Found while building Slice 5, 2026-09-21.

[D34](./decisions-d33-d41.md#d34) made the live v3 site the design source, and the README's
design table read **`Footer | live v3 site | ✅ exists`**. ⚠️ **That row was wrong.**

Verified against `39bbe56`:

```bash
git grep -il footer 39bbe56 -- src     # no matches, at all
git grep -n  "<footer" 39bbe56 -- src  # no matches
```

Not "a footer that is hard to find" — the string `footer` does not appear anywhere in v3's
`src`, in any case, and there is no `<footer>` element in `layout.tsx`, `page.tsx`, or any
route view.

## ⚠️ This is the second time this table has been wrong the same way

[D59](./decisions-d58-d62.md#d59) recorded exactly this for the **Header** on the same day:
the row said `✅ exists`, v3 had no header, and it was found only when a slice went to build
it. Two rows out of six, both discovered by the agent that had to build the thing, both
after the plan had been reviewed. **The table was recording what a portfolio site is
generally assumed to have, not what was checked.**

So the finding is not really "v3 has no footer" — it is that **`✅ exists` in that table was
never evidence.** The remaining rows (Homepage, Portfolio Item, Shell layout) *were*
verified by Slices 1 and 6/7 reading the actual v3 source, so they stand. But a future plan
does not get to write `✅ exists` in a design table without a command that proves it.

## What was ported and what was invented

Slice 5 built the footer rather than stalling the wave — the same call Slice 3 made for the
header — and flagged it control by control per
[plan-design-links.md](../../../.claude/rules/plan-design-links.md):

| Element | Source |
|---|---|
| The two URLs (LinkedIn, GitHub) | ✅ **real v3 content**, ported verbatim from the hero section — the only place v3 links out |
| `target="_blank"` + `rel` | ✅ **real v3**, ported verbatim |
| Putting those links in a footer at all | **invented** |
| The `© {year} Anselm Marie` line | **invented** (inherited from Slice 4's placeholder and fallback) |
| The left/right split layout | **invented** |

## ⚠️ Open divergence for the maintainer: text labels, not icons

v3 renders those two links as **Radix icons** (`GitHubLogoIcon`, `LinkedInLogoIcon`) at
30×30 in slate-800. Slice 5 renders **text labels**, because there is no icon dependency in
this workspace and a wave agent may not add one
([plan-parallelization.md](../../../.claude/rules/plan-parallelization.md) — manifest work is
solo).

**This is a real divergence from ported content, not a simplification of invented content**,
which is why it is recorded here rather than waved through. It wants a maintainer decision:
add an icon library and match v3, keep text labels, or inline two SVGs. Nothing is blocked
on it — the footer renders and the links work either way.

## The cost of keeping the fallback, stated

Slice 5 kept Slice 4's `FooterFallback` rather than taking the architecture doc's option of
omitting the footer entirely on failure, because an omitted footer collapses the shell's
footer region to an empty bordered strip that reads as a layout bug rather than a degraded
region.

⚠️ **The consequence is that the fallback and the real footer are now near-identical to the
eye** — the fallback carries the same copyright line, so a failed footer loses only the two
links. The `footer-remote` / `mfe-fallback-footer` testid split is the only thing separating
them, so **[Slice 9](./slices/09-e2e-composition.md)'s failure-isolation assertions must key
on the testid, never on visible text.** An E2E that asserts "the copyright is present"
passes whether or not the footer remote is up, which is the
[prove-the-spec-can-fail](../../../.claude/rules/prove-the-spec-can-fail.md) failure in E2E
form.
