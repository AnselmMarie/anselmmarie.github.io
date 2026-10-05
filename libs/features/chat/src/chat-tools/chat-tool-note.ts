import type { ChatToolCall } from '@portfolio/shared-chat-contract';
import { portfolioItemBySlug, SITE_SECTIONS } from '@portfolio/shared-fixtures';

/**
 * The words in the note under a reply that moved the page ("→ WORK"): the
 * section's nav label or the project's title. Invented (ai-chat design.md, not
 * drawn); the note is rendered in mono caps, so the casing here doesn't matter.
 */
export const chatToolNote = (call: ChatToolCall): string => {
  if (call.name === 'navigate') return portfolioItemBySlug(call.slug)?.title ?? call.slug;

  return SITE_SECTIONS.find((section) => section.id === call.sectionId)?.label ?? call.sectionId;
};
