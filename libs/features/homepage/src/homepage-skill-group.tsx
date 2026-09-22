import type { ReactElement } from 'react';

import type { HomepageContent } from '@portfolio/shared-types';

/** Derived — the types barrel is coordinator-owned and exports only the root. */
type SkillGroup = HomepageContent['skillGroups'][number];

interface HomepageSkillGroupProps {
  group: SkillGroup;
}

/**
 * One column of the skills section — v3's `skill-list-section.view.tsx` at
 * `39bbe56`.
 *
 * ⚠️ **An empty `heading` renders no heading element at all.** v3 renders the
 * word "Developer" a second time with `invisible` so the two developer columns'
 * rows line up; an invisible duplicate heading is read aloud by a screen reader
 * as a real one, so the spacer is a `<div aria-hidden>` instead.
 */
const HomepageSkillGroup = ({ group }: HomepageSkillGroupProps): ReactElement => {
  return (
    <div className="flex-1">
      {group.heading === '' ? (
        <div aria-hidden className="mt-0 h-7" />
      ) : (
        <h4 className="mt-0 flex items-center text-sky-700">{group.heading}</h4>
      )}
      <ul className="mt-0 mb-0">
        {group.skills.map((skill) => (
          <li key={skill} className="mb-1">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomepageSkillGroup;
