import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconExternalLink,
  IconMessageCircle,
  IconMinus,
  IconPlus,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import type { ReactElement } from 'react';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'external'
  | 'message-circle'
  | 'minus'
  | 'plus'
  | 'send'
  | 'x';

interface IconProps {
  name: IconName;
  /** Edge length in px. The design draws these between 13 and 19, and the chat launcher's at 26. */
  size?: number;
  className?: string;
}

const ICONS = {
  'arrow-left': IconArrowLeft,
  'arrow-right': IconArrowRight,
  'arrow-up-right': IconArrowUpRight,
  external: IconExternalLink,
  'message-circle': IconMessageCircle,
  minus: IconMinus,
  plus: IconPlus,
  send: IconSend,
  x: IconX,
} as const;

/**
 * The non-brand marks the design draws — the four arrows and the external-link
 * glyph, as `ti-arrow-*` / `ti-external-link` in the exports.
 *
 * ⚠️ **The sixth shared component, and `libs/ui/components` is closed to every
 * agent in the redesign wave.** It is added here by the coordinator, ahead of
 * the wave, precisely so that no wave slice has to stop and ask for it: Slice
 * 12 needs `arrow-up-right` in the mobile overlay and `arrow-left` in the
 * detail bar, Slice 13 needs `arrow-right` on the hero CTA and
 * `arrow-up-right` on every Work card, Slice 14 needs `plus`/`minus` on the
 * Experience accordion, and Slice 15 needs `external` on the link pills. Four
 * slices, one component — which is D29's threshold several times over.
 *
 * ⚠️ **`plus`/`minus` are here rather than imported from `@tabler/icons-react`
 * in the homepage lib**, which would have meant a second package taking the
 * icon dependency and two places deciding what an icon looks like.
 *
 * ⚠️ **Decorative on purpose: `aria-hidden`, and it carries no label** — the
 * same contract as {@link SocialIcon}. The accessible name belongs to the
 * element around it, so a link reads once rather than twice. A caller that
 * renders this as the *only* content of a link ships an unlabelled link.
 *
 * ⚠️ **`message-circle`, `send` and `x` are the AI chat's** (ai-chat D17): the
 * launcher, the composer's send button and the drawer's close button. All three
 * sit inside an `IconButton`, which carries the accessible name.
 *
 * Tabler rather than v3's Radix set, per D75 — this extends that decision to
 * the non-brand marks rather than introducing a second icon library.
 */
const Icon = ({ name, size = 16, className }: IconProps): ReactElement => {
  const Glyph = ICONS[name];

  return <Glyph aria-hidden focusable={false} size={size} stroke={1.5} className={className} />;
};

export default Icon;
