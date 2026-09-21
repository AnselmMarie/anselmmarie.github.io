import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

import { ShellLayout } from '@portfolio/feature-shell';
import { HOME_METADATA } from '@portfolio/shared-fixtures';

import HeaderRemote from '../remotes/header-remote.js';

/**
 * D27 — the route mounts a component from `@portfolio/feature-shell` and holds
 * nothing of its own. If a component appears in this file, the slice has broken
 * the rule it was written to establish by example.
 *
 * The `head` is the D48 metadata source: it is emitted server-side even though
 * every visible surface below it will be client-rendered by a remote.
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
  return <ShellLayout header={<HeaderRemote />} />;
}
