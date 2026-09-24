# Decision D105

<a id="d105"></a>
## D105 — the E2E stack runs on its own ports, and the style checks target lib-only utilities

**Made while building Slice 9, 2026-09-23.** All three points were found by running the
suite, not by reading the plan.

**1. The E2E stack does not use the dev ports.** The first run passed against `vite dev`.
Dev servers were already running on 3000 and 4175–4177, and Playwright's
`reuseExistingServer` picked them up silently. The only sign was `[vite] connecting...`
in the browser console. So the stack runs on **3100** (shell) and **4274–4277**
(remotes). The shell bakes remote origins in at build time (the D12 note in
`apps/shell/vite.config.ts`), so `pnpm e2e:build` passes them as the
`PORTFOLIO_*_ORIGIN` variables. It runs with `--skip-nx-cache`, because Nx doesn't hash
environment variables and would otherwise replay a build made with the dev origins. One
table in `tools/scripts/e2e-stack.mjs` feeds both the build and `playwright.config.ts`.
⚠️ `pnpm e2e:build` overwrites each app's `dist/` and the shell's `.output/`, which are
gitignored, with builds that point at the E2E ports.

**2. Inside the composed site, R3 lives in the shell's stylesheet.** A remote's own
`styles.css` is for standalone use only. Composed, every remote is styled by the shell's
CSS, which is where `libs/ui/theme`'s `@source` lines count. Deleting a remote's
`@source` line and rebuilding **only that remote** changes nothing on the composed page.
The line has to go and **the shell** has to be rebuilt.

**3. A style check that uses generic utilities cannot catch R3.** The theme `@source`s
every feature lib into one stylesheet. A generic utility (`grid`, `rounded-full`,
`font-mono`) therefore survives a missing line whenever any other lib uses it. The first
draft of the style spec stayed green with the footer's line deleted. Each remote is now
checked on an arbitrary-value class found in **exactly one** feature lib. With all four
lines deleted and the shell rebuilt, all four checks went red. One of those was weak at
first: "line-height is not `normal`" passed unstyled, because preflight gives everything
`line-height: 1.5`. It now asserts the 0.95 ratio.

**Binds:** [slices/09-e2e-composition.md](./slices/09-e2e-composition.md),
`playwright.config.ts`, `tools/scripts/e2e-stack.mjs`,
`e2e/design-system-styles.spec.ts`.
