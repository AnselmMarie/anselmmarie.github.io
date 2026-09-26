import { render, screen } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

/**
 * ⚠️ **The first spec under `apps/`, and it exists for one line.**
 * `header-remote.tsx` builds `remoteProps={{ variant }}`. Deleting that line
 * leaves every page compiling, every Header spec passing, and every portfolio
 * detail page drawing five anchors that point at homepage sections which are
 * not on it — they scroll nowhere and nothing throws. That is the failure
 * spec-through-the-parent.md is written against, and no spec inside
 * `@portfolio/feature-header` can catch it, because those specs pass `variant`
 * themselves and so always remember.
 *
 * ⚠️ **Slice 12's own file list said to assert this in
 * `shell-header-region.tsx`.** That component takes `children` — it receives an
 * already-built element and cannot pass a prop into it. Recorded as a plan
 * correction rather than followed.
 */

/** `ClientOnly` renders its fallback on the server; in jsdom, just pass through. */
vi.mock('@tanstack/react-router', () => ({
  ClientOnly: ({ children }: { children: ReactNode }): ReactNode => children,
}));

const mountCalls: Record<string, unknown>[] = [];

vi.mock('@portfolio/feature-shell', () => ({
  HeaderFallback: (): ReactElement => <p>fallback</p>,
  HeaderSkeleton: (): ReactElement => <p>skeleton</p>,
  MfeRemoteMount: (props: Record<string, unknown>): ReactElement => {
    mountCalls.push(props);
    return <p data-testid="mount">mounted</p>;
  },
}));

const { default: HeaderRemote } = await import('./header-remote.js');

describe('HeaderRemote', () => {
  it('hands the home variant to the mount', () => {
    mountCalls.length = 0;
    render(<HeaderRemote variant="home" />);

    expect(screen.getByTestId('mount')).toBeInTheDocument();
    expect(mountCalls[0]?.remoteProps).toEqual({ variant: 'home' });
  });

  it('hands the detail variant to the mount', () => {
    mountCalls.length = 0;
    render(<HeaderRemote variant="detail" />);

    expect(mountCalls[0]?.remoteProps).toEqual({ variant: 'detail' });
  });

  it('reports the route it is mounted on, so a failure names the right page', () => {
    // `route` rides in the diagnostic payload for a failed or hung remote
    // (mfe-diagnostics.ts). It was hardcoded `/` on both pages until Slice 12,
    // which made every detail-page header failure report as a homepage one.
    mountCalls.length = 0;
    render(<HeaderRemote variant="detail" />);

    expect(mountCalls[0]?.route).toBe('/portfolio/$slug');
  });

  it('hands the header skeleton to the mount, so the lazy import has a shape to draw', () => {
    mountCalls.length = 0;
    render(<HeaderRemote variant="home" />);

    render(mountCalls[0]?.loadingSkeleton as ReactElement);

    expect(screen.getByText('skeleton')).toBeInTheDocument();
  });
});
