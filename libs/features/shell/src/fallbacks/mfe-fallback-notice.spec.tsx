import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import MfeFallbackNotice from './mfe-fallback-notice.js';

describe('MfeFallbackNotice', () => {
  it('names the failing remote so a spec and an E2E can find it', () => {
    render(
      <MfeFallbackNotice
        mfe="homepage"
        title="Unavailable"
        message="Not loaded."
        attemptsRemaining={2}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByTestId('mfe-fallback-homepage')).toBeInTheDocument();
  });

  it('offers a retry while attempts remain', () => {
    const onRetry = vi.fn();
    render(
      <MfeFallbackNotice
        mfe="homepage"
        title="Unavailable"
        message="Not loaded."
        attemptsRemaining={1}
        onRetry={onRetry}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('replaces the retry with an explanation once the budget is spent', () => {
    // The architecture doc asks for the bound to be visible, not only
    // enforced. A button that stays and silently ignores clicks is the failure
    // this assertion exists to prevent.
    render(
      <MfeFallbackNotice
        mfe="homepage"
        title="Unavailable"
        message="Not loaded."
        attemptsRemaining={0}
        onRetry={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    expect(screen.getByTestId('mfe-retry-exhausted-homepage')).toBeInTheDocument();
  });

  it('renders extra actions beside the retry', () => {
    render(
      <MfeFallbackNotice
        mfe="portfolio-item"
        title="Unavailable"
        message="Not loaded."
        attemptsRemaining={1}
        onRetry={vi.fn()}
      >
        <a href="/">somewhere else</a>
      </MfeFallbackNotice>
    );

    expect(screen.getByRole('link', { name: 'somewhere else' })).toBeInTheDocument();
  });
});
