import type { ReactElement } from 'react';

import type { MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeFallbackNotice from './mfe-fallback-notice.js';

/**
 * The homepage's fallback: a page-level error state with a retry action (the
 * architecture doc's *Fallback Strategy by MFE* → Homepage).
 *
 * ⚠️ **Invented.** The copy and the card are ours; v3 has no equivalent state.
 *
 * ⚠️ **The copy differs by failure kind and that is not decoration.** "did not
 * load" and "could not be displayed" are the difference between a visitor who
 * should retry and one who probably should not — and the retry button is
 * offered either way, so the sentence is the only thing distinguishing them.
 */
const HomepageFallback = ({
  mfe,
  kind,
  attemptsRemaining,
  onRetry,
}: MfeFallbackProps): ReactElement => {
  const message =
    kind === 'render'
      ? 'This section could not be displayed. The rest of the page is unaffected.'
      : 'This section did not load. The rest of the page is unaffected.';

  return (
    <MfeFallbackNotice
      mfe={mfe}
      title="This part of the page is unavailable"
      message={message}
      attemptsRemaining={attemptsRemaining}
      onRetry={onRetry}
    />
  );
};

export default HomepageFallback;
