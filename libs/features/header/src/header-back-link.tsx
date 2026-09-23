import type { ReactElement } from 'react';

import { UiIcon } from '@portfolio/ui-components';

import { WORK_HREF } from './anchor-href.js';

/**
 * The `← All work` link that replaces the nav on a portfolio detail page.
 *
 * ⚠️ **The two exports disagree about the bar, and neither is wrong.** The
 * homepage export draws five anchors; the detail export draws only the brand
 * and this link. The anchors point at homepage sections that do not exist on a
 * detail page, so a five-link nav there would scroll nowhere — which is the
 * silent failure the whole `SITE_SECTIONS` contract exists to prevent, arriving
 * by a different route.
 *
 * ⚠️ **The icon is decorative**, so the link's name comes from its text.
 */
const HeaderBackLink = (): ReactElement => {
  return (
    <a
      href={WORK_HREF}
      className="inline-flex items-center gap-2 text-[0.88rem] text-ink transition-colors hover:text-accent"
    >
      <UiIcon name="arrow-left" size={16} />
      All work
    </a>
  );
};

export default HeaderBackLink;
