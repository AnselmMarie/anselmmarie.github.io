/**
 * Joins a site origin and a route path into the absolute URL Open Graph tags
 * require (D48). `og:url` and `og:image` are ignored by every crawler when
 * they are relative, which is the failure this exists to prevent.
 *
 * Kept here rather than in the shell because the Slice 7 route builds the same
 * URL for `/portfolio/$slug`, so it already has the second consumer that
 * file-size.md's extraction threshold asks for.
 */
export const absoluteUrl = (origin: string, path: string): string => {
  const trimmedOrigin = origin.replace(/\/+$/, '');
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedOrigin}${trimmedPath}`;
};
