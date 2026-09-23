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
 * The shell's placeholder panel — what the content region renders when no
 * remote has been passed to it.
 *
 * A wrapper rather than direct `Card` consumption because it bakes in
 * project-specific defaults `Card` itself does not know about — the specific
 * three-field layout and heading levels this page always renders
 * (D40 — a wrapper earns its place by attaching behavior, not by re-exporting).
 *
 * ⚠️ **Slice 10 re-skins it from here, not from the primitive.** `Card` still
 * carries the v3 look (`bg-page`, `border-slate-200`) and D25 forbids
 * hand-editing generated output, so the new palette arrives as a `className`
 * the primitive merges. That merge is `cn`'s whole job (D56): `bg-page` is
 * dropped rather than left to fight `bg-surface` on stylesheet order.
 *
 * ⚠️ **`bg-page` is now a dead token** — Slice 10 retired `--color-page`, so
 * the class the primitive names no longer generates anything. It is harmless
 * *because* this wrapper overrides it, and it is the primitive's only
 * consumer. Reported rather than fixed: D25 makes it the maintainer's call.
 */
const ProfileCard = ({ name, title, description }: ProfileCardProps): ReactElement => {
  return (
    <Card className="rounded-card border-rule bg-surface p-8 shadow-none">
      <h1 className="font-display text-section font-bold text-ink">{name}</h1>
      <p className="mt-3 text-sm font-medium text-muted">{title}</p>
      <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted">{description}</p>
    </Card>
  );
};

export default ProfileCard;
