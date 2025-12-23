/**
 * Restify AI - Type Definitions
 * 
 * This file re-exports all types from their respective modules for convenience.
 */

// Core chat types
export type {
  ChatAttachment,
  Mention,
  ChatMessage,
  ChatQuota,
  ChatError,
  SubmitPayload,
} from './chat'
export { ChatRoles } from './chat'
export type { ChatRole } from './chat'

// API types
export type {
  AiRequestPayload,
  AiStreamChunk,
  BeforeSendHook,
  AfterResponseHook,
  OnStreamStartHook,
  OnStreamEndHook,
  OnStreamChunkHook,
  StreamParserFunction,
  RequestInterceptor,
  ResponseInterceptor,
  RetryConfig,
} from './api'

// Config types
export type {
  HistoryLimitConfig,
  LoadingTextConfig,
  RestifyAiEndpoints,
  TranslateFunction,
  PermissionCheckFunction,
  RestifyAiTheme,
  RestifyAiLabels,
  RestifyAiConfig,
  AiStoreState,
} from './config'

// Suggestion types
export type {
  PageContext,
  AISuggestion,
  AiSuggestion,
  SuggestionProvider,
} from './suggestions'

// Mention types
export type {
  MentionProvider,
  MentionItem,
  MentionContext,
  MentionParseResult,
} from './mentions'

// Setup types
export type {
  SetupStep,
  SetupState,
} from './setup'

// Slot props types
export type {
  HeaderSlotProps,
  EmptyStateSlotProps,
  MessageSlotProps,
  InputSlotProps,
} from './slots'

// UI customization types
export type {
  AiChatDrawerUI,
  ChatInputUI,
  ChatMessageUI,
  AiEmptyStateUI,
  MentionListUI,
  AiAvatarUI,
  UserAvatarUI,
  ChatMessageActionsUI,
} from './ui'

// Text/i18n types
export type {
  AiChatDrawerTexts,
  ChatInputTexts,
  ChatMessageTexts,
  AiEmptyStateTexts,
  MentionListTexts,
  ChatMessageActionsTexts,
} from './texts'
