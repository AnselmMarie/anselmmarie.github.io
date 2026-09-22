import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** Created by the coordinator in Slice 4
 * as the named landing spot for the portfolio data, so Slice 6 and Slice 7 —
 * concurrent agents co-owning this package — never open the same file.
 * Slice 6 must not add to this module.
 *
 * ⚠️ **Empty on purpose, and it is the honest state.** Slice 7 ports the nine
 * items from v3's `src/store/{active,other}.data.ts` at commit `39bbe56`
 * (D53), whose `id`s are this route's slugs: `pokemon-pet-shop`, `cosmikata`,
 * `cosmikata-design-system`, `older-cosmikata`, `csp-generator-app`,
 * `cw-breeze-thru`, `rove-logix`, `rove-logix-ui-update`, `cr-caterpillar`.
 *
 * Until then every `/portfolio/<slug>` is a shell-level not-found — which is a
 * *different* state from a failed remote and must not collapse into the same
 * UI.
 */
export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [];

export const portfolioItemBySlug = (slug: string): PortfolioItem | undefined =>
  PORTFOLIO_ITEMS.find((item) => item.slug === slug);
