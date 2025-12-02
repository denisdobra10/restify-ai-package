import type { App, Plugin } from 'vue'
import type { RestifyAiConfig, RestifyAiLabels, RestifyAiEndpoints } from './types'
import { setRestifyAiConfig, defaultLabels } from './config'

// Import styles
import './styles/index.css'

// Export types
export type {
  ChatMessage as ChatMessageType,
  ChatAttachment,
  Mention,
  MentionItem,
  MentionProvider,
  AISuggestion,
  AiSuggestion,
  SuggestionProvider,
  RestifyAiConfig,
  RestifyAiTheme,
  RestifyAiLabels,
  RestifyAiEndpoints,
  ChatQuota,
  ChatRole,
  PageContext,
  ChatError,
  AiStoreState,
  SubmitPayload,
  HeaderSlotProps,
  EmptyStateSlotProps,
  MessageSlotProps,
  InputSlotProps,
  // Request/Response types
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
  // UI Customization types
  AiChatDrawerUI,
  AiChatDrawerTexts,
  ChatInputUI,
  ChatInputTexts,
  ChatMessageUI,
  ChatMessageTexts,
  AiEmptyStateUI,
  AiEmptyStateTexts,
  MentionListUI,
  MentionListTexts,
  AiAvatarUI,
  UserAvatarUI,
  ChatMessageActionsUI,
  ChatMessageActionsTexts,
  // Config types
  HistoryLimitConfig,
  LoadingTextConfig,
} from './types'

export { ChatRoles } from './types'

// Export config utilities
export {
  getRestifyAiConfig,
  getRestifyAiConfigOrThrow,
  setRestifyAiConfig,
  getLabel,
  defaultLabels,
  isConfigured,
  getConfigValue,
} from './config'

// Export store
export { useRestifyAiStore } from './store'

// Export composables
export {
  useMentionParsing,
  useChatMarkdown,
  useChatScroll,
  useChatErrorHandling,
  useAiContext,
  usePageAiContext,
  useAiSuggestions,
  useKeyboardShortcut,
  useAiDrawerShortcut,
  formatMentionsForApi,
  groupMentionsByType,
} from './composables'

// Export suggestions
export {
  registerSuggestionProvider,
  getSuggestionsForPath,
} from './suggestions'

// Export components
export {
  AiAvatar,
  UserAvatar,
  MentionList,
  ChatMessageActions,
  ChatMessage,
  ChatInput,
  AiEmptyState,
  AiChatDrawer,
} from './components'

// Plugin options
export interface RestifyAiPluginOptions {
  // Core
  endpoints: RestifyAiEndpoints
  baseUrl?: string
  getAuthToken: () => string | null | Promise<string | null>
  getCustomHeaders?: RestifyAiConfig['getCustomHeaders']

  // Request customization
  buildRequest?: RestifyAiConfig['buildRequest']
  parseStreamContent?: RestifyAiConfig['parseStreamContent']
  requestInterceptor?: RestifyAiConfig['requestInterceptor']
  responseInterceptor?: RestifyAiConfig['responseInterceptor']

  // Retry
  retry?: RestifyAiConfig['retry']

  // Internationalization
  labels?: Partial<RestifyAiLabels>
  translate?: RestifyAiConfig['translate']
  can?: RestifyAiConfig['can']

  // Providers
  mentionProviders?: RestifyAiConfig['mentionProviders']
  suggestionProviders?: RestifyAiConfig['suggestionProviders']
  defaultSuggestions?: RestifyAiConfig['defaultSuggestions']

  // Theme
  theme?: RestifyAiConfig['theme']

  // Limits
  chatHistoryLimit?: number
  maxAttachments?: number
  maxFileSize?: number
  acceptedFileTypes?: string

  // Storage keys
  chatHistoryKey?: string
  drawerStateKey?: string

  // Features
  keyboardShortcut?: string | null
  enableSupportMode?: boolean

