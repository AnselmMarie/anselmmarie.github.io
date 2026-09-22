import type { ReactElement } from 'react';

import type { HomepageContent, PortfolioItem } from '@portfolio/shared-types';

import HomepageProjectCard from './homepage-project-card.js';

/** Derived — the types barrel is coordinator-owned and exports only the root. */
type ProjectGroup = HomepageContent['projectGroups'][number];

interface HomepageProjectSectionProps {
  group: ProjectGroup;
  items: readonly PortfolioItem[];
}

/**
 * One portfolio listing section — v3's `active-projects.view.tsx` and
 * `other-project.view.tsx` at `39bbe56`, which are the same markup over two
 * different arrays.
 *
 * ⚠️ **The section decides its members by slug, not by a field on the item.**
 * `usePortfolioItems()` returns one flat list with no active/other
 * discriminator, so `group.slugs` is the order and the membership. An item not
 * named by either group does not appear on the homepage.
 *
 * ⚠️ **An empty list is a legitimate state today, not a bug.**
 * `portfolio-items.fixture.ts` is Slice 7's and is an empty array until that
 * slice lands, so both sections render the empty message in Slice 6's own dev
 * server. Rendering it deliberately is the point.
 */
const HomepageProjectSection = ({ group, items }: HomepageProjectSectionProps): ReactElement => {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const listed = group.slugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is PortfolioItem => item !== undefined);

  return (
    <section id={group.sectionId} className="scroll-mt-header px-5">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-sky-700">{group.heading}</h2>
        {listed.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No projects to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {listed.map((item) => (
              <HomepageProjectCard
                key={item.slug}
                slug={item.slug}
                title={item.title}
                thumbnail={item.thumbnail}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomepageProjectSection;
