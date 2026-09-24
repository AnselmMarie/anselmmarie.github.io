import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

/**
 * Q23 — every wrapper tells the mount which module it exposes, so a retry can
 * reload it through the federation host (`reload-remote.ts`).
 *
 * ⚠️ **The prop is optional, and that is what makes this spec necessary.** A
 * wrapper that forgets it still compiles, still renders, and still shows a
 * "Try again" button, which then re-runs the one import that can never succeed
 * again on that page. Only a spec through the wrapper sees the gap
 * (spec-through-the-parent.md). Each value must match the `import('<remote>/…')`
 * specifier in the same file; Slice 9's retry specs check the real load end to
 * end.
 */

vi.mock('@tanstack/react-router', () => ({
  ClientOnly: ({ children }: { children: ReactNode }): ReactNode => children,
}));

const mountCalls: Record<string, unknown>[] = [];

vi.mock('@portfolio/feature-shell', () => ({
  ContentSkeleton: (): null => null,
  FooterFallback: (): null => null,
  FooterSkeleton: (): null => null,
  HeaderFallback: (): null => null,
  HeaderSkeleton: (): null => null,
  HomepageFallback: (): null => null,
  PortfolioItemFallback: (): null => null,
  MfeRemoteMount: (props: Record<string, unknown>): ReactElement => {
    mountCalls.push(props);
    return <p>mounted</p>;
  },
}));

const { default: FooterRemote } = await import('./footer-remote.js');
const { default: HeaderRemote } = await import('./header-remote.js');
const { default: HomepageRemote } = await import('./homepage-remote.js');
const { default: PortfolioItemRemote } = await import('./portfolio-item-remote.js');

const WRAPPERS: readonly [string, () => ReactElement, string][] = [
  ['footer', () => <FooterRemote />, 'Footer'],
  ['header', () => <HeaderRemote variant="home" />, 'Header'],
  ['homepage', () => <HomepageRemote />, 'Homepage'],
  ['portfolio-item', () => <PortfolioItemRemote slug="x" />, 'PortfolioItem'],
];

describe('the remote wrappers', () => {
  it.each(WRAPPERS)('the %s wrapper names its exposed module', (_mfe, renderWrapper, exposed) => {
    mountCalls.length = 0;
    render(renderWrapper());

    expect(mountCalls[0]?.exposedModule).toBe(exposed);
  });
});
