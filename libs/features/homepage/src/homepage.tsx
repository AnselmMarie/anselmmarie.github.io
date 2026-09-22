import type { ReactElement } from 'react';

import { useHomepageContent, usePortfolioItems } from '@portfolio/shared-fixtures';
import type { HomepageContent, PortfolioItem } from '@portfolio/shared-types';

import HomepageHero from './homepage-hero.js';
import HomepageProjectSection from './homepage-project-section.js';
import HomepageSkills from './homepage-skills.js';

interface HomepageProps {
  /**
   * D15 — the homepage never fetches its own content; it receives it. The
   * default reads the one fixture seam so the remote also runs standalone.
   */
  content?: HomepageContent;
  /** The listing's items, same seam, same reason. */
  items?: readonly PortfolioItem[];
}

/**
 * The homepage remote, ported from the live v3 site section for section (D34,
 * D53 — commit `39bbe56`). Appearance only; no v3 code is ported (D6).
 *
 * ⚠️ **The section `id`s are a contract (D43).** They come from
 * `SITE_SECTIONS`, which the Header remote and the shell's header fallback both
 * read. The hero is not one of them — the anchors start at `#skills`.
 */
const Homepage = ({ content, items }: HomepageProps): ReactElement => {
  // ⚠️ **Called unconditionally, never inside the `??`.** These read fixtures
  // and call no React hook today, so `content ?? useHomepageContent()` would
  // work — right up until the Contentful plan gives them real hook bodies, at
  // which point the call order changes with the prop and React breaks.
  const fixtureContent = useHomepageContent();
  const fixtureItems = usePortfolioItems();
  const resolved = content ?? fixtureContent;
  const resolvedItems = items ?? fixtureItems;

  const skillsSection = resolved.sections.find((section) => section.id === 'skills');

  return (
    <div data-testid="homepage-remote" className="flex flex-col">
      <HomepageHero hero={resolved.hero} />

      {skillsSection === undefined ? null : (
        <HomepageSkills
          sectionId={skillsSection.id}
          label={skillsSection.label}
          groups={resolved.skillGroups}
        />
      )}

      {resolved.projectGroups.map((group) => (
        <HomepageProjectSection key={group.sectionId} group={group} items={resolvedItems} />
      ))}
    </div>
  );
};

export default Homepage;
