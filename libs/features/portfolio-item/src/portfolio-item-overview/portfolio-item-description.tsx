import type { ReactElement } from 'react';

import { Eyebrow } from '@portfolio/ui-components';

import { sanitizeItemHtml } from './sanitize-item-html.js';

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
 *
 * ⚠️ **INVENTED — the design draws no container for this block (D78).** It
 * sits under the summary in the overview's right column, behind a rule and a
 * `| Details` eyebrow, at the summary body's measure (62ch) and type (0.97rem /
 * 1.8, muted). Lists take a disc marker; links are ink, underlined, and turn
 * accent on hover. Each of those is a call made here, not read off the export.
 */
const PortfolioItemDescription = ({ html }: PortfolioItemDescriptionProps): ReactElement => {
  return (
    <div className="mt-10 flex max-w-[62ch] flex-col gap-4 border-t border-rule pt-6">
      <Eyebrow label="Details" hasRule />
      <div
        data-testid="portfolio-item-description"
        className="text-[0.97rem] leading-[1.8] text-muted [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:pl-5"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: D69 — the string is
        // sanitized by `sanitizeItemHtml` immediately above, against an allow-list
        // derived from the eight ported bodies.
        dangerouslySetInnerHTML={{ __html: sanitizeItemHtml(html) }}
      />
    </div>
  );
};

export default PortfolioItemDescription;
