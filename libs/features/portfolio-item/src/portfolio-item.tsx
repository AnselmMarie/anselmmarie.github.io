import type { ReactElement } from 'react';

import type { PortfolioItem as PortfolioItemModel } from '@portfolio/shared-types';

interface PortfolioItemProps {
  /**
   * D4 / D15 — the shell resolves the slug and hands over the item. This
   * remote does no routing and never reads `params`.
   */
  item?: PortfolioItemModel;
}

/**
 * 🧭 **OWNER: Slice 7. This is a placeholder — replace the body, keep the file.**
 *
 * Scaffolded by Slice 4 so the remote is runnable end to end: `nx dev
 * portfolio-item` serves it standalone on 4177, and the shell loads it over
 * Module Federation at `/portfolio/$slug`. Slice 7 ports the real item page
 * from commit `39bbe56` (D53).
 *
 * ⚠️ **`item` is optional here only because `PORTFOLIO_ITEMS` is still empty.**
 * Once Slice 7 ports the nine items, the shell always resolves one before
 * mounting this remote — an unresolvable slug is a shell-level not-found (D66),
 * which never reaches this component. Slice 7 should make the prop required and
 * delete the branch below.
 *
 * ⚠️ **Q17 is still open and blocks the real body.** The item's content *is*
 * the ported `description` HTML, and whether it renders as raw HTML, sanitized
 * HTML or structured data is undecided. Nothing here pre-empts that.
 */
const PortfolioItem = ({ item }: PortfolioItemProps): ReactElement => {
  return (
    <article data-testid="portfolio-item-remote" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-ink">{item?.title ?? 'Portfolio item'}</h1>
      <p className="text-sm text-slate-500">
        portfolio item remote — Slice 7 fills this{item ? ` (${item.slug})` : ''}
      </p>
    </article>
  );
};

export default PortfolioItem;
