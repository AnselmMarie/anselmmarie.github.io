import type { ChangeEvent, ReactElement } from 'react';

import { cn } from '@portfolio/shared-utils';
import { Input } from '@portfolio/ui-primitives';

interface PillInputProps {
  value: string;
  /** The accessible name. The design draws no visible label, only a placeholder. */
  label: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  onValueChange: (value: string) => void;
}

/**
 * The chat composer's 44px pill (ai-chat D17), over the generated `Input`.
 *
 * ⚠️ **`bg-white` is the one raw palette class in the chat**, allowed by
 * design-system.md because no theme token carries #FFFFFF. The generated
 * focus ring is replaced by the design's plain `accent` border.
 */
const PILL =
  'h-11 rounded-pill border-rule bg-white px-4 font-body text-[0.92rem] text-ink shadow-none placeholder:text-muted focus-visible:border-accent focus-visible:ring-0 md:text-[0.92rem]';

const PillInput = ({
  value,
  label,
  placeholder,
  maxLength,
  className,
  onValueChange,
}: PillInputProps): ReactElement => {
  return (
    <Input
      type="text"
      value={value}
      aria-label={label}
      placeholder={placeholder}
      maxLength={maxLength}
      className={cn(PILL, className)}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onValueChange(event.target.value)}
    />
  );
};

export default PillInput;
