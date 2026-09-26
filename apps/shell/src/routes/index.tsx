import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { ShellLayout } from '@portfolio/feature-shell';
import { HOME_METADATA } from '@portfolio/shared-fixtures';

import FooterRemote from '../remotes/footer-remote.js';
import HeaderRemote from '../remotes/header-remote.js';
import HomepageRemote from '../remotes/homepage-remote.js';

/**
 * D27 — the route mounts a component from `@portfolio/feature-shell` and holds
 * nothing of its own. If a component appears in this file, the slice has broken
 * the rule it was written to establish by example.
 *
 * The `head` is the D48 metadata source: it is emitted server-side even though
 * every visible surface below it is client-rendered by a remote.
 *
 * ⚠️ **All three mounts are here as of Slice 4, and two of their remotes do not
 * exist.** This file is a seam: slices 5 and 6 would otherwise both edit it
 * while running concurrently. Each of them builds its remote and touches
 * nothing here.
 */
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: HOME_METADATA.title },
      { name: 'description', content: HOME_METADATA.description },
    ],
  }),
  component: HomeRoute,
});

function HomeRoute(): ReactElement {
  return (
    <ShellLayout header={<HeaderRemote variant="home" />} footer={<FooterRemote />}>
      <HomepageRemote />
    </ShellLayout>
  );
}
