import type { ReactElement } from 'react';

import type { ItemLink } from '@portfolio/shared-types';
import { Eyebrow, PillLink, SocialIcon, UiIcon } from '@portfolio/ui-components';

interface PortfolioItemLinksProps {
  links: readonly ItemLink[];
}

/**
 * The `Links` column beside the title: the first pill solid ink, the rest
 * outlined, each led by its mark.
 *
 * ⚠️ **Returns `null` for an item with no links, and several have none.** The
 * design gives every project a `href: '#'` placeholder; Slice 11 shipped only
 * real URLs, so an empty column is the honest state rather than a dead anchor
 * under a `Links` label.
 */
const PortfolioItemLinks = ({ links }: PortfolioItemLinksProps): ReactElement | null => {
  if (links.length === 0) {
    return null;
  }

  return (
    <div data-testid="portfolio-item-links" className="flex min-w-0 flex-col gap-3">
      <Eyebrow label="Links" className="text-chip" />
      <div className="flex flex-wrap gap-2.5">
        {links.map((link, index) => (
          <PillLink
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            variant={index === 0 ? 'solid' : 'outline'}
          >
            {link.icon === 'github' ? (
              <SocialIcon name="github" size={17} />
            ) : (
              <UiIcon name="external" size={17} />
            )}
            {link.label}
          </PillLink>
        ))}
      </div>
    </div>
  );
};

export default PortfolioItemLinks;
