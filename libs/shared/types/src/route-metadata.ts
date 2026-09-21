/**
 * What the shell emits server-side, per route, into `<head>` (D48).
 *
 * ⚠️ This is metadata, not content. D36 keeps every visible surface federated
 * and client-rendered; D48 recovers only the link preview, which the shell can
 * emit because it owns the route and reads the fixtures at build time.
 */
export interface RouteMetadata {
  readonly title: string;
  readonly description: string;
  /** Path relative to the site origin, e.g. `/portfolio/pokemon-pet-shop`. */
  readonly path: string;
  /** Absolute or origin-relative URL of the Open Graph image, when one exists. */
  readonly imageUrl?: string;
}
