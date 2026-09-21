import type { ReactElement } from 'react';

import { Card } from '@portfolio/ui-primitives';

interface ProfileCardProps {
  /** The heading, rendered as an `<h1>`. */
  name: string;
  /** The subtitle line under the name. */
  title: string;
  /** The body copy under the subtitle. */
  description: string;
}

/**
 * The homepage's profile panel (D34 — the live v3 site's name/title/summary
 * card). A wrapper rather than direct `Card` consumption because it bakes in
 * project-specific defaults `Card` itself does not know about — the specific
 * three-field layout and heading levels this page always renders
 * (D40 — a wrapper earns its place by attaching behavior, not by re-exporting).
 */
const ProfileCard = ({ name, title, description }: ProfileCardProps): ReactElement => {
  return (
    <Card>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{name}</h1>
      <p className="mt-2 text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-6 max-w-prose text-sm leading-relaxed text-slate-500">{description}</p>
    </Card>
  );
};

export default ProfileCard;
