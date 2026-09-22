import type { ReactElement } from 'react';

/**
 * ⚠️ **INVENTED — this state does not exist on the live v3 site (D34).** v3
 * rendered an item page only from a resolved store entry, so it had nothing to
 * show when there was none. Flagged control by control in Slice 7's report.
 *
 * It is reached only when this remote mounts with no item at all — a wiring
 * fault, not a visitor's bad URL. Those are three different states and must
 * stay apart:
 *
 * - **Unknown slug** → the shell's `PortfolioNotFound`. "No such item."
 * - **Remote down** → the shell's `PortfolioItemFallback`, with a way back.
 * - **Remote up, item missing** → this. The remote is running and has nothing
 *   to render, so it says so rather than drawing an empty page.
 *
 * It deliberately offers **no retry and no navigation**: retrying loads the
 * same nothing, and the shell owns navigation (D4). A link here would be this
 * remote knowing the shell's route shape.
 */
const PortfolioItemUnavailable = (): ReactElement => {
  return (
    <section
      data-testid="portfolio-item-unavailable"
      role="status"
      className="flex flex-col gap-2 rounded-lg border border-slate-200 p-6"
    >
      <h1 className="text-xl font-semibold text-ink">This project isn’t available right now</h1>
      <p className="max-w-prose text-sm text-slate-500">
        The page loaded, but its content didn’t arrive. Nothing is wrong with the link — try again
        in a moment.
      </p>
    </section>
  );
};

export default PortfolioItemUnavailable;
