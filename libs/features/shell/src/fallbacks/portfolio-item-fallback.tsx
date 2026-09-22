import type { ReactElement } from 'react';

import type { MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeFallbackNotice from './mfe-fallback-notice.js';

/**
 * The portfolio item's fallback — the only one with somewhere to send the
 * visitor (the architecture doc: *"a route-specific error state with
 * navigation back to the portfolio"*).
 *
 * ⚠️ **Invented**, like the rest. The one non-arbitrary part is the second
 * action: this is the only remote behind a dynamic route, so it is the only
 * one whose failure leaves the visitor on a page with nothing else on it.
 *
 * ⚠️ **A plain `<a>`, not a router `Link`.** This component is rendered inside
 * a boundary that exists because something below it failed; reaching for the
 * router here would put a second moving part in the one place that has to work.
 * A full document load back to `/` is the cheap, certain option.
 */
const PortfolioItemFallback = ({
  mfe,
  kind,
  attemptsRemaining,
  onRetry,
}: MfeFallbackProps): ReactElement => {
  const message =
    kind === 'render' ? 'This project could not be displayed.' : 'This project did not load.';

  return (
    <MfeFallbackNotice
      mfe={mfe}
      title="This project is unavailable"
      message={message}
      attemptsRemaining={attemptsRemaining}
      onRetry={onRetry}
    >
      <a
        data-testid="mfe-fallback-portfolio-item-back"
        href="/#active-projects"
        className="text-sm font-medium text-ink underline"
      >
        Back to the portfolio
      </a>
    </MfeFallbackNotice>
  );
};

export default PortfolioItemFallback;
