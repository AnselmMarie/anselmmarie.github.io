import type { ReactElement } from 'react';

import type { HomepageContent, SectionIntro } from '@portfolio/shared-types';
import { SectionHeading } from '@portfolio/ui-components';

import HomepageSkillGroup from './homepage-skill-group.js';

type SkillGroup = HomepageContent['skillGroups'][number];

interface HomepageSkillsProps {
  sectionId: string;
  intro: SectionIntro;
  groups: readonly SkillGroup[];
}

/**
 * The dark Skills section — four capability columns on ink.
 *
 * ⚠️ **The export sets `white-space:nowrap` on a `clamp()` heading**, which
 * overflows at some narrow width by construction. It is **not** reproduced
 * here: `SectionHeading` wraps, which costs the two-line break the design draws
 * at wide widths and avoids a horizontal scrollbar at 320px. Recorded as a
 * deliberate divergence rather than left as an unexplained difference.
 */
const HomepageSkills = ({ sectionId, intro, groups }: HomepageSkillsProps): ReactElement => {
  return (
    <section
      id={sectionId}
      className="scroll-mt-anchor bg-ink px-page py-10 text-paper frame:py-16"
    >
      <div className="mb-11">
        <SectionHeading
          tone="ink"
          eyebrow={intro.eyebrow}
          heading={intro.heading.lead}
          accentPhrase={intro.heading.accent}
        />
      </div>
      <div className="grid gap-x-6 gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
        {groups.map((group) => (
          <HomepageSkillGroup key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
};

export default HomepageSkills;
