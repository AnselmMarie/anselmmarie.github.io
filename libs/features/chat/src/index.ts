/**
 * The AI chat, served as its own remote (ai-chat D13). The remote's `exposes`
 * map points at this package's default export, so `Chat` is also the module
 * the shell mounts.
 */
export { default as Chat, default } from './chat/chat.js';
