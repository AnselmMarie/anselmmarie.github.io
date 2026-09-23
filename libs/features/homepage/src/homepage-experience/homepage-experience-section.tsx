import { type ReactElement, useState } from 'react';

import type { ExperienceEntry, PanelNote, SectionIntro } from '@portfolio/shared-types';
import { SectionHeading } from '@portfolio/ui-components';

import HomepageExperienceEntry from './homepage-experience-entry.js';
import HomepageFootnotes from './homepage-footnotes.js';

interface HomepageExperienceSectionProps {
  sectionId: string;
  intro: SectionIntro;
  entries: readonly ExperienceEntry[];
  footnotes: readonly PanelNote[];
}

/** No row open. The export spells this `-1`; a nullable id says the same thing. */
const NONE_OPEN = null;

/**
 * The Experience accordion.
 *
 * ⚠️ **One open at a time, and the first is open on load** — the export's
 * `state = { open: 0 }`, and toggling the open row sets `-1`. A
 * closed-by-default accordion reads as an empty section, which is why the
 * initial open is part of the behaviour rather than a detail.
 *
 * ⚠️ **Keyed by `entry.id`, never by index or company.** `Cricket Wireless`
 * appears twice — 2013–2019 and 2020–2023 — so a company-keyed accordion opens
 * both rows at once.
 */
const HomepageExperienceSection = ({
  sectionId,
  intro,
  entries,
  footnotes,
}: HomepageExperienceSectionProps): ReactElement => {
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? NONE_OPEN);

  return (
    <section
      id={sectionId}
      className="scroll-mt-anchor border-t border-rule px-page py-10 frame:py-16"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-[18px]">
        <SectionHeading
          eyebrow={intro.eyebrow}
          heading={intro.heading.lead}
          accentPhrase={intro.heading.accent}
        />
        {intro.aside === '' ? null : (
          <span className="font-mono text-eyebrow tracking-eyebrow uppercase text-muted">
            {intro.aside}
          </span>
        )}
      </div>

      <div className="border-t border-rule">
        {entries.map((entry) => (
          <HomepageExperienceEntry
            key={entry.id}
            entry={entry}
            panelId={`experience-${entry.id}`}
            isOpen={openId === entry.id}
            onToggle={() => setOpenId((current) => (current === entry.id ? NONE_OPEN : entry.id))}
          />
        ))}
      </div>

      <HomepageFootnotes notes={footnotes} />
    </section>
  );
};

export default HomepageExperienceSection;
