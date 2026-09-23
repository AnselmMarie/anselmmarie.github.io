import type { ReactElement } from 'react';

import type { PortfolioItemVideo } from '@portfolio/shared-types';
import { SectionHeading } from '@portfolio/ui-components';

interface PortfolioItemVideosProps {
  videos: readonly PortfolioItemVideo[];
}

/**
 * The item's video walkthroughs — YouTube embeds, and the only third-party
 * iframe on the site (D53). Only `older-cosmikata` has any, so this returns
 * `null` for the rest rather than rendering an empty heading.
 *
 * ⚠️ **INVENTED — the design draws no video block (D78).** Everything here is
 * borrowed from the gallery's vocabulary rather than read off the export: its
 * own ruled section between the overview and the gallery, a `| Video`
 * eyebrow over "Walk-through videos.", the gallery's two-column grid and
 * `22px` radius, a sunk-surface frame behind each player, and the description
 * as a muted caption under it.
 *
 * `referrerPolicy` and a narrow `allow` are set here because the embed is the
 * one surface this site does not control the contents of.
 */
const PortfolioItemVideos = ({ videos }: PortfolioItemVideosProps): ReactElement | null => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      data-testid="portfolio-item-videos"
      className="border-t border-rule px-page py-10 frame:py-16"
    >
      <SectionHeading
        eyebrow="Video"
        heading="Walk-through"
        accentPhrase="videos."
        className="mb-[26px]"
      />
      <div className="grid grid-cols-1 gap-3.5 frame:grid-cols-2">
        {videos.map((video) => (
          <figure key={video.src} className="m-0 flex flex-col gap-3">
            <iframe
              src={video.src}
              title={video.title}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full rounded-card border border-rule bg-surface-sunk"
            />
            <figcaption className="text-[0.9rem] leading-[1.6] text-muted">
              {video.description}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default PortfolioItemVideos;
