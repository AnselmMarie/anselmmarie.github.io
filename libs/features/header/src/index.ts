export { anchorHref, HOME_PATH, WORK_HREF } from './anchor-href.js';
// D27 — the remote's `exposes` map points at this package's default export,
// so the Header is also the module the shell mounts.
export { default as Header, default, type HeaderVariant } from './header.js';
export { default as HeaderBackLink } from './header-back-link.js';
export { default as HeaderBrand } from './header-brand.js';
export { default as HeaderMenuOverlay } from './header-menu-overlay.js';
export { default as HeaderMenuToggle } from './header-menu-toggle.js';
export { default as HeaderNav } from './header-nav.js';
export { default as HeaderNavLink } from './header-nav-link.js';
