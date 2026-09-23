import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import Footer from './footer.js';
import { FOOTER_SOCIAL_LINKS, FOOTER_TAGLINE } from './footer-social-links.const.js';

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

  it('attributes the current year, not a year frozen at build time', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-remote')).toHaveTextContent(`© ${new Date().getFullYear()}`);
  });

  it('does not render a second contentinfo landmark inside the shell footer region', () => {
    // ShellFooterRegion already supplies the <footer>. A landmark here would
    // nest two, which is the bug this assertion exists to catch.
    const { container } = render(<Footer />);

    expect(container.querySelector('footer')).toBeNull();
  });

  // spec-through-the-parent.md — the link rows are supplied BY the Footer, so
  // the props have to be asserted at this call site. A FooterSocialLinkItem
  // spec renders with props the spec itself invented and would stay green if
  // the Footer stopped passing them.
  it('forwards every configured link into the nav, in order', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');

    // ⚠️ **Accessible name, not `textContent`** — this read the text node until
    // the Tabler marks landed (D75), at which point every link's text is empty
    // and an icon-only link's name comes from `aria-label` alone. Asserting the
    // name keeps this a real forwarding check instead of comparing '' to ''.
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      FOOTER_SOCIAL_LINKS.map((link) => link.label)
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      FOOTER_SOCIAL_LINKS.map((link) => link.href)
    );
  });

  it('closes the strip with the role line, as both exports draw it', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer-remote')).toHaveTextContent(FOOTER_TAGLINE);
  });

  it('labels the outbound nav so its links are reachable by role', () => {
    render(<Footer />);

    expect(screen.getByRole('navigation', { name: 'Elsewhere' })).toBeInTheDocument();
  });
});
