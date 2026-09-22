import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import Footer from './footer.js';

describe('Footer', () => {
  it('identifies itself as the remote, not the shell-owned fallback', () => {
    // ⚠️ The distinction the whole failure-isolation story rests on. The
    // fallback carries `mfe-fallback-footer`; this carries `footer-remote`.
    // A composed page showing one is not showing the other.
    render(<Footer />);

    expect(screen.getByTestId('footer-remote')).toBeInTheDocument();
    expect(screen.queryByTestId('mfe-fallback-footer')).not.toBeInTheDocument();
  });

  it('reads the site name from the shared fixtures rather than hardcoding it', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-remote')).toHaveTextContent(SITE_NAME);
  });

  it('says out loud that it is a placeholder', () => {
    // ⚠️ This assertion is expected to be DELETED by Slice 5, and that is the
    // point: it fails the moment the real footer lands, so the placeholder
    // cannot ship to production unnoticed.
    render(<Footer />);

    expect(screen.getByTestId('footer-remote')).toHaveTextContent('Slice 5 fills this');
  });
});
