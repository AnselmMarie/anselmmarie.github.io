import type { ReactElement } from 'react';

import type { PanelNote } from '@portfolio/shared-types';
import { Eyebrow, PanelCard } from '@portfolio/ui-components';

interface HomepageFootnotesProps {
  notes: readonly PanelNote[];
}

/** The award and the degree, below the Experience list. */
const HomepageFootnotes = ({ notes }: HomepageFootnotesProps): ReactElement => {
  return (
    <div className="mt-8 grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {notes.map((note) => (
        <PanelCard key={note.key}>
          <Eyebrow label={note.key} tone="accent" hasRule={false} />
          <p className="mb-[0.35rem] mt-[0.6rem] font-display text-[1.15rem] font-bold tracking-[-0.01em] text-ink">
            {note.title}
          </p>
          <p className="m-0 text-[0.85rem] leading-[1.55] text-muted">{note.detail}</p>
        </PanelCard>
      ))}
    </div>
  );
};

export default HomepageFootnotes;
