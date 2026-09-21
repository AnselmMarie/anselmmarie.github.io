/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** Created by the coordinator in Slice 4
 * so that Slice 6 and Slice 7 — which run concurrently and co-own this package
 * — never open the same file. Slice 6 must not add to this module.
 *
 * ⚠️ **Deliberately minimal, and not the finished shape.** `slug` and `title`
 * are the two fields `use-content-stub.ts` needs to be typed. The real shape is
 * ported in Slice 7 from v3's `src/store/{active,other}.data.ts` at commit
 * `39bbe56` (D53), including `thumbnail`, `images[]` and `videos[]`.
 *
 * ⚠️ **No `description` field, on purpose.** Q17 blocks this slice harder than
 * any other — the item body *is* the description HTML — so the field's type is
 * Slice 7's to settle once the question closes, not the coordinator's to
 * pre-empt.
 *
 * ⚠️ **The slug is the `id` from v3's data, unchanged.** The image folder names
 * do not match the slugs (`cricket-wireless` holds `cw-breeze-thru`'s images);
 * the data's own path strings are authoritative.
 */
export interface PortfolioItem {
  /** The `/portfolio/$slug` segment. v3's `id`, carried over unchanged. */
  readonly slug: string;
  readonly title: string;
}
