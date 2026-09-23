import type { ReactElement } from 'react';

import type { HomepageContent } from '@portfolio/shared-types';
import { PillLink, UiIcon } from '@portfolio/ui-components';

import HomepageHeroMedia from './homepage-hero-media.js';
import HomepageSpecsStrip from './homepage-specs-strip.js';

/** Derived — the types barrel exports the root type, not every nested shape. */
type HeroContent = HomepageContent['hero'];

interface HomepageHeroProps {
  specs: readonly string[];
  hero: HeroContent;
}

/**
 * The hero — the specs strip, the headline, the lede, two pills, and the
 * featured panel.
 *
 * ⚠️ **Three breakpoints, not two.** The export distinguishes `<760`,
 * `760–1080` and `≥1080`, and the middle band has its own lede layout
 * (`1fr auto`, end-aligned) rather than simply inheriting the mobile stack.
 * Collapsing to two is a visible regression at tablet width, which is why the
 * slice asks for screenshots at 375, 900 and 1400.
 *
 * ⚠️ **It carries no section `id`.** The hero is not in `SITE_SECTIONS`; the
 * Header's anchors start at `#work` (D43, D81).
 *
 * ⚠️ **`hero.links` is gone.** The design replaced the two social marks with
 * the CTAs below; the same destinations still render in the footer strip, from
 * `@portfolio/feature-footer`'s own const.
 */
const HomepageHero = ({ specs, hero }: HomepageHeroProps): ReactElement => {
  return (
    <div className="px-[18px] pb-9 pt-[30px] frame:px-[26px] frame:pb-[52px] frame:pt-11">
      <HomepageSpecsStrip specs={specs} />

      <div className="mt-[34px] grid items-start gap-[22px] wide:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] wide:items-end wide:gap-[34px]">
        <h1 className="m-0 text-balance font-display text-display font-bold text-ink">
          {hero.headline.lead}
          {/* A non-breaking space keeps `end to end.` from breaking mid-phrase. */}
          <span className="text-accent"> {hero.headline.accent.replace(/ /gu, ' ')}</span>
        </h1>

        <div className="grid min-w-0 items-stretch gap-x-[34px] gap-y-[22px] frame:grid-cols-[minmax(0,1fr)_auto] frame:items-end wide:grid-cols-none wide:items-stretch">
          <p className="m-0 max-w-[42ch] text-base leading-[1.65] text-muted">{hero.lede}</p>
          <div className="flex flex-wrap gap-3">
            {hero.ctas.map((cta, index) => (
              <PillLink key={cta.href} href={cta.href} variant={index === 0 ? 'solid' : 'outline'}>
                {cta.label}
                {index === 0 ? <UiIcon name="arrow-right" size={17} /> : null}
              </PillLink>
            ))}
          </div>
        </div>
      </div>

      <HomepageHeroMedia caption={hero.featuredCaption} capabilities={hero.capabilities} />
    </div>
  );
};

export default HomepageHero;
