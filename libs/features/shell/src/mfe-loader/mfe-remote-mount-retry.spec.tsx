import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentType, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeRemoteMount from './mfe-remote-mount.js';
import { reloadRemote } from './reload-remote.js';

vi.mock('./reload-remote.js', () => ({ reloadRemote: vi.fn() }));

const Reloaded = (): ReactElement => <p>the reloaded remote</p>;
const Imported = (): ReactElement => <p>the imported remote</p>;

const testFallback = ({ onRetry }: MfeFallbackProps): ReactElement => (
  <button type="button" onClick={onRetry}>
    retry
  </button>
);

/** Fails the first import, then succeeds, as a remote that comes back would. */
const flakyImport = () => {
  let calls = 0;
  return vi.fn(async () => {
    calls += 1;
    if (calls === 1) throw new Error('Failed to fetch dynamically imported module');
    return { default: Imported as ComponentType };
  });
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(reloadRemote).mockReset();
});

/**
 * Q23: a retry loads through the federation host, because the import that
 * failed can never succeed again on that page. `reload-remote.spec.ts` covers
 * the reload; this covers when the mount uses it.
 */
describe('MfeRemoteMount retry', () => {
  it('reloads through the host on retry, with its remote, module and attempt', async () => {
    vi.mocked(reloadRemote).mockReturnValue(Promise.resolve({ default: Reloaded }));
    const onLoadRemote = flakyImport();

    render(
      <MfeRemoteMount
        mfe="homepage"
        version="v1"
        route="/"
        exposedModule="Homepage"
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );
    fireEvent.click(await screen.findByRole('button', { name: 'retry' }));

    expect(await screen.findByText('the reloaded remote')).toBeInTheDocument();
    expect(reloadRemote).toHaveBeenCalledExactlyOnceWith('homepage', 'Homepage', 1);
    expect(onLoadRemote).toHaveBeenCalledOnce();
  });

  it('never reloads on the first attempt', async () => {
    render(
      <MfeRemoteMount
        mfe="homepage"
        version="v1"
        route="/"
        exposedModule="Homepage"
        fallback={testFallback}
        onLoadRemote={flakyImport()}
      />
    );

    await screen.findByRole('button', { name: 'retry' });
    expect(reloadRemote).not.toHaveBeenCalled();
  });

  it('falls back to the import when there is no federation host', async () => {
    vi.mocked(reloadRemote).mockReturnValue(null);

    render(
      <MfeRemoteMount
        mfe="portfolio-item"
        version="v1"
        route="/portfolio/x"
        exposedModule="PortfolioItem"
        fallback={testFallback}
        onLoadRemote={flakyImport()}
      />
    );
    fireEvent.click(await screen.findByRole('button', { name: 'retry' }));

    expect(await screen.findByText('the imported remote')).toBeInTheDocument();
  });

  it('re-runs the import on retry when no exposed module is named', async () => {
    render(
      <MfeRemoteMount
        mfe="footer"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={flakyImport()}
      />
    );
    fireEvent.click(await screen.findByRole('button', { name: 'retry' }));

    expect(await screen.findByText('the imported remote')).toBeInTheDocument();
    expect(reloadRemote).not.toHaveBeenCalled();
  });
});
