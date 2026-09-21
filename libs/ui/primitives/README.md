# `@portfolio/ui-primitives`

This package holds shadcn/ui CLI output only ([D25](../../../docs/planning/mfe-architecture/decisions-d17-d32.md#d25)).

## Do not hand-edit anything in this package

`components.json` aliases the shadcn CLI to write only into this directory. If
a primitive needs different behavior, a new prop, or a different default,
**write a wrapper in `libs/ui/components` instead** — never edit the
generated file here. Hand-editing breaks the one thing this split buys:
`shadcn add` stays re-runnable, and generated code stays identifiable by path.

Add primitives on demand only, when an actual consumer needs one
([D40](../../../docs/planning/mfe-architecture/decisions-d33-d41.md#d40)) — never
speculatively.
