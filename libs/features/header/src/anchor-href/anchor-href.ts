import { WORK_SECTION_ID } from '@portfolio/shared-fixtures';

/**
 * Builds the `href` for an in-page section link (D43).
 *
 * On the homepage a bare `#id` jumps without touching history. Anywhere else —
 * a `/portfolio/$slug` page — the same fragment would look for a section that
 * is not on the page, so the link has to carry the path too.
 *
 * ⚠️ **This is why the Header needs no router.** Q13 closed as D43 precisely
 * so the Header could stay a leaf component: it reads a pathname it is handed
 * and returns a string. Nothing here imports `@tanstack/react-router`, which
 * is what keeps the shared-dependency set at `react` / `react-dom` /
 * `@portfolio/ui-components` and off a router singleton.
 */
export const HOME_PATH = '/';

export const anchorHref = (sectionId: string, pathname: string): string =>
  pathname === HOME_PATH ? `#${sectionId}` : `${HOME_PATH}#${sectionId}`;

/**
 * Where the detail page's `← All work` link goes: the homepage's Work grid.
 *
 * Absolute on purpose — it is only ever rendered on a `/portfolio/$slug` page,
 * so a bare `#work` would look for a section that is not there.
 */
export const WORK_HREF = `${HOME_PATH}#${WORK_SECTION_ID}`;
