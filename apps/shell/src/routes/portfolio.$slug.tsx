import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { PortfolioNotFound, ShellLayout } from '@portfolio/feature-shell';
import { SITE_ORIGIN } from '@portfolio/shared-config';
import { portfolioItemBySlug, SITE_NAME } from '@portfolio/shared-fixtures';
import { absoluteUrl } from '@portfolio/shared-utils';

import FooterRemote from '../remotes/footer-remote.js';
import HeaderRemote from '../remotes/header-remote.js';
import PortfolioItemRemote from '../remotes/portfolio-item-remote.js';

/**
 * The one dynamic route (D4 — routing belongs to the shell).
 *
 * ⚠️ **Created by Slice 4 as a seam, filled in by Slice 7.** The route slot has
 * to exist before the wave starts: `routeTree.gen.ts` is generated from this
 * directory, and three concurrent agents regenerating it is a guaranteed
 * collision.
 *
 * ⚠️ **The item is resolved HERE, before the remote is asked for**, which is
 * what keeps "no such slug" and "the remote is down" apart. The first is a
 * shell-level not-found; the second is the remote's fallback. They look
 * similar and mean opposite things.
 *
 * ⚠️ **D48 — this route's `head` is the one D48 was taken for**, since
 * `/portfolio/$slug` is the link people actually share. Slice 7 supplies the
 * per-item title, description and `og:image` once the fixtures carry them; the
 * site-wide values stand in until it does.
 */
export const Route = createFileRoute('/portfolio/$slug')({
  head: ({ params }) => {
    const item = portfolioItemBySlug(params.slug);
    const title = item ? `${item.title} — ${SITE_NAME}` : `Project — ${SITE_NAME}`;

    return {
      meta: [
        { title },
        { property: 'og:title', content: title },
        { property: 'og:url', content: absoluteUrl(SITE_ORIGIN, `/portfolio/${params.slug}`) },
      ],
    };
  },
  component: PortfolioItemRoute,
});

function PortfolioItemRoute(): ReactElement {
  const { slug } = Route.useParams();
  const item = portfolioItemBySlug(slug);

  return (
    <ShellLayout header={<HeaderRemote />} footer={<FooterRemote />}>
      {item ? <PortfolioItemRemote slug={slug} /> : <PortfolioNotFound slug={slug} />}
    </ShellLayout>
  );
}
