import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomepageFallback from './homepage-fallback.js';

describe('HomepageFallback', () => {
  it('carries a retry action, as a page-level fallback must', () => {
    const onRetry = vi.fn();
    render(<HomepageFallback mfe="homepage" kind="load" attemptsRemaining={2} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('says the remote did not load when that is what happened', () => {
    render(<HomepageFallback mfe="homepage" kind="load" attemptsRemaining={2} onRetry={vi.fn()} />);

    expect(screen.getByTestId('mfe-fallback-homepage')).toHaveTextContent('did not load');
  });

  it('says it could not be displayed when the remote loaded and threw', () => {
    // The two are different situations for the visitor: one is worth a retry,
    // the other usually is not. The sentence is the only thing distinguishing
    // them, since the button is offered either way.
    render(
      <HomepageFallback mfe="homepage" kind="render" attemptsRemaining={2} onRetry={vi.fn()} />
    );

    expect(screen.getByTestId('mfe-fallback-homepage')).toHaveTextContent('could not be displayed');
  });

  it('reassures that the rest of the page is unaffected', () => {
    // The isolation claim, said out loud to the person looking at it.
    render(<HomepageFallback mfe="homepage" kind="load" attemptsRemaining={1} onRetry={vi.fn()} />);

    expect(screen.getByTestId('mfe-fallback-homepage')).toHaveTextContent('rest of the page');
  });
});
