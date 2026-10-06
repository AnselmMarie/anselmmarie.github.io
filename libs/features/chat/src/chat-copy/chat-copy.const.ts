/**
 * Every string the chat draws. The greeting, title, placeholder and the three
 * button names are the design's (ai-chat D17); `CHAT_INPUT_LABEL` is not drawn
 * (the design has only a placeholder) and is invented as the text box's
 * accessible name.
 */
export const CHAT_GREETING =
  'Hi! I can answer questions about Anselm’s work, experience, and skills.';

export const CHAT_TITLE = 'Chat';
export const CHAT_OPEN_LABEL = 'Open AI chat';
export const CHAT_CLOSE_LABEL = 'Close chat';
export const CHAT_SEND_LABEL = 'Send';
export const CHAT_INPUT_PLACEHOLDER = 'Ask something…';
export const CHAT_INPUT_LABEL = 'Message';

/**
 * What a reply says when the chat can't answer (ai-chat Slice 5). **Invented**:
 * the design draws none of these states (design.md), so each is plain
 * assistant-bubble text. `CHAT_BLOCKED` repeats the guardrail's own message
 * (infra `GUARDRAIL_BLOCKED_MESSAGE`), and replaces it so the wording is the
 * client's whatever B2 streamed.
 */
export const CHAT_RESTING =
  'I’ve answered all I can for today. Come back tomorrow, or reach Anselm through the contact section.';
export const CHAT_DISABLED =
  'The chat is switched off right now. You can still reach Anselm through the contact section.';
export const CHAT_BLOCKED = 'I can only help with questions about Anselm’s work and this site.';
export const CHAT_ERROR = 'Something went wrong on my end.';
export const CHAT_RETRY_LABEL = 'Try again';
/** The accessible name of the three-dot bubble shown before the first token. */
export const CHAT_WAITING_LABEL = 'Thinking';
