import type { SocialIconName } from '@portfolio/shared-types';

export interface FooterSocialLink {
  /** Stable key, and the value the spec addresses a row by. */
  id: string;
  label: string;
  href: string;
  icon: SocialIconName;
}

/**
 * 🧭 **OWNER: Slice 5 (Footer).**
 *
 * The footer's outbound links.
 *
 * ⚠️ **The URLs are real v3 content; the placement is not.** The live v3 site
 * has no footer at all (verified against commit `39bbe56` — there is no
 * `<footer>` element and no footer component anywhere under `src/`), so D34's
 * "match the live v3 site's footer" has nothing to match. These two URLs are
 * ported verbatim from v3's hero section, which is the only place v3 links out
 * to anything. Moving them into a footer is this slice's invention, flagged per
 * plan-design-links.md — the same call Slice 3 made for the header's nav
 * labels, and for the same reason.
 *
 * ✅ **These render as icons.** v3 drew them as Radix marks at 30×30; the
 * maintainer chose **Tabler** instead (D75), so the marks are equivalent and the
 * library is not v3's. Slice 5 shipped text labels because a wave agent may not
 * add a dependency — that divergence is now closed.
 *
 * Hardcoded here rather than in `libs/shared/fixtures` on D29's threshold:
 * extraction happens at the *second* consumer, and these have exactly one.
 */
export const FOOTER_SOCIAL_LINKS: readonly FooterSocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/anselm-marie/',
    icon: 'linkedin',
  },
  { id: 'github', label: 'GitHub', href: 'https://github.com/AnselmMarie', icon: 'github' },
];
