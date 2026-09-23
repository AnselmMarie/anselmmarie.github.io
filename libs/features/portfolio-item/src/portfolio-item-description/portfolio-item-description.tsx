import type { ReactElement } from 'react';

import { sanitizeItemHtml } from '../sanitize-item-html/sanitize-item-html.js';

interface PortfolioItemDescriptionProps {
  /** The item's `description` — an HTML string (D69), sanitized here. */
  html: string;
}

/**
 * The item's body. The one place in the workspace that writes HTML into the
 * DOM, which is why sanitizing lives at this boundary rather than at the
 * fixture (D69).
 *
 * ⚠️ **`dangerouslySetInnerHTML` is correct here and only here.** The string
 * passed to it has been through `sanitizeItemHtml`, whose allow-list is four
 * tags and three attributes. Rendering the raw `description` — what v3 did — is
 * the thing D69 declined, because the Contentful plan makes this field
 * editor-supplied without touching this component.
 */
const PortfolioItemDescription = ({ html }: PortfolioItemDescriptionProps): ReactElement => {
  return (
    <div
      data-testid="portfolio-item-description"
      className="max-w-prose text-sm leading-relaxed text-slate-600 [&_a]:text-slate-900 [&_a]:underline [&_li]:list-disc [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: D69 — the string is
      // sanitized by `sanitizeItemHtml` immediately above, against an allow-list
      // derived from the eight ported bodies.
      dangerouslySetInnerHTML={{ __html: sanitizeItemHtml(html) }}
    />
  );
};

export default PortfolioItemDescription;
