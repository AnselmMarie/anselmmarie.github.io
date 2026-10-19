import { describe, expect, it } from 'vitest';

import { CHAT_PORTFOLIO_SLUGS, CHAT_SECTION_IDS } from '@portfolio/shared-chat';

import { CHAT_TOOL_CONFIG } from './chat-tool-config.js';

const specNamed = (name: string) =>
  CHAT_TOOL_CONFIG.tools?.find((tool) => tool.toolSpec?.name === name)?.toolSpec;

describe('CHAT_TOOL_CONFIG (B3, D10)', () => {
  it('offers exactly the two tools', () => {
    expect(CHAT_TOOL_CONFIG.tools?.map((tool) => tool.toolSpec?.name)).toEqual([
      'scroll_to',
      'navigate',
    ]);
  });

  it('limits scroll_to to the contract’s section ids, with no extra fields', () => {
    expect(specNamed('scroll_to')?.inputSchema?.json).toEqual({
      type: 'object',
      properties: { sectionId: { type: 'string', enum: [...CHAT_SECTION_IDS] } },
      required: ['sectionId'],
      additionalProperties: false,
    });
  });

  it('limits navigate to the contract’s slugs, with no extra fields', () => {
    expect(specNamed('navigate')?.inputSchema?.json).toEqual({
      type: 'object',
      properties: { slug: { type: 'string', enum: [...CHAT_PORTFOLIO_SLUGS] } },
      required: ['slug'],
      additionalProperties: false,
    });
  });

  it('describes each tool for the model', () => {
    expect(specNamed('scroll_to')?.description).toMatch(/homepage/);
    expect(specNamed('navigate')?.description).toMatch(/project/);
  });
});
