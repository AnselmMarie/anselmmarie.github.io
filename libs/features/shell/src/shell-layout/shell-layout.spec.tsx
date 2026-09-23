import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ShellLayout from './shell-layout.js';

describe('ShellLayout', () => {
  it('renders all three regions', () => {
    render(<ShellLayout />);

    expect(screen.getByTestId('shell-header-region')).toBeInTheDocument();
    expect(screen.getByTestId('shell-content-region')).toBeInTheDocument();
    expect(screen.getByTestId('shell-footer-region')).toBeInTheDocument();
  });

  it('forwards header, children and footer into their own regions', () => {
    // The regions take content as props so the app composes remotes into the
    // layout without the layout knowing what a remote is. Slices 3, 5, 6 and 7
    // all rely on exactly this forwarding, and each passes a different one — so
    // a region wired to the wrong prop would only surface in one of them.
    render(
      <ShellLayout header={<span>HEADER SLOT</span>} footer={<span>FOOTER SLOT</span>}>
        <span>CONTENT SLOT</span>
      </ShellLayout>
    );

    expect(screen.getByTestId('shell-header-region')).toHaveTextContent('HEADER SLOT');
    expect(screen.getByTestId('shell-content-region')).toHaveTextContent('CONTENT SLOT');
    expect(screen.getByTestId('shell-footer-region')).toHaveTextContent('FOOTER SLOT');
  });

  it('does not leak one slot into another region', () => {
    render(
      <ShellLayout header={<span>HEADER SLOT</span>} footer={<span>FOOTER SLOT</span>}>
        <span>CONTENT SLOT</span>
      </ShellLayout>
    );

    expect(screen.getByTestId('shell-header-region')).not.toHaveTextContent('FOOTER SLOT');
    expect(screen.getByTestId('shell-footer-region')).not.toHaveTextContent('HEADER SLOT');
  });

  it('falls back to a named placeholder in each region when nothing is passed', () => {
    // Slice 1 ships with no remotes at all, so the empty state is the state the
    // page is actually in — it has to be legible rather than blank.
    render(<ShellLayout />);

    expect(screen.getByTestId('shell-header-region')).toHaveTextContent('header region');
    expect(screen.getByTestId('shell-footer-region')).toHaveTextContent('footer region');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Anselm Marie');
  });

  it('uses landmark elements so the regions are navigable', () => {
    render(<ShellLayout />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
