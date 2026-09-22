import type { ReactElement } from 'react';

interface HomepageProjectCardProps {
  slug: string;
  title: string;
  /** The tile image. Arrives in the payload; never composed here (D42). */
  thumbnail: string;
}

/**
 * One tile in a portfolio listing — v3's `project-grid.view.tsx` at `39bbe56`.
 *
 * ✅ **The thumbnail landed once Slice 7's field existed** (D72). While the wave
 * ran, `PortfolioItem` carried only `slug` and `title` — it is Slice 7's module
 * and was closed to Slice 6 — so the tile shipped title-only rather than
 * declaring an optional prop no parent could supply, which would have been an
 * unwired prop invisible to every component-level spec
 * (spec-through-the-parent.md). Per D42 the URL arrives in the payload; this
 * component never composes one.
 *
 * The link is a plain `<a>` on purpose: this is a federated remote and must not
 * import the shell's router.
 */
const HomepageProjectCard = ({
  slug,
  title,
  thumbnail,
}: HomepageProjectCardProps): ReactElement => {
  return (
    <div className="mb-10 text-center opacity-75 hover:opacity-90 hover:drop-shadow-2xl hover:transition-all">
      <a href={`/portfolio/${slug}`}>
        <img
          src={thumbnail}
          alt=""
          loading="lazy"
          className="mx-auto mb-3 w-full max-w-md rounded-lg"
        />
        <span className="font-bold">{title}</span>
      </a>
    </div>
  );
};

export default HomepageProjectCard;
