import type { ReactElement } from 'react';

import type { AboutStat } from '@portfolio/shared-types';
import { PanelCard } from '@portfolio/ui-components';

interface HomepageStatCardProps {
  stat: AboutStat;
}

/**
 * One stat beside the About copy — a large figure baseline-aligned to its label.
 *
 * ⚠️ **The first reads `13+ · Years in lead & architect roles`, not the
 * design's `10+ · Years shipping production front-ends`** (D87). The export
 * made the same claim twice, here and in the specs strip, in different words
 * and different numbers — and `10+` matched no boundary in the experience list
 * at all. Both halves are authored in the fixture; this component reads them.
 */
const HomepageStatCard = ({ stat }: HomepageStatCardProps): ReactElement => {
  return (
    <PanelCard className="flex items-baseline gap-5">
      <span className="font-display text-[2.4rem] font-bold leading-none tracking-[-0.03em] text-ink">
        {stat.value}
      </span>
      <span className="text-[0.88rem] leading-[1.5] text-muted">{stat.label}</span>
    </PanelCard>
  );
};

export default HomepageStatCard;
