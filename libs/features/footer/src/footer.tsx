import type { ReactElement } from 'react';

import { SITE_NAME } from '@portfolio/shared-fixtures';

/**
 * 🧭 **OWNER: Slice 5. This is a placeholder — replace the body, keep the file.**
 *
 * Scaffolded by Slice 4 so the remote is runnable end to end: `nx dev footer`
 * serves it standalone on 4175, and the shell loads it over Module Federation.
 * The wiring around it is finished — the `exposes` map, the registry row, the
 * shell's mount and its boundary all work today. What is missing is the footer
 * itself, which Slice 5 ports from the live v3 site (D34).
 *
 * ⚠️ **The `data-testid` is deliberately `footer-remote`, matching the Header's
 * convention.** It is what distinguishes "the real remote rendered" from "the
 * shell-owned fallback rendered" on the composed page, and Slice 9's E2E
 * assertions depend on the distinction.
 */
const Footer = (): ReactElement => {
  return (
    <div data-testid="footer-remote" className="flex w-full items-center justify-between gap-6">
      <span className="text-sm text-slate-500">
        © {new Date().getFullYear()} {SITE_NAME}
      </span>
      <span className="text-xs tracking-wide text-slate-400">
        footer remote — Slice 5 fills this
      </span>
    </div>
  );
};

export default Footer;
