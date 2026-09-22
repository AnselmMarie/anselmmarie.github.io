import type { SiteSection } from './site-section.js';

/**
 * 🧭 **OWNER: Slice 6 (Homepage).** Created by the coordinator in Slice 4 so
 * that Slice 6 and Slice 7 — which run concurrently and co-own this package —
 * never open the same file. Slice 7 must not add to this module.
 *
 * ⚠️ **Deliberately minimal, and not the finished shape.** The coordinator
 * declares only what `use-content-stub.ts` needs in order to be typed at all.
 * D53 names the real source — v3's `PortfolioDataInter` / `ImagesDataInter` /
 * `VideosDataInter` at commit `39bbe56` — and porting those shapes is Slice 6's
 * work, not something to be guessed at here.
 *
 * ⚠️ **No `description` field, on purpose.** Q17 is still open: every ported
 * description is an HTML string, and whether it lands as raw HTML, sanitized
 * HTML or structured data changes the type. Adding a field now would settle an
 * open question by accident.
 */
export interface HomepageContent {
  /** The sections the Header's anchors point at (D43). */
  readonly sections: readonly SiteSection[];
}
