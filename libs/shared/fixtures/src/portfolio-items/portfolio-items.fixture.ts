import type { PortfolioItem } from '@portfolio/shared-types';

import { ACTIVE_PORTFOLIO_ITEMS } from './portfolio-items-active.fixture.js';
import { CORPORATE_REPORTS_PORTFOLIO_ITEMS } from './portfolio-items-corporate-reports.fixture.js';
import { CRICKET_PORTFOLIO_ITEMS } from './portfolio-items-cricket.fixture.js';
import { OTHER_PORTFOLIO_ITEMS } from './portfolio-items-other.fixture.js';
import { OTHER_CLIENT_PORTFOLIO_ITEMS } from './portfolio-items-other-clients.fixture.js';
import { UPCOMING_PORTFOLIO_ITEMS } from './portfolio-items-upcoming.fixture.js';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** Created by the coordinator in Slice 4
 * as the named landing spot for the portfolio data, so Slice 6 and Slice 7 —
 * concurrent agents co-owning this package — never open the same file.
 * Slice 6 must not add to this module.
 *
 * ⚠️ **The EIGHT live items** ported from v3's `src/store/{active,other}.data.ts`
 * at commit `39bbe56` (D53) — not the nine that decision, this banner's earlier
 * text and the slice file all name. `cosmikata-design-system` is commented out
 * in its entirety in `active.data.ts`, so it is deliberately unpublished and
 * resolves to a shell-level not-found (D66) rather than being re-enabled here.
 * Their `id`s are this route's slugs, unchanged. The data
 * itself lives in **five** sibling modules purely to stay under the 200-line
 * source cap — three until Slice 11, which added the redesign's six fields per
 * item and split `cw-breeze-thru` and `cr-caterpillar` into client modules of
 * their own. ⚠️ **The spread order below is unchanged and is load-bearing**: it
 * is v3's reading order and it is the listing order, so the five arrays are
 * interleaved to reproduce it exactly rather than concatenated by module.
 *
 * ⚠️ **`undefined` from `portfolioItemBySlug` means "no such item", never
 * "failed to load".** The shell renders a not-found for the first and the
 * remote's fallback for the second; collapsing them tells a visitor the site is
 * broken when they typed a bad URL.
 */
export const PORTFOLIO_ITEMS: readonly PortfolioItem[] = [
  ...UPCOMING_PORTFOLIO_ITEMS, // micro-frontend-update, prototype-company-division — placeholders
  ...ACTIVE_PORTFOLIO_ITEMS, // pokemon-pet-shop, cosmikata
  ...OTHER_PORTFOLIO_ITEMS, // older-cosmikata, csp-generator-app
  ...CRICKET_PORTFOLIO_ITEMS, // cw-breeze-thru
  ...OTHER_CLIENT_PORTFOLIO_ITEMS, // rove-logix, rove-logix-ui-update
  ...CORPORATE_REPORTS_PORTFOLIO_ITEMS, // cr-caterpillar
];

export const portfolioItemBySlug = (slug: string): PortfolioItem | undefined =>
  PORTFOLIO_ITEMS.find((item) => item.slug === slug);
