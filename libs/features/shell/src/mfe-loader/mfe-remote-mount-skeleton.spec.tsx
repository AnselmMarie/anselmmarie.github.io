import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import MfeRemoteMount from './mfe-remote-mount.js';

const RealRemote = (): ReactElement => <p>the real remote</p>;

const testFallback = (): ReactElement => <div data-testid="fallback" />;

/**
 * The skeleton is handed to the mount and drawn by `MfeLoadingPlaceholder`,
 * Suspense's fallback — so this renders through the mount rather than the
 * placeholder alone, which would pass the skeleton itself and always remember.
 */
describe('MfeRemoteMount loading skeleton', () => {
  it('draws the loading skeleton while the lazy import is pending, and drops it once it resolves', async () => {
    let resolveImport: (module: { default: ComponentType }) => void = () => undefined;
    const onLoadRemote = vi.fn(
      () =>
        new Promise<{ default: ComponentType }>((resolve) => {
          resolveImport = resolve;
        })
    );

    render(
      <MfeRemoteMount
        mfe="homepage"
        version="v1"
        route="/"
        loadingSkeleton={<span data-testid="skeleton" />}
        fallback={testFallback}
        onLoadRemote={onLoadRemote}
      />
    );

    expect(await screen.findByTestId('skeleton')).toBeInTheDocument();

    resolveImport({ default: RealRemote as ComponentType });

    expect(await screen.findByText('the real remote')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });
});
