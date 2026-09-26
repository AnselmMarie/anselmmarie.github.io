import type { PortfolioItem } from '@portfolio/shared-types';

/**
 * The factory behind every placeholder item in
 * `portfolio-items-upcoming.fixture.ts`. Split out of that module only to keep
 * it under the 200-line source cap.
 *
 * - `images` and `links` are empty, and `facts`, `body` and `description`
 *   are blank unless the maintainer has supplied them. `thumbnail` is empty
 *   so the detail route emits no `og:image`.
 */
export interface PlaceholderInput {
  slug: string;
  title: string;
  company: string;
  /** The card's stack line reads the first three. */
  tech: readonly string[];
  year: string;
  /** The card's summary line. */
  lede: string;
  /** Timeline, Role and Focus. Blank rows until authored. */
  facts?: PortfolioItem['facts'];
  /** The Summary column's plain paragraphs. Empty until authored. */
  body?: PortfolioItem['body'];
  /** The Details block's HTML. "Coming soon" until authored. */
  description?: string;
}

// Every detail page draws the same three rows, blank until authored.
const BLANK_FACTS: PortfolioItem['facts'] = [
  { key: 'Timeline', value: '' },
  { key: 'Role', value: '' },
  { key: 'Focus', value: '' },
];

export const placeholder = ({
  slug,
  title,
  company,
  tech,
  year,
  lede,
  facts = BLANK_FACTS,
  body = [],
  description = '<p>Details coming soon.</p>',
}: PlaceholderInput): PortfolioItem => ({
  slug,
  title,
  company,
  subtitle: '',
  thumbnail: '',
  description,
  images: [],
  videos: [],
  year,
  role: '',
  lede,
  body,
  tech,
  facts,
  links: [],
});
