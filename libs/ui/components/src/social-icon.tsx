import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import type { ReactElement } from 'react';

import type { SocialIconName } from '@portfolio/shared-types';

interface SocialIconProps {
  name: SocialIconName;
  /** Edge length in px. v3 drew these at 30. */
  size?: number;
  className?: string;
}

const ICONS = {
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
} as const;

/**
 * A brand mark for one outbound social link.
 *
 * Lives in `libs/ui/components` because **two feature libs render it** — the
 * footer and the homepage hero — which is D29's extraction threshold exactly.
 *
 * ⚠️ **Decorative on purpose: `aria-hidden`, and it carries no label.** The
 * accessible name belongs to the anchor around it, so a link reads once rather
 * than twice. A caller that renders this *without* an accessible name on the
 * wrapping element ships an unlabelled link.
 *
 * Tabler rather than v3's Radix set — the maintainer's call, 2026-09-21 (D75).
 * The marks are equivalent; the library is not the one v3 used.
 */
const SocialIcon = ({ name, size = 30, className }: SocialIconProps): ReactElement => {
  const Icon = ICONS[name];

  return <Icon aria-hidden focusable={false} size={size} stroke={1.5} className={className} />;
};

export default SocialIcon;
