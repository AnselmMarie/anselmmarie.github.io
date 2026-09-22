import type { ReactElement } from 'react';

import { SITE_NAME, SITE_SECTIONS } from '@portfolio/shared-fixtures';

/**
 * The header's fallback: a minimal local header that keeps the site navigable
 * (the architecture doc's *Fallback Strategy by MFE* → Header).
 *
 * ⚠️ **Invented visual treatment**, like every fallback in this slice. What is
 * *not* invented is the link set: it reads `SITE_SECTIONS` from
 * `@portfolio/shared-fixtures`, the same module the Header remote reads. That
 * is deliberate — a hardcoded copy of the section ids here would drift from
 * the remote's and from the Homepage's silently, and no spec in this project
 * could catch it, because the boundary rules forbid the shell from importing
 * the Header to compare against.
 *
 * ⚠️ **No retry action.** The header is chrome: offering to reload it pulls
 * attention to the one part of the page the visitor did not come for. The
 * page-level fallbacks carry the retry instead.
 */
const HeaderFallback = (): ReactElement => {
  return (
    <div
      data-testid="mfe-fallback-header"
      className="flex h-header w-full items-center justify-between gap-6"
    >
      <a href="/" className="text-base font-semibold tracking-tight text-ink">
        {SITE_NAME}
      </a>
      <nav aria-label="Sections">
        <ul className="flex items-center gap-4">
          {SITE_SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`/#${section.id}`} className="text-sm text-slate-500">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderFallback;
