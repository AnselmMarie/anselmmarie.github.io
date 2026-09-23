import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PortfolioItemUnavailable from './portfolio-item-unavailable.js';

describe('PortfolioItemUnavailable', () => {
  it('says the content did not arrive, not that the link is wrong', () => {
    // ⚠️ INVENTED state (D34 — v3 has no equivalent). The wording is the whole
    // point: an unknown slug is the shell's not-found, and telling a visitor
    // their link is bad when a deploy failed is the worse of the two errors.
    render(<PortfolioItemUnavailable />);

    expect(screen.getByRole('status')).toHaveTextContent(/didn’t arrive/);
    expect(screen.getByRole('status')).toHaveTextContent(/Nothing is wrong with the link/);
  });

  it('offers no navigation of its own — the shell owns routing (D4)', () => {
    render(<PortfolioItemUnavailable />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
