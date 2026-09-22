import type { ReactElement } from 'react';

interface PortfolioItemHeaderProps {
  /** The project name, rendered as the page's `<h1>`. */
  title: string;
  /** Who the work was for. */
  company: string;
  /** The discipline line — `Design / Development`. */
  subtitle: string;
}

/**
 * The item page's masthead, matching the live v3 item page (D34): the project
 * name, the company above it, and the discipline line under it.
 */
const PortfolioItemHeader = ({
  title,
  company,
  subtitle,
}: PortfolioItemHeaderProps): ReactElement => {
  return (
    <header data-testid="portfolio-item-header" className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{company}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="text-sm font-medium text-slate-600">{subtitle}</p>
    </header>
  );
};

export default PortfolioItemHeader;
