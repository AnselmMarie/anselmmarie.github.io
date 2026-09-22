import type { ReactElement } from 'react';

import { useHomepageContent } from '@portfolio/shared-fixtures';
import type { HomepageContent } from '@portfolio/shared-types';

interface HomepageProps {
  /**
   * D15 — the homepage never fetches its own content; it receives it. The
   * default reads the one fixture seam so the remote also runs standalone.
   */
  content?: HomepageContent;
}

/**
 * 🧭 **OWNER: Slice 6. This is a placeholder — replace the body, keep the file.**
 *
 * Scaffolded by Slice 4 so the remote is runnable end to end: `nx dev homepage`
 * serves it standalone on 4176, and the shell loads it over Module Federation.
 * Slice 6 ports the real sections from commit `39bbe56` (D53).
 *
 * ⚠️ **The section `id`s are already correct and are a contract (D43).** They
 * come from `SITE_SECTIONS`, which the Header remote and the shell's header
 * fallback both read. Slice 6 fills these sections with content; it must not
 * rename their ids without changing the fixture all three read.
 *
 * ⚠️ **`scroll-mt-header` is the other half of D43** — the header is fixed, so
 * a section scrolled to by anchor would otherwise sit underneath it. The value
 * is the `--spacing-header` token from the shared theme (D26), which is how two
 * separate remotes agree on it at build time instead of across the federation
 * boundary.
 */
const Homepage = ({ content }: HomepageProps): ReactElement => {
  // ⚠️ **Called unconditionally, never inside the `??`.** `useHomepageContent`
  // reads a fixture today and calls no React hook, so `content ?? useHomepageContent()`
  // would work — right up until the Contentful plan gives it a real hook body,
  // at which point the call order changes with the prop and React breaks. The
  // seam only pays off if every consumer treats it as a hook from the first
  // line written against it.
  const fixtureContent = useHomepageContent();
  const resolved = content ?? fixtureContent;

  return (
    <div data-testid="homepage-remote" className="flex flex-col gap-12">
      {resolved.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-header">
          <h2 className="text-xl font-semibold text-ink">{section.label}</h2>
          <p className="mt-2 text-sm text-slate-500">
            homepage remote — Slice 6 fills this section
          </p>
        </section>
      ))}
    </div>
  );
};

export default Homepage;
