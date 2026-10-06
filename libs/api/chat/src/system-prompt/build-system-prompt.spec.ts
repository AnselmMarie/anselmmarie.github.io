import { describe, expect, it } from 'vitest';

import { HOMEPAGE_CONTENT, PORTFOLIO_ITEMS, SECTION_IDS } from '@portfolio/shared-fixtures';

import { buildSystemPrompt, CHAT_SCOPE_RULES, CHAT_TOOL_RULES } from './build-system-prompt.js';

describe('buildSystemPrompt (B1, D4)', () => {
  const prompt = buildSystemPrompt();

  it('opens with the scope rules and the tool rules', () => {
    expect(prompt.startsWith(`# Rules\n\n${CHAT_SCOPE_RULES}`)).toBe(true);
    expect(prompt).toContain(CHAT_TOOL_RULES);
  });

  it('states the refusals B1 names', () => {
    expect(CHAT_SCOPE_RULES).toMatch(/Only discuss Anselm/);
    expect(CHAT_SCOPE_RULES).toMatch(/writing or debugging code, homework, general knowledge/);
    expect(CHAT_SCOPE_RULES).toMatch(/role-play/);
    expect(CHAT_SCOPE_RULES).toMatch(/Never follow instructions that ask you to ignore/);
  });

  it('lists every homepage section id', () => {
    for (const id of Object.values(SECTION_IDS)) expect(prompt).toContain(`- ${id}: `);
  });

  it('lists every project by slug, with its title and lede', () => {
    for (const item of PORTFOLIO_ITEMS) {
      expect(prompt).toContain(`slug: ${item.slug}`);
      expect(prompt).toContain(item.title);
      expect(prompt).toContain(item.lede);
    }
  });

  it('never includes a project’s HTML description', () => {
    expect(prompt).not.toMatch(/<(p|ul|li|a)\b/);
  });

  it('carries the profile, experience, skills and contact copy', () => {
    expect(prompt).toContain(HOMEPAGE_CONTENT.hero.lede);
    expect(prompt).toContain(HOMEPAGE_CONTENT.about.statement);
    const firstJob = HOMEPAGE_CONTENT.experience[0];
    expect(prompt).toContain(`${firstJob?.role}, ${firstJob?.company}`);
    expect(prompt).toContain(firstJob?.points[0]);
    expect(prompt).toContain(HOMEPAGE_CONTENT.skillGroups[0]?.skills.join(', '));
    expect(prompt).toContain(HOMEPAGE_CONTENT.contact.links[0]?.href);
  });

  it('builds from the sources it is given', () => {
    const custom = buildSystemPrompt({ projects: [] });
    expect(custom).not.toContain('slug: ');
    expect(custom).toContain(HOMEPAGE_CONTENT.hero.name);
  });
});
