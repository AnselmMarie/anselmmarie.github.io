import type { ReactElement } from 'react';

import { MetaChip, UiIcon } from '@portfolio/ui-components';

interface HomepageWorkCardProps {
  slug: string;
  title: string;
  /** The one-sentence summary. The item's `lede`. */
  lede: string;
  /** Who the work was for. The item's `company`. */
  client: string;
  year: string;
  /** The mono line top-left — the item's `tech`, joined. */
  stack: string;
  /**
   * The card's fill, as a hex literal from the design.
   *
   * ⚠️ **Data, not a class, and deliberately not a theme token.** These are
   * per-project editorial colours; there is no token for "the blue the Pokémon
   * card happens to be", and minting eight would put content into
   * `libs/ui/theme`. It arrives from `HomepageContent.work` (D77).
   */
  background: string;
  isDark: boolean;
  isLive: boolean;
}

/*
 * ⚠️ **A lookup, not a nested ternary.** Three values derive from `isDark` and
 * writing them inline is exactly where `no-nested-ternary.md` says one will
 * want to appear — and Biome drops the parentheses that make it look
 * deliberate the moment the line wraps.
 */
const DARK_TONE = {
  text: 'text-paper',
  chip: 'inverse',
} as const;

const LIGHT_TONE = {
  text: 'text-ink',
  chip: 'ink',
} as const;

/**
 * One card in the `#work` grid.
 *
 * ⚠️ **The link is `/portfolio/<slug>`, never the export's
 * `Project Detail.dc.html?p=` form**, and it is a plain `<a>`: this is a
 * federated remote and must not import the shell's router (D43).
 */
const HomepageWorkCard = ({
  slug,
  title,
  lede,
  client,
  year,
  stack,
  background,
  isDark,
  isLive,
}: HomepageWorkCardProps): ReactElement => {
  const tone = isDark ? DARK_TONE : LIGHT_TONE;

  return (
    <a
      href={`/portfolio/${slug}`}
      style={{ backgroundColor: background }}
      className={`flex min-h-[230px] flex-col justify-between rounded-[22px] p-6 transition-transform hover:-translate-y-[5px] ${tone.text}`}
    >
      <div className="flex items-center justify-between gap-3 font-mono text-chip tracking-chip uppercase">
        <span className="opacity-65">{stack}</span>
        {isLive ? (
          <MetaChip tone={tone.chip} hasDot className="gap-[0.4rem] px-[0.55rem] text-[0.54rem]">
            Live
          </MetaChip>
        ) : null}
      </div>

      <div>
        <h3 className="m-0 mb-2 font-display text-2xl font-bold leading-[1.05] tracking-[-0.02em]">
          {title}
        </h3>
        <p className="m-0 mb-[0.9rem] max-w-[38ch] text-[0.85rem] leading-[1.55] opacity-72">
          {lede}
        </p>
        <div className="flex items-center justify-between gap-3 font-mono text-chip tracking-chip uppercase opacity-60">
          <span>{client}</span>
          <span className="inline-flex items-center gap-1.5">
            {year}
            <UiIcon name="arrow-up-right" size={13} />
          </span>
        </div>
      </div>
    </a>
  );
};

export default HomepageWorkCard;
