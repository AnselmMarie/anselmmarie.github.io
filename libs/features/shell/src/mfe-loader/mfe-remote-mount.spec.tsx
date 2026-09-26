import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentType, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeRemoteMount from './mfe-remote-mount.js';

const RealRemote = (): ReactElement => <p>the real remote</p>;

const testFallback = ({ kind, attemptsRemaining, onRetry }: MfeFallbackProps): ReactElement => (
  <div data-testid="fallback">
    <span data-testid="kind">{kind}</span>
    <span data-testid="remaining">{attemptsRemaining}</span>
    <button type="button" onClick={onRetry}>
      retry
    </button>
  </div>
);

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MfeRemoteMount', () => {
  it('renders the remote once its import resolves', async () => {
    const onLoadRemote = vi.fn(async () => ({ default: RealRemote as ComponentType }));

    render(
      <MfeRemoteMount
        mfe="header"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );

    expect(await screen.findByText('the real remote')).toBeInTheDocument();
  });

  it('routes a failed import to the same fallback a render failure gets', async () => {
    const onLoadRemote = vi.fn(async () => {
      throw new Error('Failed to fetch dynamically imported module');
    });

    render(
      <MfeRemoteMount
        mfe="footer"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={onLoadRemote as never}
      />
    );

    expect(await screen.findByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('kind')).toHaveTextContent('load');
  });

  it('re-imports the remote on retry instead of re-serving the cached rejection', async () => {
    // ⚠️ The single most important assertion in this file. `React.lazy` caches
    // the rejected promise, so a boundary that merely clears its error renders
    // the SAME lazy component, React re-serves the SAME rejection, and the
    // fallback reappears instantly — a retry button that looks like it works
    // and does not. Counting the calls is what proves a new import happened.
    let attempt = 0;
    const onLoadRemote = vi.fn(async () => {
      attempt += 1;

      if (attempt === 1) {
        throw new Error('Failed to fetch dynamically imported module');
      }

      return { default: RealRemote as ComponentType };
    });

    render(
      <MfeRemoteMount
        mfe="homepage"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={onLoadRemote as never}
      />
    );

    await screen.findByTestId('fallback');
    fireEvent.click(screen.getByRole('button', { name: 'retry' }));

    expect(await screen.findByText('the real remote')).toBeInTheDocument();
    expect(onLoadRemote).toHaveBeenCalledTimes(2);
  });

  it('bounds the retries and says so rather than looping', async () => {
    const onLoadRemote = vi.fn(async () => {
      throw new Error('error loading remote');
    });

    render(
      <MfeRemoteMount
        mfe="header"
        version="v1"
        route="/"
        maxRetries={1}
        fallback={testFallback}
        onLoadRemote={onLoadRemote as never}
      />
    );

    await screen.findByTestId('fallback');
    expect(screen.getByTestId('remaining')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'retry' }));

    await waitFor(() => expect(screen.getByTestId('remaining')).toHaveTextContent('0'));
    // Two imports: the first attempt and the one retry. The bound is in the
    // count the fallback is handed, so the UI can stop offering the action.
    expect(onLoadRemote).toHaveBeenCalledTimes(2);
  });

  it('shows the fallback when the import hangs instead of spinning forever', async () => {
    // R7. The import never settles, so nothing ever reaches the boundary.
    vi.useFakeTimers();
    const onLoadRemote = vi.fn(() => new Promise<{ default: ComponentType }>(() => undefined));

    render(
      <MfeRemoteMount
        mfe="portfolio-item"
        version="v1"
        route="/portfolio/x"
        timeoutMs={500}
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );

    expect(screen.getByTestId('mfe-loading')).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(await screen.findByTestId('fallback')).toBeInTheDocument();
    expect(screen.getByTestId('kind')).toHaveTextContent('timeout');
  });

  it('does not re-apply the hash for a region that is not the hash target', async () => {
    // Three remotes mount per page; only the content region holds the sections
    // an anchor can point at. Running it in all three would fire three scrolls.
    const scrollIntoView = vi.fn();
    const target = document.createElement('section');
    target.id = 'skills';
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);
    window.location.hash = '#skills';

    render(
      <MfeRemoteMount
        mfe="header"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={async () => ({ default: RealRemote as ComponentType })}
      />
    );

    await screen.findByText('the real remote');

    expect(scrollIntoView).not.toHaveBeenCalled();

    window.location.hash = '';
    document.body.innerHTML = '';
  });
});
