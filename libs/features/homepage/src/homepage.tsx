import type { ReactElement } from 'react';

import { SECTION_IDS, useHomepageContent, usePortfolioItems } from '@portfolio/shared-fixtures';
import type { HomepageContent, PortfolioItem, SectionIntro } from '@portfolio/shared-types';

import HomepageAboutSection from './homepage-about-section.js';
import HomepageContactBlock from './homepage-contact-block.js';
import HomepageExperienceSection from './homepage-experience-section.js';
import HomepageHero from './homepage-hero.js';
import HomepageSkills from './homepage-skills.js';
import HomepageWorkSection from './homepage-work-section.js';

interface HomepageProps {
  /**
   * D15 — the homepage never fetches its own content; it receives it. The
   * default reads the one fixture seam so the remote also runs standalone.
   */
  content?: HomepageContent;
  /** The Work grid's items, same seam, same reason. */
  items?: readonly PortfolioItem[];
}

/** A section the content does not describe renders nothing rather than throwing. */
const findIntro = (intros: readonly SectionIntro[], sectionId: string): SectionIntro | undefined =>
  intros.find((intro) => intro.sectionId === sectionId);

/**
 * The homepage remote, rebuilt against the 2026-09-22 design export (D76).
 *
 * ⚠️ **Every section `id` comes from `SITE_SECTIONS`, never a literal.** Four
 * of the Header's five anchors land on this page, and the contract spans three
 * independently deployed units — this remote writes the ids, the Header remote
 * links to them, and the shell's header fallback links to them when the Header
 * is down. A rename that only two follow **scrolls nowhere and throws nothing**
 * (D43, D81).
 *
 * ⚠️ **It stops at the Contact block's bottom rule.** The footer strip below is
 * the footer remote's and arrives over the federation boundary (D79).
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

  const sectionIds = new Set(resolved.sections.map((section) => section.id));
  const workIntro = findIntro(resolved.sectionIntros, SECTION_IDS.work);
  const experienceIntro = findIntro(resolved.sectionIntros, SECTION_IDS.experience);
  const skillsIntro = findIntro(resolved.sectionIntros, SECTION_IDS.skills);

  return (
    <div data-testid="homepage-remote" className="flex flex-col">
      <HomepageHero specs={resolved.specs} hero={resolved.hero} />

      {workIntro === undefined || !sectionIds.has(SECTION_IDS.work) ? null : (
        <HomepageWorkSection
          sectionId={SECTION_IDS.work}
          intro={workIntro}
          cards={resolved.work}
          items={resolvedItems}
        />
      )}

      {experienceIntro === undefined || !sectionIds.has(SECTION_IDS.experience) ? null : (
        <HomepageExperienceSection
          sectionId={SECTION_IDS.experience}
          intro={experienceIntro}
          entries={resolved.experience}
          footnotes={resolved.footnotes}
        />
      )}

      {skillsIntro === undefined || !sectionIds.has(SECTION_IDS.skills) ? null : (
        <HomepageSkills
          sectionId={SECTION_IDS.skills}
          intro={skillsIntro}
          groups={resolved.skillGroups}
        />
      )}

      {sectionIds.has(SECTION_IDS.about) ? (
        <HomepageAboutSection sectionId={SECTION_IDS.about} about={resolved.about} />
      ) : null}

      {sectionIds.has(SECTION_IDS.contact) ? (
        <HomepageContactBlock sectionId={SECTION_IDS.contact} contact={resolved.contact} />
      ) : null}
    </div>
  );
};

export default Homepage;
