# `@portfolio/footer` — runnable scaffold

```bash
pnpm nx dev footer
```

Serves this remote standalone at **http://localhost:4175**, with `strictPort`, and
publishes `remoteEntry.js` there for the shell to load.

⚠️ **What it renders is a placeholder.**
[Slice 5](../../docs/planning/mfe-architecture/slices/05-footer-mfe.md) replaces the body of
`libs/features/footer/src/footer/footer.tsx` with the real footer. Everything *around*
that component is finished and should not need rewriting: the federation config, the
`exposes` map, the registry row, the shell's mount and its error boundary all work today.

## Why the port is not negotiable

The shell resolves this remote at `http://localhost:4175/remoteEntry.js` — see
`DEFAULT_FOOTER_ORIGIN` in `libs/shared/config`. `strictPort: true` in `vite.config.ts` is what
makes a conflict fail loudly instead of silently reassigning the port, which would leave the
shell pointing at nothing and the only symptom would be this remote's fallback rendering
forever.

Override for a deployed origin with `PORTFOLIO_FOOTER_ORIGIN`
([D42](../../docs/planning/mfe-architecture/decisions-d42-d47.md#d42)). Slice 8 supplies the
real value.

## History worth knowing

Slice 4 first scaffolded this app with `dev` / `build` / `preview` targets and **no**
`vite.config.ts`. `nx dev footer` then started Vite on its defaults: no `index.html`, a
**random free port** instead of 4175, a printed URL, and **exit 0** — a target that looked
like it worked and served nothing. The targets were briefly removed, and then the config was
written properly, which is the state you see here.

## What Slice 5 changes

- `libs/features/footer/src/footer/footer.tsx` — the real component, in place of the placeholder.
- Its spec, including deleting the `"Slice 5 fills this"` assertion, which is there
  precisely so the placeholder cannot ship unnoticed.
- Nothing in this directory, most likely.
