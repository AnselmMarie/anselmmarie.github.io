import type { HomepageContent } from '@portfolio/shared-types';

import { SITE_SECTIONS } from './site-sections.fixture.js';

/**
 * 🧭 **OWNER: Slice 6 (Homepage).** Created by the coordinator in Slice 4 as
 * the named landing spot for the homepage's content, so Slice 6 and Slice 7 —
 * concurrent agents co-owning this package — never open the same file.
 * Slice 7 must not add to this module.
 *
 * ⚠️ **A seed, not content.** Slice 6 ports the real copy from commit
 * `39bbe56` per D53: the nine portfolio items, the three skill lists, and the
 * intro. Never from the local `master` branch, which silently omits the
 * Pokémon Pet Shop item.
 */
export const HOMEPAGE_CONTENT: HomepageContent = {
  sections: SITE_SECTIONS,
};
