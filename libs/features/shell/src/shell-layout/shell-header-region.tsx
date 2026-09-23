import type { ReactElement, ReactNode } from 'react';

interface ShellHeaderRegionProps {
  /**
   * What the region renders. Slice 3 passes the Header remote's mount, wrapped
   * in the boundary Slice 4 added.
   */
  children?: ReactNode;
}

/**
 * The slot the Header remote mounts into (D2, Slice 3).
 *
 * **The bar is flush to the top of the viewport** — `inset-x-0 top-0`,
 * full-bleed, square-cornered. ⚠️ **This diverges from the design export**,
 * which floats the nav at the frame's 14px inset with the card's own top
 * radius. The maintainer's call, 2026-09-22; recorded in the plan's
 * design-delta table rather than left as an unexplained difference.
 *
 * Because the bar is full-bleed but the card is not, the inner row repeats the
 * page frame's own measurements — `px-frame`, then `max-w-[1400px]`, then the
 * design's 18px nav padding — so the brand mark lines up with the card's
 * content instead of with the viewport edge.
 *
 * ⚠️ **The bar is `fixed`, so it leaves the flow and the page would slide
 * under it — the spacer below is what holds the content down.** Its 56px is
 * `--spacing-nav`, and it is deliberately *not* the 84px `--spacing-anchor`
 * that offsets a hash-scrolled section (D81): a section heading needs
 * clearance below the bar, not merely to clear it.
 *
 * ⚠️ **This region draws the bar; it does not draw the nav.**
 * [Slice 12](docs/planning/mfe-architecture/slices/12-header-redesign.md) owns
 * the links, the mobile overlay and the `SITE_SECTIONS` contract.
 *
 * ⚠️ **`fixed` on this element is what the Header's mobile overlay positions
 * against, so it is load-bearing twice over.** The overlay is `absolute
 * inset-x-0 top-full`, and `top-full` resolves against the nearest positioned
 * ancestor — a fixed element is positioned, so no `relative` is needed here and
 * adding one would be a second, conflicting position utility on the same class
 * list. The remote renders two divs deep inside the padded row below, so
 * without this the overlay would resolve against the viewport and stop short of
 * both edges. Changing the bar to `sticky` or `static` does not break a build
 * or a spec — it moves a panel.
 */
const ShellHeaderRegion = ({ children }: ShellHeaderRegionProps): ReactElement => {
  return (
    <>
      <header
        data-testid="shell-header-region"
        className="fixed inset-x-0 top-0 z-[60] border-b border-rule bg-paper/92 backdrop-blur-[14px]"
      >
        <div className="px-frame">
          <div className="mx-auto flex max-w-[1400px] items-center px-[18px] py-4">
            {children ?? (
              <span className="font-mono text-eyebrow text-muted uppercase">header region</span>
            )}
          </div>
        </div>
      </header>
      <div aria-hidden className="h-nav shrink-0" />
    </>
  );
};

export default ShellHeaderRegion;
