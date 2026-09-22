import type { ReactElement } from 'react';

import type { HomepageContent } from '@portfolio/shared-types';
import { SocialIcon } from '@portfolio/ui-components';

/**
 * Derived from `HomepageContent` rather than imported by name: the nested
 * shapes are declared in `homepage-content.ts` but `libs/shared/types/src/index.ts`
 * is coordinator-owned and exports only the top-level type.
 */
type HeroContent = HomepageContent['hero'];

interface HomepageHeroProps {
  hero: HeroContent;
}

/**
 * The hero panel — v3's `hero-section.view.tsx` at `39bbe56`, appearance only
 * (D6: no v3 code is ported, and its Radix `Container` / `@radix-ui/react-icons`
 * dependencies are not pulled in).
 *
 * ⚠️ **It carries no section `id`.** `SITE_SECTIONS` has three entries and the
 * hero is not one of them — the Header's anchors start at `#skills` (D43).
 *
 * ✅ **The two links render as brand marks.** v3 draws them as Radix SVG logos;
 * the maintainer chose **Tabler** (D75), drawn by `SocialIcon` in
 * `@portfolio/ui-components` — the footer renders the same component, which is
 * D29's extraction threshold met rather than guessed at. Slice 6 shipped text
 * labels only because a wave agent may not add a dependency.
 */
const HomepageHero = ({ hero }: HomepageHeroProps): ReactElement => {
  return (
    <div className="bg-slate-200 px-5">
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center py-24">
        <div className="relative rounded-2xl bg-slate-200/65 text-slate-800 shadow-2xl">
          <div className="flex min-h-40 items-end p-7">
            <div>
              <div className="text-5xl font-light">{hero.name}</div>
              <div className="text-2xl font-bold">{hero.headline}</div>
            </div>
            <div className="absolute inset-1 rounded-2xl border-2 border-solid border-gray-300" />
          </div>
        </div>

        <div className="my-10 flex justify-center gap-5">
          {hero.links.map((link) => (
            <a
              key={link.href}
              className="text-slate-800 transition-opacity hover:opacity-60"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
            >
              <SocialIcon name={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;
