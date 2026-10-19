import { describe, expect, it } from 'vitest';

import { portfolioItemBySlug } from './portfolio-items.fixture.js';
import { COSMIKATA_AI_ENHANCEMENTS } from './portfolio-items-cosmikata-ai.fixture.js';

describe('COSMIKATA_AI_ENHANCEMENTS', () => {
  it('is carried by the cosmikata item', () => {
    expect(portfolioItemBySlug('cosmikata')?.aiEnhancements).toBe(COSMIKATA_AI_ENHANCEMENTS);
  });

  it('shows only shipped work, strongest first, with the planned cards hidden', () => {
    expect(COSMIKATA_AI_ENHANCEMENTS.map(({ title, status }) => [title, status])).toEqual([
      ['Event agent over MCP', 'shipped'],
      ['Release skill with a production gate', 'shipped'],
      ['Figma tokens plugin, built with AI', 'shipped'],
      ['Guardrailed AI development', 'shipped'],
    ]);
  });

  it('gives every card a unique title and a problem, what was built and a result', () => {
    const titles = COSMIKATA_AI_ENHANCEMENTS.map(({ title }) => title);

    expect(new Set(titles).size).toBe(titles.length);
    expect(
      COSMIKATA_AI_ENHANCEMENTS.every(
        ({ problem, built, result }) => problem.length > 0 && built.length > 0 && result.length > 0
      )
    ).toBe(true);
  });

  it('is the only item with enhancements', () => {
    expect(portfolioItemBySlug('cw-breeze-thru')?.aiEnhancements).toBeUndefined();
  });
});
