import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomepageProjectCard from './homepage-project-card.js';

describe('HomepageProjectCard', () => {
  it('links to the item route built from the slug', () => {
    render(
      <HomepageProjectCard
        slug="cw-breeze-thru"
        title="Breeze-Thru"
        thumbnail="/images/portfolio/cricket-wireless/breeze-thru-thumbnail.jpg"
      />
    );

    expect(screen.getByRole('link', { name: 'Breeze-Thru' })).toHaveAttribute(
      'href',
      '/portfolio/cw-breeze-thru'
    );
  });

  it('draws the thumbnail it is given, and composes no URL of its own (D42)', () => {
    // ⚠️ **This asserted `img` was null until the wave was integrated**, and the
    // reversal is the point rather than a repair. While Slices 6 and 7 ran
    // concurrently, `PortfolioItem` carried no `thumbnail` — it is Slice 7's
    // module — so the tile shipped title-only and this pinned that state. Slice
    // 7 landed the field, so the spec went red, which is what a spec encoding a
    // temporary state should do when the state ends.
    const { container } = render(
      <HomepageProjectCard
        slug="cosmikata"
        title="Cosmikata"
        thumbnail="/images/portfolio/freelancing-concepts/cosmikata-thumbnail.png"
      />
    );

    // Decorative (`alt=""`), so it is queried from the DOM rather than by role:
    // the link text already names the project, and a meaningful `alt` would
    // have a screen reader announce the same title twice.
    const image = container.querySelector('img');

    expect(image).toHaveAttribute(
      'src',
      '/images/portfolio/freelancing-concepts/cosmikata-thumbnail.png'
    );
    expect(image).toHaveAttribute('alt', '');
  });
});
