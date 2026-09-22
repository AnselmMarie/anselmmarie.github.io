import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MfeLoadingPlaceholder from './mfe-loading-placeholder.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MfeLoadingPlaceholder', () => {
  it('reserves the region so the page does not jump when the remote arrives', () => {
    render(<MfeLoadingPlaceholder className="h-nav" timeoutMs={1000} onTimeout={vi.fn()} />);

    expect(screen.getByTestId('mfe-loading')).toHaveAttribute('aria-hidden');
  });

  it('reports a timeout when the remote never arrives', () => {
    // R7. An import that neither resolves nor rejects is the one failure that
    // looks like success, because a spinner is indistinguishable from a slow
    // network. This is what turns it into a failure the shell can act on.
    const onTimeout = vi.fn();
    render(<MfeLoadingPlaceholder timeoutMs={1000} onTimeout={onTimeout} />);

    expect(onTimeout).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('cancels the timeout when the remote arrives first', () => {
    // The placeholder is Suspense's fallback, so unmounting IS the remote
    // resolving. If the timer outlived the unmount, every successfully loaded
    // remote would report a timeout a few seconds later.
    const onTimeout = vi.fn();
    const { unmount } = render(<MfeLoadingPlaceholder timeoutMs={1000} onTimeout={onTimeout} />);

    unmount();
    vi.advanceTimersByTime(5000);

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
