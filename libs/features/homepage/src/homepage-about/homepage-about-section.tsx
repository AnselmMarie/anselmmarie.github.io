import type { ReactElement } from 'react';

import type { HomepageAbout } from '@portfolio/shared-types';
import { Eyebrow } from '@portfolio/ui-components';

import HomepageStatCard from './homepage-stat-card.js';

interface HomepageAboutSectionProps {
  sectionId: string;
  about: HomepageAbout;
}

/**
 * The About section — a statement, two paragraphs, and two stat cards.
 *
 * ⚠️ **The statement renders plain; the design bolds two phrases inside it.**
 * The export sets `looks` bold and `holds up.` bold + accent, mid-sentence.
 * `AccentedLine` only accents a *trailing* run, so the content model stores
 * this one as plain text — and hardcoding the two emphasised words in JSX here
 * would put site copy inside a component. Recorded as a deliberate divergence;
 * closing it means a segmented statement type, which is a content-model change
 * and not this slice's.
 */
const HomepageAboutSection = ({ sectionId, about }: HomepageAboutSectionProps): ReactElement => {
  return (
    <section id={sectionId} className="scroll-mt-anchor px-page py-10 frame:py-16">
      <div className="grid items-start gap-8 frame:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] frame:gap-14">
        <div className="min-w-0">
          <Eyebrow label={about.eyebrow} hasRule />
          <p className="mb-7 mt-4 font-display text-lead font-normal text-ink">{about.statement}</p>
          <div className="flex max-w-[46ch] flex-col gap-4 text-[0.95rem] leading-[1.8] text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[14px]">
          {about.stats.map((stat) => (
            <HomepageStatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageAboutSection;
