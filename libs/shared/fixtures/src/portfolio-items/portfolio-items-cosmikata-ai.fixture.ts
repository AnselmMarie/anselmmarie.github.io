import type { ItemAiEnhancement } from '@portfolio/shared-types';

/**
 * Cosmikata's `| AI Enhancements` section (maintainer, 2026-10-19). Split out
 * of `portfolio-items-active.fixture.ts` to keep that file under the 200-line
 * cap. Each card is problem → built → result, ordered strongest first.
 *
 * ⚠️ **Read off the Cosmikata repo on 2026-10-19, not invented.** Sources:
 * - Event agent: `docs/planning/_2026-2/event-agent-mcp/` (D4, the caps; the
 *   ~$1/month figure is that README's estimate, not a measurement) and
 *   `.claude/agents/event-agent.md` (the 2026-10-13 Haiku/Sonnet comparison).
 * - Release: the `release`, `release-checklist` and `prod-check` skills and
 *   `tools/scripts/release/`.
 * - Tokens: `libs/ui/ds-tokens/README.md` and commits `9219636`, `c876b4d`
 *   ("Theme CSS is byte-identical").
 * - Workflow: `.claude/` on 2026-10-19: 32 rules, 23 skills, 12 agents,
 *   12 prompt templates in `prompts/` and 2 HTML report templates in
 *   `templates/` (the prod-check one was still uncommitted in Cosmikata that
 *   day).
 *
 * The two `planned` cards (free-first content assist, the shared AI
 * foundation) were hidden by the maintainer on 2026-10-19 until their plans
 * ship; they are in git history.
 */
export const COSMIKATA_AI_ENHANCEMENTS: readonly ItemAiEnhancement[] = [
  {
    title: 'Event agent over MCP',
    problem:
      'Convention listings were added by hand, one event at a time, and the same convention kept turning up twice under slightly different names or dates.',
    built:
      'A Model Context Protocol server that lets an agent read convention schedules and official sites, check each event against existing listings, and file new ones as verification requests from a locked-down bot account. It is capped at 10 requests per run, 20 per day and 25 open.',
    result:
      'In a side-by-side test, Haiku made the same duplicate calls as Sonnet at about a twentieth of the cost, putting a daily run at an estimated $1 a month. An admin approves every request before it reaches the app.',
    status: 'shipped',
  },
  {
    title: 'Release skill with a production gate',
    problem:
      'Five deployable apps each carry their own version, and every release meant hand-writing changelogs and announcements and judging by eye what was safe to ship.',
    built:
      'A release skill, backed by rules and templates, that bumps each app’s semantic version from its commits, writes the per-app changelogs, and drafts the public What’s New entry and announcement. Work behind a feature flag that is off in production bumps nothing.',
    result:
      'The deploy checklist can’t be built until a production check comes back clear. CI rejects any version that skips a step and tags each app after it deploys.',
    status: 'shipped',
  },
  {
    title: 'Figma tokens plugin, built with AI',
    problem:
      'Design tokens reached the code through a third-party export and hand-written clean-up scripts, across two brands in light and dark.',
    built:
      'An internal Figma plugin, built with AI, that validates the design variables and exports them as W3C design-token files into the repo. Receiving them triggers a Style Dictionary build of the theme stylesheets and constants every Cosmikata app imports.',
    result:
      'The switch-over produced byte-identical theme CSS and replaced the old clean-up scripts. CI fails any change where the built styles and the tokens disagree.',
    status: 'shipped',
  },
  {
    title: 'Guardrailed AI development',
    problem:
      'AI writes code quickly, but left alone it drifts from a codebase’s conventions and reports work as done before it has been checked.',
    built:
      '32 project rules, 23 reusable skills, 12 specialised agents and 14 templates (12 prompt templates for jobs like code review, test writing and release notes, plus 2 report templates for the deploy pass and the production check) that encode the codebase’s conventions and split plans into reviewable slices.',
    result:
      'Every change runs typecheck, lint and tests before it is reported done, and nothing is committed without review.',
    status: 'shipped',
  },
];
