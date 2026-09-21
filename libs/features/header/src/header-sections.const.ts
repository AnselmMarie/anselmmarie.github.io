import { SITE_SECTIONS } from '@portfolio/shared-fixtures';
import type { SiteSection } from '@portfolio/shared-types';

/**
 * The homepage sections the Header links to (D43 — the Header navigates by
 * anchor, not by route: no router singleton, no `onNavigate` prop, no injected
 * `Link`).
 *
 * ⚠️ **The list itself moved to `@portfolio/shared-fixtures` in Slice 4**, and
 * this module is now the Header's name for it. It had one reader when it was
 * declared here; the shell's header fallback is the second, and it cannot
 * import this package — `@nx/enforce-module-boundaries` stops `scope:shell`
 * reaching `scope:header`, and D16 forbids a fallback depending on the remote
 * it stands in for. Copying the ids into the shell instead would have put the
 * contract in two places with nothing able to compare them.
 */
export type HeaderSection = SiteSection;

export const HEADER_SECTIONS: readonly HeaderSection[] = SITE_SECTIONS;
