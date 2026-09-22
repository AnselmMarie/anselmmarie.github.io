import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MfeFallbackProps } from '../mfe-error-boundary/mfe-failure.js';
import MfeRemoteMount from './mfe-remote-mount.js';

/**
 * D73 — prop forwarding through the mount, in its own file because it is the
 * check the mount went without.
 *
 * ⚠️ **The remote's own specs cannot cover this and never could.** They render
 * `PortfolioItem` with an `item` the spec supplies, so the spec plays the part
 * of the parent and always remembers — which is the exact failure
 * spec-through-the-parent.md describes. The assertions here render *through*
 * the mount instead, and go red when the forwarding is removed.
 */
const RealRemote = (): ReactElement => <p>the real remote</p>;

const testFallback = ({ kind }: MfeFallbackProps): ReactElement => (
  <div data-testid="fallback">{kind}</div>
);

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MfeRemoteMount prop forwarding', () => {
  // D73 — these two are the negative control the mount went without. Until
  // 2026-09-21 it rendered `<RemoteComponent />` bare, which is correct for the
  // three remotes that take no props and silently wrong for the one that does.
  // Nothing caught it: the remote's own specs supply the prop themselves, so
  // they play the part of the parent and always remember.
  it('hands remoteProps to the remote component', async () => {
    const PropReadingRemote = ({ item }: { item?: { slug: string } }): ReactElement => (
      <p data-testid="received">{item ? item.slug : 'nothing arrived'}</p>
    );
    const onLoadRemote = vi.fn(async () => ({
      default: PropReadingRemote as ComponentType<{ item?: { slug: string } }>,
    }));

    render(
      <MfeRemoteMount
        mfe="portfolio-item"
        version="v1"
        route="/portfolio/cosmikata"
        remoteProps={{ item: { slug: 'cosmikata' } }}
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );

    expect(await screen.findByTestId('received')).toHaveTextContent('cosmikata');
  });

  it('renders a remote that takes no props when remoteProps is omitted', async () => {
    const onLoadRemote = vi.fn(async () => ({ default: RealRemote as ComponentType }));

    render(
      <MfeRemoteMount
        mfe="footer"
        version="v1"
        route="/"
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );

    expect(await screen.findByText('the real remote')).toBeInTheDocument();
  });
});
