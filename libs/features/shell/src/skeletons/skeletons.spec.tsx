import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContentSkeleton from './content-skeleton.js';
import FooterSkeleton from './footer-skeleton.js';
import HeaderSkeleton from './header-skeleton.js';

const bonesIn = (testId: string): NodeListOf<Element> =>
  screen.getByTestId(testId).querySelectorAll('[data-slot="skeleton"]');

describe('region skeletons', () => {
  it('draws the header as a brand, five section links and a menu toggle', () => {
    render(<HeaderSkeleton />);

    expect(bonesIn('header-skeleton')).toHaveLength(7);
  });

  it('draws the footer as a credit line and three social icons', () => {
    render(<FooterSkeleton />);

    expect(bonesIn('footer-skeleton')).toHaveLength(4);
  });

  it('draws a page opening as an eyebrow, a two-line heading and a lede', () => {
    render(<ContentSkeleton />);

    expect(bonesIn('content-skeleton')).toHaveLength(6);
  });

  it('gives assistive tech nothing to read in any of them', () => {
    render(
      <>
        <HeaderSkeleton />
        <FooterSkeleton />
        <ContentSkeleton />
      </>
    );

    document.querySelectorAll('[data-slot="skeleton"]').forEach((bone) => {
      expect(bone).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
