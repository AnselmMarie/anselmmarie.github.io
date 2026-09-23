import type { ReactElement, ReactNode } from 'react';

interface ShellFooterRegionProps {
  children?: ReactNode;
}

/**
 * The slot the Footer remote mounts into (Slice 5).
 *
 * **Slice 10 re-skinned it** onto the design's ink strip. Like the content
 * sections it runs edge to edge and carries its own padding, so it is clipped
 * to the card's bottom corners by the card's `overflow-hidden` rather than by
 * a radius of its own.
 *
 * [Slice 16](docs/planning/mfe-architecture/slices/16-footer-strip.md) builds
 * the strip's contents.
 */
const ShellFooterRegion = ({ children }: ShellFooterRegionProps): ReactElement => {
  return (
    <footer data-testid="shell-footer-region" className="w-full bg-ink px-page py-6 text-paper">
      {children ?? (
        <span className="font-mono text-eyebrow text-paper/50 uppercase">footer region</span>
      )}
    </footer>
  );
};

export default ShellFooterRegion;
