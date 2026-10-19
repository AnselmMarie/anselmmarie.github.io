import type { ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';
import { Button } from '@portfolio/ui-primitives';

import Icon, { type IconName } from '../icon/icon.js';

/**
 * - `ink`: ink fill, paper mark; hover swaps to a mint fill and an ink mark
 *   (the chat composer's send button).
 * - `ink-accent`: ink fill, mint mark, a lifted shadow and a hover grow (the
 *   chat launcher).
 * - `ghost`: no fill; hover sinks into `surface-sunk` (the drawer's close).
 */
export type IconButtonTone = 'ink' | 'ink-accent' | 'ghost';

/** The three diameters the chat design draws. */
export type IconButtonSize = 36 | 44 | 56;

interface IconButtonProps {
  icon: IconName;
  /** The accessible name. The button has no visible text, so it is required. */
  label: string;
  tone?: IconButtonTone;
  size?: IconButtonSize;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
}

/**
 * ⚠️ The generated `buttonVariants` hover and size classes are overridden by
 * `cn`'s tailwind-merge, the same move `MenuSheet` makes on the sheet panel.
 * `cursor-pointer` is the design's (all three chat buttons draw it); Tailwind
 * 4's preflight resets buttons to `cursor: default`.
 * The shadow is the design's `rgba(14,26,25,.28)`, which is `backdrop` at 28%.
 */
const TONE: Record<IconButtonTone, string> = {
  ink: 'bg-ink text-paper hover:bg-accent-bright hover:text-ink',
  'ink-accent':
    'bg-ink text-accent-bright shadow-[0_8px_24px_color-mix(in_oklab,var(--color-backdrop)_28%,transparent)] transition-transform hover:scale-[1.06] hover:bg-ink hover:text-accent-bright',
  ghost: 'bg-transparent text-ink hover:bg-surface-sunk hover:text-ink',
};

/** The button's diameter, and its mark's edge from the design's rem sizes. */
const SIZE: Record<IconButtonSize, { button: string; icon: string; iconPx: number }> = {
  36: { button: 'size-9', icon: 'size-[18px]', iconPx: 18 },
  44: { button: 'size-11', icon: 'size-[18px]', iconPx: 18 },
  56: { button: 'size-14', icon: 'size-[26px]', iconPx: 26 },
};

/**
 * A round, icon-only button over the generated `Button` primitive (ai-chat
 * D17). The first consumer of that primitive, and it never shows text, so the
 * design-system rule's open question about button-label casing still isn't
 * answered by it.
 */
const IconButton = ({
  icon,
  label,
  tone = 'ink',
  size = 44,
  type = 'button',
  className,
  onClick,
}: IconButtonProps): ReactElement => {
  const sizing = SIZE[size];

  return (
    <Button
      type={type}
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn('cursor-pointer rounded-pill', sizing.button, TONE[tone], className)}
      onClick={onClick}
    >
      <Icon name={icon} size={sizing.iconPx} className={sizing.icon} />
    </Button>
  );
};

export default IconButton;
