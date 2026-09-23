import type { ReactElement } from 'react';

import type { HomepageContact } from '@portfolio/shared-types';
import { Eyebrow, SocialIcon } from '@portfolio/ui-components';

interface HomepageContactBlockProps {
  sectionId: string;
  contact: HomepageContact;
}

/**
 * The dark Contact block.
 *
 * ⚠️ **It ends at its bottom rule and draws no footer strip** (D79). The
 * copyright row, the two icon links and the `Senior SWE · Tech Lead` tagline
 * below it belong to the **footer remote** and arrive over the federation
 * boundary. The section looks unfinished in isolation on purpose — run the
 * composed shell to see it whole.
 *
 * ⚠️ **`white-space:nowrap` on the export's `clamp()` heading is not
 * reproduced**, for the same reason as the Skills heading: it overflows at
 * narrow widths by construction.
 */
const HomepageContactBlock = ({ sectionId, contact }: HomepageContactBlockProps): ReactElement => {
  return (
    <section
      id={sectionId}
      className="scroll-mt-anchor bg-ink px-[18px] pb-[26px] pt-[72px] text-paper frame:px-[26px]"
    >
      <div className="text-center">
        <Eyebrow label={contact.eyebrow} tone="ink" />
        <h2 className="mb-8 mt-[0.8rem] font-display text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.035em]">
          {contact.heading.lead}
          <br />
          <span className="text-accent-bright">{contact.heading.accent}</span>
        </h2>
      </div>
      <div className="mb-[72px] flex flex-wrap justify-center gap-3">
        {contact.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[9px] rounded-pill bg-accent-bright px-7 py-[0.9rem] text-[0.92rem] font-medium text-ink transition-colors hover:bg-accent-bright/80"
          >
            <SocialIcon name={link.icon} size={19} />
            {link.label}
          </a>
        ))}
      </div>
      <div aria-hidden className="border-t border-white/10" />
    </section>
  );
};

export default HomepageContactBlock;
