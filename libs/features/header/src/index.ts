export { anchorHref, HOME_PATH } from './anchor-href.js';
// D27 — the remote's `exposes` map points at this package's default export,
// so the Header is also the module the shell mounts.
export { default as Header, default } from './header.js';
export { default as HeaderNav } from './header-nav.js';
export { default as HeaderNavLink } from './header-nav-link.js';
export type { HeaderSection } from './header-sections.const.js';
export { HEADER_SECTIONS } from './header-sections.const.js';
