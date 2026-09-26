import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FooterSocialLinkItem from './footer-social-link.js';

describe('FooterSocialLinkItem', () => {
  it('renders a plain anchor to the given URL', () => {
    render(
      <FooterSocialLinkItem label="GitHub" href="https://github.com/AnselmMarie" icon="github" />
    );

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/AnselmMarie'
    );
  });

  it('opens in a new tab without leaking the opener', () => {
    // `rel="noreferrer"` implies `noopener`. Dropping it hands the opened site
    // a live `window.opener` handle, which is a real tabnabbing hole and not a
    // styling detail — hence an assertion rather than a comment.
    render(
      <FooterSocialLinkItem
        label="LinkedIn"
        href="https://www.linkedin.com/in/anselm-marie/"
        icon="linkedin"
      />
    );

    const link = screen.getByRole('link', { name: 'LinkedIn' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('keeps an accessible name now that the label is a mark, not text (D75)', () => {
    // ⚠️ The visible text went away when the Tabler mark landed, so the name
    // now comes from `aria-label` alone. An icon-only link that loses it is
    // announced as its URL and is unreachable by name — invisible to every
    // other assertion in this file, which is why it gets its own.
    render(
      <FooterSocialLinkItem label="GitHub" href="https://github.com/AnselmMarie" icon="github" />
    );

    const link = screen.getByRole('link', { name: 'GitHub' });

    expect(link).toHaveAccessibleName('GitHub');
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
