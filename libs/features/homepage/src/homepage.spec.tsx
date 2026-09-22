import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_SECTIONS } from '@portfolio/shared-fixtures';

import Homepage from './homepage.js';

describe('Homepage', () => {
  it('identifies itself as the remote, not the shell-owned fallback', () => {
    render(<Homepage />);

    expect(screen.getByTestId('homepage-remote')).toBeInTheDocument();
    expect(screen.queryByTestId('mfe-fallback-homepage')).not.toBeInTheDocument();
  });

  it('carries an element with the id for every section the Header links to', () => {
    // ⚠️ D43's contract, asserted from the homepage's side. The Header builds
    // `href="#<id>"` from the same fixture and the shell's `useHashReapply`
    // calls `getElementById` on it — three independently deployed units, and
    // this is the only place the agreement is checkable at all.
    const { container } = render(<Homepage />);

    for (const section of SITE_SECTIONS) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
    }
  });

  it('takes its content as a prop, so the shell can supply it later', () => {
    // D15 — the homepage never fetches. The prop is the seam the Contentful
    // plan swaps; the fixture default is only so the remote runs standalone.
    render(<Homepage content={{ sections: [{ id: 'only', label: 'Only Section' }] }} />);

    expect(screen.getByRole('heading', { name: 'Only Section' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Skills' })).not.toBeInTheDocument();
  });

  it('says out loud that it is a placeholder', () => {
    // ⚠️ Expected to be DELETED by Slice 6 — it fails the moment the real
    // homepage lands, so the placeholder cannot ship unnoticed.
    render(<Homepage />);

    expect(screen.getByTestId('homepage-remote')).toHaveTextContent('Slice 6 fills this');
  });
});