  // Custom components
  assistantAvatar?: RestifyAiConfig['assistantAvatar']
  userAvatar?: RestifyAiConfig['userAvatar']

  // Lifecycle callbacks
  onQuotaFetched?: RestifyAiConfig['onQuotaFetched']
  onError?: RestifyAiConfig['onError']
  onMessageSent?: RestifyAiConfig['onMessageSent']
  onResponseReceived?: RestifyAiConfig['onResponseReceived']
  onDrawerToggle?: RestifyAiConfig['onDrawerToggle']
  onNewChat?: RestifyAiConfig['onNewChat']

  // Stream lifecycle hooks
  onStreamStart?: RestifyAiConfig['onStreamStart']
  onStreamEnd?: RestifyAiConfig['onStreamEnd']
  onStreamChunk?: RestifyAiConfig['onStreamChunk']
  beforeSend?: RestifyAiConfig['beforeSend']
  afterResponse?: RestifyAiConfig['afterResponse']

  // File upload callbacks
  onFileUploadStart?: RestifyAiConfig['onFileUploadStart']
  onFileUploadProgress?: RestifyAiConfig['onFileUploadProgress']
  onFileUploadComplete?: RestifyAiConfig['onFileUploadComplete']
  onFileUploadError?: RestifyAiConfig['onFileUploadError']
}

// Vue plugin
export const RestifyAiPlugin: Plugin = {
  install(app: App, options: RestifyAiPluginOptions) {
    if (!options.endpoints || !options.getAuthToken) {
      console.warn('[@doderasoftware/restify-ai] Plugin requires endpoints and getAuthToken options.')
      return
    }

    const config: RestifyAiConfig = {
      // Core
      endpoints: options.endpoints,
      baseUrl: options.baseUrl,
      getAuthToken: options.getAuthToken,
      getCustomHeaders: options.getCustomHeaders,

      // Request customization
      buildRequest: options.buildRequest,
      parseStreamContent: options.parseStreamContent,
      requestInterceptor: options.requestInterceptor,
      responseInterceptor: options.responseInterceptor,

      // Retry
      retry: options.retry,

      // Internationalization
      translate: options.translate,
      can: options.can,
      labels: {
        ...defaultLabels,
        ...options.labels,
      },

      // Providers
      mentionProviders: options.mentionProviders,
      suggestionProviders: options.suggestionProviders,
      defaultSuggestions: options.defaultSuggestions,

      // Theme
      theme: options.theme,

      // Limits
      chatHistoryLimit: options.chatHistoryLimit,
      maxAttachments: options.maxAttachments,
      maxFileSize: options.maxFileSize,
      acceptedFileTypes: options.acceptedFileTypes,

      // Storage keys
      chatHistoryKey: options.chatHistoryKey,
      drawerStateKey: options.drawerStateKey,

      // Features
      keyboardShortcut: options.keyboardShortcut,
      enableSupportMode: options.enableSupportMode,

      // Custom components
      assistantAvatar: options.assistantAvatar,
      userAvatar: options.userAvatar,

      // Lifecycle callbacks
      onQuotaFetched: options.onQuotaFetched,
      onError: options.onError,
      onMessageSent: options.onMessageSent,
      onResponseReceived: options.onResponseReceived,
      onDrawerToggle: options.onDrawerToggle,
      onNewChat: options.onNewChat,

      // Stream lifecycle hooks
      onStreamStart: options.onStreamStart,
      onStreamEnd: options.onStreamEnd,
      onStreamChunk: options.onStreamChunk,
      beforeSend: options.beforeSend,
      afterResponse: options.afterResponse,

      // File upload callbacks
      onFileUploadStart: options.onFileUploadStart,
      onFileUploadProgress: options.onFileUploadProgress,
      onFileUploadComplete: options.onFileUploadComplete,
      onFileUploadError: options.onFileUploadError,
    }

    setRestifyAiConfig(config)
    app.provide('restify-ai-config', config)
  },
}

export default RestifyAiPlugin
