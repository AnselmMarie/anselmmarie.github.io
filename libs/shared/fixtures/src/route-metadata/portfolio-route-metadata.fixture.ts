import type { RouteMetadata } from '@portfolio/shared-types';

import { PORTFOLIO_ITEMS } from '../portfolio-items/portfolio-items.fixture.js';

/**
 * 🧭 **OWNER: Slice 7 (Portfolio Item).** The per-slug `head` copy D48 was
 * taken for — `/portfolio/$slug` is the link people actually share.
 *
 * ⚠️ **These descriptions are authored plain text and are NOT derived from the
 * item's `description`.** That field is HTML (D69) and stripping tags from it
 * would run the sanitizer server-side for no reason and produce meta copy
 * nobody wrote. When an item's copy changes, this line changes by hand.
 *
 * The `imageUrl` is the item's own `thumbnail`, read from the data rather than
 * composed from the slug — the image folders do not match the slugs.
 */
const DESCRIPTION_BY_SLUG: Readonly<Record<string, string>> = {
  // ⚠️ Placeholders (2026-09-23) — replace with the real copy with the item.
  'micro-frontend-update': 'Micro Frontend Architecture Migration — details coming soon.',
  'prototype-company-division': 'From Prototype to New Company Division — details coming soon.',
  'pokemon-pet-shop':
    'A web, native and API codebase built to share as much as possible without giving up ' +
    'what each platform does well. React, Expo, Nativewind and design tokens.',
  cosmikata:
    'A ground-up rebuild of the Cosmikata cosplay planner across web, mobile and backend — ' +
    'React Native Web, Expo, Node.js, PostgreSQL and an Nx monorepo.',
  'older-cosmikata':
    'The first version of the Cosmikata cosplay planner — a solo React Native and GraphQL ' +
    'app for organising cosplay projects, with a walkthrough on video.',
  'csp-generator-app':
    'A React, TypeScript and Redux tool for assembling a Content Security Policy: import an ' +
    'existing policy, extend it, and generate the header.',
  'cw-breeze-thru':
    'Cricket Wireless Breeze-Thru — activating service on any device. Front-end lead from ' +
    'concept through launch, and an AT&T Service Excellence Award.',
  'rove-logix':
    'A SaaS platform for land surveying, engineering and geospatial firms — design across ' +
    'the client app, the emails and the marketing site, plus development.',
  'rove-logix-ui-update':
    'A redesign of the Rove Logix app for cleaner contrast and a more modern palette, ' +
    'visible today in the product emails.',
  'cr-caterpillar':
    'The Caterpillar Inc. news app for iPhone and Android — live CAT stock prices, news, ' +
    'video and downloadable reports.',
};

export const PORTFOLIO_ITEM_METADATA: readonly RouteMetadata[] = PORTFOLIO_ITEMS.map((item) => ({
  title: item.title,
  description: DESCRIPTION_BY_SLUG[item.slug] ?? '',
  path: `/portfolio/${item.slug}`,
  imageUrl: item.thumbnail,
}));
