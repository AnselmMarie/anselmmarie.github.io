import type { ReactElement } from 'react';

import type { HomepageContent } from '@portfolio/shared-types';

type SkillGroup = HomepageContent['skillGroups'][number];

interface HomepageSkillGroupProps {
  group: SkillGroup;
}

/**
 * One column of the dark Skills section.
 *
 * ⚠️ **`cardId` is gone.** It existed so two v3 columns could share one
 * bordered card; the design draws four columns in an `auto-fit` grid and no
 * cards at all, so the field had nothing left to join (D88).
 */
const HomepageSkillGroup = ({ group }: HomepageSkillGroupProps): ReactElement => {
  return (
    <div className="border-t border-white/14 pt-[1.1rem]">
      <p className="mb-4 mt-0 font-mono text-chip tracking-chip uppercase text-paper/50">
        {group.heading}
      </p>
      <div className="flex flex-col gap-[0.6rem]">
        {group.skills.map((skill) => (
          <span key={skill} className="text-[0.95rem]">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HomepageSkillGroup;
