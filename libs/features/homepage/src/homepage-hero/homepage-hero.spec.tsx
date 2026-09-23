import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT } from '@portfolio/shared-fixtures';

import HomepageHero from './homepage-hero.js';

const renderHero = () =>
  render(<HomepageHero specs={HOMEPAGE_CONTENT.specs} hero={HOMEPAGE_CONTENT.hero} />);

describe('HomepageHero', () => {
  it('splits the headline so the accent phrase is its own element', () => {
    renderHero();

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent('Building the front-end,');
    expect(heading).toHaveTextContent(/end.to.end\./u);
  });

  it('forces the break after "Building the", as the export does', () => {
    // Without it the balanced wrap at desktop width breaks `front-end` at its
    // hyphen. The break is content (`\n` in the lead), so it must reach the DOM.
    renderHero();

    const heading = screen.getByRole('heading', { level: 1 });
    const breaks = heading.querySelectorAll('br');

    expect(breaks).toHaveLength(1);
    expect(breaks[0]?.previousSibling?.textContent).toBe(' ');
    expect(heading.textContent).toMatch(/^Building the front-end, /u);
  });

  it('keeps the accent phrase from breaking mid-word', () => {
    // The design sets `end&nbsp;to&nbsp;end.` — a plain space lets the phrase
    // wrap across two lines at the exact widths the clamp is tuned for.
    renderHero();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(' ');
  });

  it('renders both CTAs, pointing at in-page anchors', () => {
    renderHero();

    const [viewWork, getInTouch] = HOMEPAGE_CONTENT.hero.ctas;

    expect(
      screen.getByRole('link', { name: new RegExp(viewWork?.label ?? '', 'u') })
    ).toHaveAttribute('href', viewWork?.href);
    expect(
      screen.getByRole('link', { name: new RegExp(getInTouch?.label ?? '', 'u') })
    ).toHaveAttribute('href', getInTouch?.href);
  });

  it('draws no social marks — the design replaced them with the CTAs', () => {
    // The same two destinations still render, in the footer strip, from
    // feature-footer's own const. Nothing is lost; it moved.
    renderHero();

    expect(screen.queryByRole('link', { name: /LinkedIn/u })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /GitHub/u })).not.toBeInTheDocument();
  });

  it('fills the featured panel typographically, with no image (D85)', () => {
    // ⚠️ Both exports draw a 16/7 photograph behind an Unsplash placeholder.
    // No asset in this repo reaches 16/7 — the widest is 1.80 — and four of
    // the eight items are mobile-screenshot-only. The box survives; the
    // photograph does not, and nothing here reports an image as outstanding.
    const { container } = renderHero();

    expect(container.querySelector('img')).toBeNull();
    for (const capability of HOMEPAGE_CONTENT.hero.capabilities) {
      expect(screen.getByText(capability.label)).toBeInTheDocument();
    }
    expect(screen.getByText(HOMEPAGE_CONTENT.hero.featuredCaption)).toBeInTheDocument();
  });

  it('renders every spec in the strip', () => {
    renderHero();

    for (const spec of HOMEPAGE_CONTENT.specs) {
      expect(screen.getByText(spec)).toBeInTheDocument();
    }
  });
});
