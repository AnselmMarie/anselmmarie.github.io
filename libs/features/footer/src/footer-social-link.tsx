import type { ReactElement } from 'react';

import type { SocialIconName } from '@portfolio/shared-types';
import { SocialIcon } from '@portfolio/ui-components';

interface FooterSocialLinkItemProps {
  /** Names the link for assistive tech; the mark itself is `aria-hidden`. */
  label: string;
  href: string;
  icon: SocialIconName;
}

/**
 * One outbound link in the footer.
 *
 * `target="_blank"` + `rel="noreferrer"` are ported from v3's hero links
 * verbatim — `noreferrer` implies `noopener`, so the tabnabbing hole is closed
 * without a second token.
 *
 * ⚠️ **The label moved from the text node to `aria-label` when the mark landed**
 * (D75). An icon-only link with no accessible name is unusable by screen reader
 * and unaddressable by `getByRole('link', { name })` — which is why the spec
 * asserts the name rather than the markup.
 */
const FooterSocialLinkItem = ({ label, href, icon }: FooterSocialLinkItemProps): ReactElement => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="text-ink transition-opacity hover:opacity-60"
    >
      <SocialIcon name={icon} size={24} />
    </a>
  );
};

export default FooterSocialLinkItem;
