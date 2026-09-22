import type { ReactElement } from 'react';

interface PortfolioNotFoundProps {
  slug: string;
}

/**
 * What `/portfolio/<slug>` renders when there is no such item.
 *
 * ⚠️ **This is deliberately NOT a fallback, and the distinction is the point.**
 * A remote that failed might work on a retry; a slug that does not exist never
 * will. Collapsing the two would put a "try again" button in front of someone
 * whose link is simply wrong, and would hide a real remote outage behind a
 * not-found. The shell owns this state because the shell owns routing (D4) and
 * resolves the item before the remote is ever asked for.
 *
 * ⚠️ **Invented** — v3 has no equivalent page. Flagged per plan-design-links.md.
 */
const PortfolioNotFound = ({ slug }: PortfolioNotFoundProps): ReactElement => {
  return (
    <div
      data-testid="portfolio-not-found"
      className="mx-auto flex max-w-xl flex-col items-start gap-3 p-6"
    >
      <h1 className="text-lg font-semibold text-ink">No such project</h1>
      <p className="text-sm text-slate-500">
        There is no portfolio item at <code>{slug}</code>.
      </p>
      <a href="/#active-projects" className="text-sm font-medium text-ink underline">
        Back to the portfolio
      </a>
    </div>
  );
};

export default PortfolioNotFound;
