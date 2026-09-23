import type { HomepageContent, PortfolioItem } from '@portfolio/shared-types';

import { HOMEPAGE_CONTENT } from '../homepage/homepage.fixture.js';
import {
  PORTFOLIO_ITEMS,
  portfolioItemBySlug,
} from '../portfolio-items/portfolio-items.fixture.js';

/**
 * 🧭 **OWNER: the coordinator (Slice 4). Slices 5, 6 and 7 read it and must not
 * edit it.**
 *
 * The single seam between the site's content and the remotes that render it
 * (D15, D22). It lives in `@portfolio/shared-fixtures` rather than in either
 * feature lib because two scopes read it, and
 * `@nx/enforce-module-boundaries` would reject a hook owned by `scope:homepage`
 * being imported from `scope:portfolio-item`.
 *
 * ⚠️ **One seam, not six — that is the entire value of the arrangement.** Slice
 * 1 of the Contentful plan replaces the bodies below with server-function reads
 * and changes nothing else. A section that imports a fixture module directly
 * has broken the seam, and the Contentful plan pays for it in refactoring.
 *
 * ⚠️ **These are hooks in name and position, not yet in behaviour.** They call
 * no React hook today because fixtures need no state. The names and signatures
 * are what the real implementations will have, so the swap is a body change
 * rather than a call-site change — which is why every consumer must call them
 * from a component, under the rules of hooks, from the first line of code
 * written against them.
 */

/** The homepage's content. Slice 6 fills the fixture behind this. */
export const useHomepageContent = (): HomepageContent => HOMEPAGE_CONTENT;

/** Every portfolio item, for the homepage listing. Slice 7 fills the fixture. */
export const usePortfolioItems = (): readonly PortfolioItem[] => PORTFOLIO_ITEMS;

/**
 * One portfolio item by slug, for `/portfolio/$slug`.
 *
 * ⚠️ **`undefined` means "no such item", not "failed to load".** The route
 * renders a shell-level not-found for the first and the remote's fallback for
 * the second; collapsing the two would tell a visitor to retry something that
 * will never succeed.
 */
export const usePortfolioItem = (slug: string): PortfolioItem | undefined =>
  portfolioItemBySlug(slug);
