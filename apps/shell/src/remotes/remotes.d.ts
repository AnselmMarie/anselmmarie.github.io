/**
 * The federated modules the shell mounts. Module Federation resolves these at
 * runtime, so TypeScript has nothing to walk to — these declarations are what
 * keep each `import('<remote>/<Module>')` type-checked rather than `any`.
 *
 * ⚠️ **Each specifier is a three-way contract** between the remote app's
 * `exposes` map, `REMOTE_REGISTRY.<name>.exposedModule`, and the line here. All
 * three are strings; none of them checks the others.
 *
 * ⚠️ **Three of the four remotes do not exist yet.** Slice 4 declares them so
 * the shell's mount points and route tree — the seam three concurrent agents
 * would otherwise all edit — are in place before the wave starts. Until each
 * slice builds its remote, the import fails at runtime and the boundary renders
 * that remote's fallback, which is the same path a downed remote takes.
 */
declare module 'header/Header' {
  import type { ComponentType } from 'react';

  const Header: ComponentType<{ pathname?: string }>;
  export default Header;
}

declare module 'footer/Footer' {
  import type { ComponentType } from 'react';

  const Footer: ComponentType;
  export default Footer;
}

declare module 'homepage/Homepage' {
  import type { ComponentType } from 'react';

  import type { HomepageContent } from '@portfolio/shared-types';

  const Homepage: ComponentType<{ content?: HomepageContent }>;
  export default Homepage;
}

declare module 'portfolio-item/PortfolioItem' {
  import type { ComponentType } from 'react';

  import type { PortfolioItem as PortfolioItemModel } from '@portfolio/shared-types';

  const PortfolioItem: ComponentType<{ item?: PortfolioItemModel }>;
  export default PortfolioItem;
}
