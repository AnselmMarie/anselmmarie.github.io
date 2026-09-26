# `@portfolio/header` — the Header remote

```bash
pnpm nx dev header
```

Serves the Header standalone at **http://localhost:4174**, with `strictPort`, and publishes
`remoteEntry.js` there for the shell to load.

Unlike the other three remotes this one is **real**, not a placeholder — it was built by
[Slice 3](../../docs/planning/mfe-architecture/slices/03-federation-header.md) and its
`vite.config.ts` is the file the other three were copied from.

## Why the port is not negotiable

The shell resolves this remote at `http://localhost:4174/remoteEntry.js` — see
`DEFAULT_HEADER_ORIGIN` in `libs/shared/config`. `strictPort: true` is what makes a conflict
fail loudly instead of silently reassigning the port, which would leave the shell pointing
at nothing and the only symptom would be the header fallback rendering forever.

Override for a deployed origin with `PORTFOLIO_HEADER_ORIGIN`
([D42](../../docs/planning/mfe-architecture/decisions-d42-d47.md#d42)).

⚠️ **If you get `Port 4174 is already in use`, something else is serving this remote** — most
often a dev server left running by an earlier session. `lsof -nP -iTCP:4174 -sTCP:LISTEN`
names the process.

## What is invented here

⚠️ **The v3 site has no header at all** ([D59](../../docs/planning/mfe-architecture/decisions-d58-d62.md#d59)).
The bar's visual treatment is ours; the brand text and the nav labels are v3's real hero
heading and section headings. The section `id`s behind those labels are a three-way contract
with the Homepage remote and the shell's header fallback — they live in `SITE_SECTIONS` in
`@portfolio/shared-fixtures` ([D63](../../docs/planning/mfe-architecture/decisions-d63-d67.md#d63))
because a rename that only two of the three follow fails **silently**.

## All five servers

`.claude/launch.json` carries every app. The composed page needs the shell plus whichever
remotes you want live — any remote that is down renders its shell-owned fallback instead,
which is [Slice 4](../../docs/planning/mfe-architecture/slices/04-error-boundaries.md)
working rather than a defect.

| App | Port |
|---|---|
| shell | 3000 |
| header | 4174 |
| footer | 4175 |
| homepage | 4176 |
| portfolio-item | 4177 |
