import type { HomepageContent, PortfolioItem } from '@portfolio/shared-types';

/**
 * The fixtures, written out as the plain text the model reads (ai-chat D4: no
 * RAG, the whole corpus fits in the prompt).
 *
 * ⚠️ **`PortfolioItem.description` is left out on purpose.** It is HTML meant
 * for one sanitized render boundary (D69); the plain `lede` and `body` say the
 * same thing in a form the model can quote without leaking markup.
 */
const bullets = (lines: readonly string[]): string => lines.map((line) => `- ${line}`).join('\n');

export const describeProfile = (content: HomepageContent): string =>
  [
    `Name: ${content.hero.name}`,
    `Summary: ${content.hero.lede}`,
    `Highlights: ${content.specs.join(' · ')}`,
    `About: ${content.about.statement} ${content.about.paragraphs.join(' ')}`,
  ].join('\n');

export const describeExperience = (content: HomepageContent): string =>
  content.experience
    .map((entry) =>
      [
        `${entry.role}, ${entry.company} (${entry.period}, ${entry.place})`,
        `Stack: ${entry.stack}`,
        bullets(entry.points),
      ].join('\n')
    )
    .join('\n\n');

export const describeSkills = (content: HomepageContent): string =>
  content.skillGroups.map((group) => `${group.heading}: ${group.skills.join(', ')}`).join('\n');

export const describeContact = (content: HomepageContent): string =>
  bullets(content.contact.links.map((link) => `${link.label}: ${link.href}`));

export const describeSections = (content: HomepageContent): string =>
  bullets(content.sections.map((section) => `${section.id}: the ${section.label} section`));

export const describeProject = (item: PortfolioItem): string =>
  [
    `slug: ${item.slug}`,
    `${item.title}, for ${item.company} (${item.year}). Role: ${item.role}`,
    item.lede,
    ...item.body,
    `Tech: ${item.tech.join(', ')}`,
  ].join('\n');
