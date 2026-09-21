/**
 * The federated modules the shell mounts. Module Federation resolves these at
 * runtime, so TypeScript has nothing to walk to — the declaration is what
 * keeps the `import('header/Header')` below type-checked rather than `any`.
 *
 * ⚠️ **The specifier is a three-way contract** between `apps/header`'s
 * `exposes` map, `REMOTE_REGISTRY.header.exposedModule`, and this line. All
 * three are strings; none of them checks the others.
 */
declare module 'header/Header' {
  import type { ComponentType } from 'react';

  const Header: ComponentType<{ pathname?: string }>;
  export default Header;
}
