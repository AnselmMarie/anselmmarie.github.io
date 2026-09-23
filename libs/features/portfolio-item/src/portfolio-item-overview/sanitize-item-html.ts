import DOMPurify from 'dompurify';

/**
 * 🧭 **OWNER: Slice 7.** D69's render boundary: the item's `description` stays
 * an HTML string and is sanitized here, once, on the way into the DOM.
 *
 * ⚠️ **Client-side only, and that is not a shortcut.** D36 keeps the item body
 * out of the SSR HTML, so the browser build is the only place this string is
 * ever turned into DOM. The lib's Vitest environment is `jsdom`, so the specs
 * run the real sanitizer rather than a stub.
 *
 * ⚠️ **The allow-list is derived from what the eight ported bodies actually
 * contain**, not from DOMPurify's defaults — a default-everything config passes
 * every spec here and is explicitly not what D69 asked for. Widen it only when
 * a body needs a tag it does not have, and say so.
 */
export const ALLOWED_TAGS = ['p', 'ul', 'li', 'a'] as const;

/**
 * `target` is allowed because the ported copy uses it; `rel` is allowed because
 * the hook below writes it. No `class`, `style`, `id` or event attributes.
 */
export const ALLOWED_ATTR = ['href', 'target', 'rel'] as const;

/** What every `target="_blank"` link gets, whether or not the copy had it. */
export const EXTERNAL_LINK_REL = 'noopener noreferrer';

/**
 * ⚠️ **The ported copy carries `target="_blank"` without `rel` throughout** —
 * six of the eleven links. Adding the `rel` here makes it a property of the
 * render boundary instead of a thing an author has to remember, which is the
 * whole reason D69 asked for it to be asserted in a spec rather than reviewed.
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', EXTERNAL_LINK_REL);
  }
});

/**
 * Sanitizes one item body against the allow-list above.
 *
 * Returns a plain string rather than a `TrustedHTML` object so the caller's
 * `dangerouslySetInnerHTML` stays a one-liner; `RETURN_TRUSTED_TYPE` is off for
 * the same reason.
 */
export const sanitizeItemHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...ALLOWED_ATTR],
  });
