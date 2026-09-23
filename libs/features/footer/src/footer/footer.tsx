import type { ReactElement } from 'react';

import { SITE_NAME } from '@portfolio/shared-fixtures';

import FooterSocialLinkItem from './footer-social-link.js';
import { FOOTER_SOCIAL_LINKS } from './footer-social-links.const.js';

/**
 * 🧭 **OWNER: Slice 5 (Footer).**
 *
 * The site footer, served as its own independently deployed remote (D1, D2).
 *
 * ⚠️ **No v3 equivalent exists.** D34 makes the live v3 site the design
 * reference for every surface, but v3 has **no footer at all** — verified
 * against commit `39bbe56`: no `<footer>` element, no footer component, and
 * nothing footer-shaped in `layout.tsx`, `page.tsx` or any route view. So the
 * layout, the copyright line and the decision to put the social links down here
 * are all invented. The two URLs themselves are v3's real hero links. Flagged
 * per plan-design-links.md, matching the call Slice 3 made for the header.
 *
 * ⚠️ **Renders a `<div>`, not a `<footer>`.** `ShellFooterRegion` already
 * supplies the `<footer>` landmark this mounts inside; a second one would nest
 * two contentinfo landmarks on the composed page. Same reason the Header remote
 * renders a `<div>`.
 *
 * ⚠️ **The `data-testid` stays `footer-remote`.** It is what distinguishes "the
 * real remote rendered" from "the shell-owned fallback rendered"
 * (`mfe-fallback-footer`) on the composed page, and Slice 9's E2E assertions
 * depend on the distinction.
 */
const Footer = (): ReactElement => {
  return (
    <div
      data-testid="footer-remote"
      className="flex w-full flex-wrap items-center justify-between gap-4"
    >
      <span className="text-sm text-ink">
        © {new Date().getFullYear()} {SITE_NAME}
      </span>
      <nav aria-label="Elsewhere" className="flex items-center gap-6">
        {FOOTER_SOCIAL_LINKS.map((link) => (
          <FooterSocialLinkItem
            key={link.id}
            label={link.label}
            href={link.href}
            icon={link.icon}
          />
        ))}
      </nav>
    </div>
  );
};

export default Footer;
