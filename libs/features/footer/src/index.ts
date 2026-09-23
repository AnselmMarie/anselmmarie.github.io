/**
 * 🧭 **OWNER: Slice 5 (Footer).**
 *
 * D27 — the remote's `exposes` map points at this package's default export, so
 * the Footer is also the module the shell mounts.
 */
export { default as Footer, default } from './footer/footer.js';
export { default as FooterSocialLinkItem } from './footer/footer-social-link.js';
export type { FooterSocialLink } from './footer/footer-social-links.const.js';
export { FOOTER_SOCIAL_LINKS, FOOTER_TAGLINE } from './footer/footer-social-links.const.js';
