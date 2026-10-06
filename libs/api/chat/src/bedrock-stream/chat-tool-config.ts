import type { ToolConfiguration, ToolInputSchema } from '@aws-sdk/client-bedrock-runtime';
import { z } from 'zod';

import { navigateInputSchema, scrollToInputSchema } from '@portfolio/shared-chat';

/**
 * A zod schema as the JSON Schema Bedrock wants. The `$schema` dialect marker
 * is dropped: the tool spec says what the input is, not which draft it's in.
 */
const toInputSchema = (schema: z.ZodType): ToolInputSchema => {
  const json = Object.fromEntries(
    Object.entries(z.toJSONSchema(schema)).filter(([key]) => key !== '$schema')
  );
  return { json } as ToolInputSchema;
};

/**
 * B3 and D10: the model's only two tools. Their inputs are the contract's enum
 * schemas, the same ones the browser re-validates against, so the server and
 * the client can't disagree about which sections and slugs exist.
 */
export const CHAT_TOOL_CONFIG: ToolConfiguration = {
  tools: [
    {
      toolSpec: {
        name: 'scroll_to',
        description: 'Scroll the visitor to a section of the homepage.',
        inputSchema: toInputSchema(scrollToInputSchema),
      },
    },
    {
      toolSpec: {
        name: 'navigate',
        description: 'Open the page for one portfolio project.',
        inputSchema: toInputSchema(navigateInputSchema),
      },
    },
  ],
};
