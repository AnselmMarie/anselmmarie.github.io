import type { ReactElement } from 'react';

interface HomepageSpecsStripProps {
  specs: readonly string[];
}

/**
 * The five mono items above the hero, each behind an accent rule.
 *
 * ⚠️ **The fourth reads `15+ years shipping`, and the number is not this
 * component's business** (D87). It is authored in `homepage.fixture.ts` and
 * derivable from the Experience list further down the page — which is the
 * property that stops it drifting from the About stat the way the export's own
 * pair did.
 */
const HomepageSpecsStrip = ({ specs }: HomepageSpecsStripProps): ReactElement => {
  return (
    <div className="flex flex-wrap gap-x-[34px] gap-y-[18px] border-b border-rule pb-[18px]">
      {specs.map((spec) => (
        <span key={spec} className="inline-flex items-center gap-[11px] text-[0.82rem] text-muted">
          <span aria-hidden className="text-accent">
            |
          </span>
          {spec}
        </span>
      ))}
    </div>
  );
};

export default HomepageSpecsStrip;
