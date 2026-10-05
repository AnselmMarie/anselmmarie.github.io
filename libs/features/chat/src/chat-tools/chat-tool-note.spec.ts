import { describe, expect, it } from 'vitest';

import { chatToolNote } from './chat-tool-note.js';

describe('chatToolNote', () => {
  it('names a section by its nav label', () => {
    expect(chatToolNote({ name: 'scroll_to', sectionId: 'work' })).toBe('Work');
  });

  it('names a portfolio page by its title', () => {
    expect(chatToolNote({ name: 'navigate', slug: 'pokemon-pet-shop' })).toBe('Pokémon Pet Shop');
  });

  it('falls back to the raw value when there is nothing to name it by', () => {
    expect(chatToolNote({ name: 'scroll_to', sectionId: 'gone' })).toBe('gone');
    expect(chatToolNote({ name: 'navigate', slug: 'gone' })).toBe('gone');
  });
});
