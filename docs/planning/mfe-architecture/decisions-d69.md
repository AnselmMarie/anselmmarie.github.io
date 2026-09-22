# Decision D69 — how the ported HTML descriptions render

<a id="d69"></a>**D69 — a portfolio `description` stays an HTML string and is sanitized on
render, with `dompurify`.** Maintainer's call, 2026-09-21, closing
[Q17](./questions-closed-q9-q16.md#q17) — the plan's last open question.

Every item ported under [D53](./decisions-d53.md#d53) carries its body as an HTML string:
paragraphs, unordered lists, and external links. Q17 offered three ways to render it. The
answer is **option 2 — keep the HTML, sanitize it on the way in.**

## What was chosen over

- **Raw `dangerouslySetInnerHTML`**, which is what v3 did, was declined **not** because the
  fixture is dangerous — it is the maintainer's own copy in the maintainer's own repo, and
  the injection risk today is nil. It was declined because **the component outlives the
  fixture**. The Contentful plan makes `description` editor-supplied, and at that moment the
  same component is rendering third-party HTML with no change to its code and no prompt to
  revisit it. Sanitizing now is the cheaper half of a decision that has to be made anyway.
- **Converting to structured data** (`paragraphs` / `bullets` / `links`) was declined on
  cost and on loss. It is the cleanest target for Contentful's rich text, but it means
  hand-converting nine items' bodies today, every conversion is a judgement call, and the
  result still has to be re-mapped when the real rich-text shape arrives. If the Contentful
  plan wants structured data, it can convert from HTML then with the real target in view.

## What this settles, concretely

1. **The type.** `PortfolioItem.description` is a `string` holding HTML. Slice 7 adds the
   field to `libs/shared/types/src/portfolio-item.ts` — the module it owns — and its doc
   comment says the string is HTML and is sanitized at the render boundary, so nobody
   downstream reads it as plain text.
2. **The library is `dompurify`**, and ⚠️ **the coordinator installs it, not Slice 7.**
   Adding a dependency mutates `pnpm-lock.yaml` and the feature lib's `package.json`, which
   [plan-parallelization.md](../../../.claude/rules/plan-parallelization.md) pulls out of a
   parallel slice unconditionally — three worktrees racing one lockfile is the failure that
   rule exists to prevent. It is declared on `@portfolio/feature-portfolio-item` only; no
   other remote renders HTML.
3. **Sanitizing is client-side, and that is not a shortcut.** Under
   [D36](./decisions-d33-d41.md#d36) the item body is client-rendered by the remote and never
   reaches the SSR HTML, so the browser build is the only place the body is ever turned into
   DOM. The feature libs' Vitest environment is `jsdom`, so the specs exercise the real
   sanitizer rather than a stub.
4. **The route's `head` description is a different field and is not this one.** Per
   [D48](./decisions-d48-d52.md#d48) the server-rendered metadata comes from
   `route-metadata.fixture.ts` as authored plain text. ⚠️ **Do not derive the meta
   description by stripping tags from this HTML** — that runs the sanitizer server-side for
   no reason and produces meta copy nobody wrote.
5. **`target="_blank"` gets `rel="noopener noreferrer"` in the port.** The ported copy has
   the first without the second throughout. Q17 required this under any of its three
   options; sanitizing makes it enforceable rather than a thing to remember, so configure
   the sanitizer to add the `rel` and **assert it in a spec** — one of the nine bodies with
   a link, rendered, with the attribute checked.

## What it does not settle

The sanitizer's allow-list. Slice 7 chooses it from what the nine bodies actually contain
(`p`, `ul`, `li`, `a[href][target][rel]`, and whatever else the port turns up) and records
the list in its completion report. A default-everything configuration passes every spec here
and is not what this decision asked for.
