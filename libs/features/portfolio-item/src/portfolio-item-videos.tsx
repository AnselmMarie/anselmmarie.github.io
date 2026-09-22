import type { ReactElement } from 'react';

import type { PortfolioItem } from '@portfolio/shared-types';

type PortfolioItemVideo = PortfolioItem['videos'][number];

interface PortfolioItemVideosProps {
  videos: readonly PortfolioItemVideo[];
}

/**
 * The item's video walkthroughs — YouTube embeds, and the only third-party
 * iframe on the site (D53). Only `older-cosmikata` has any, so this returns
 * `null` for seven of the eight items rather than rendering an empty heading.
 *
 * `referrerPolicy` and a narrow `allow` are set here because the embed is the
 * one surface this site does not control the contents of.
 */
const PortfolioItemVideos = ({ videos }: PortfolioItemVideosProps): ReactElement | null => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section data-testid="portfolio-item-videos" className="flex flex-col gap-6">
      {videos.map((video) => (
        <figure key={video.src} className="flex flex-col gap-2">
          <iframe
            src={video.src}
            title={video.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-lg border border-slate-200"
          />
          <figcaption className="text-sm text-slate-500">{video.description}</figcaption>
        </figure>
      ))}
    </section>
  );
};

export default PortfolioItemVideos;
