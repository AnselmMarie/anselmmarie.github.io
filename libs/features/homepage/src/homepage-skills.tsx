import type { ReactElement } from 'react';

import type { HomepageContent } from '@portfolio/shared-types';

import HomepageSkillGroupColumn from './homepage-skill-group.js';

/** Derived — the types barrel is coordinator-owned and exports only the root. */
type SkillGroup = HomepageContent['skillGroups'][number];

interface HomepageSkillsProps {
  sectionId: string;
  label: string;
  groups: readonly SkillGroup[];
}

/**
 * The skills section — v3's `skill-list.view.tsx` at `39bbe56`.
 *
 * ⚠️ **`id` and `scroll-mt-anchor` are D43's contract.** The Header remote and
 * the shell's header fallback both build `href="#<id>"` from `SITE_SECTIONS`;
 * a rename that only one of the three follows scrolls nowhere and throws
 * nothing. `scroll-mt-anchor` reads `--spacing-header` from the shared theme,
 * which is how two separately deployed remotes agree on the fixed header's
 * height at build time.
 *
 * v3 renders this section with no heading; `label` is on a visually-hidden
 * `<h2>` so the anchor target is a named landmark rather than a bare div.
 */
const HomepageSkills = ({ sectionId, label, groups }: HomepageSkillsProps): ReactElement => {
  // ⚠️ **Columns are grouped into cards, because v3 draws two cards and three
  // columns** — Developer and its tools continuation sit side by side inside
  // one bordered card. Rendering one card per column is the divergence this
  // exists to prevent; card order follows first appearance.
  const cardIds = [...new Set(groups.map((group) => group.cardId))];

  return (
    <section id={sectionId} className="scroll-mt-anchor px-5">
      <h2 className="sr-only">{label}</h2>
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-4 lg:flex-row">
        {cardIds.map((cardId) => (
          <div
            key={cardId}
            className="mb-9 flex flex-col rounded-md border border-slate-200 bg-white p-10 drop-shadow-sm md:flex-row"
          >
            {groups
              .filter((group) => group.cardId === cardId)
              .map((group) => (
                <HomepageSkillGroupColumn key={group.id} group={group} />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomepageSkills;
