import type { ChatAttachment, ChatQuota, ChatError, ChatMessage } from './chat'
import type {
  AiRequestPayload,
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
import type { MentionProvider } from './mentions'
import type { SuggestionProvider, AISuggestion, PageContext } from './suggestions'
import type { SetupState } from './setup'

/**
 * Configuration for chat history limit behavior
 */
export interface HistoryLimitConfig {
  limit: number
  showWarningAt?: number
  onLimitReached?: () => Promise<boolean> | boolean
  warningMessage?: string
  limitMessage?: string
}

/**
 * Configuration for dynamic loading text messages
 */
export interface LoadingTextConfig {
  messages: string[]
  intervals: number[]
}

/**
 * API Endpoints configuration
 */
export interface RestifyAiEndpoints {
  ask: string
  uploadFile?: string
  quota?: string
}

export type TranslateFunction = (key: string, params?: Record<string, any>) => string
export type PermissionCheckFunction = (permission: string) => boolean

/**
 * Theme configuration
 */
export interface RestifyAiTheme {
  primaryColor?: string
  primaryLightColor?: string
  userBubbleColor?: string
  userTextColor?: string
  borderColor?: string
  textPrimaryColor?: string
  textMutedColor?: string
  backgroundColor?: string
  drawerWidth?: string
  drawerFullscreenWidth?: string
}

/**
 * Labels/i18n configuration
 */
export interface RestifyAiLabels {
  title?: string
  aiName?: string
  you?: string
  newChat?: string
  placeholder?: string
  inputPlaceholder?: string
  supportPlaceholder?: string
  loadingText?: string
  analyzingText?: string
  craftingText?: string
  quotaRemaining?: string
  noQuota?: string
  contactSupport?: string
  close?: string
  minimize?: string
  fullscreen?: string
  exitFullscreen?: string
  copyToClipboard?: string
  copied?: string
  showMore?: string
  showLess?: string
  retry?: string
  attachFiles?: string
  emptyStateTitle?: string
  emptyStateDescription?: string
  keyboardShortcutHint?: string
  sendMessage?: string
  attachFile?: string
  closeConfirmTitle?: string
  closeConfirmMessage?: string
  confirmClose?: string
  cancel?: string
  toggleSupportMode?: string
  exitSupportMode?: string
  historyLimitWarningTitle?: string
  historyLimitWarningMessage?: string
  historyLimitReachedTitle?: string
  historyLimitReachedMessage?: string
  startNewChat?: string
  continueChat?: string
  setupWelcomeTitle?: string
  setupWelcomeDescription?: string
  setupApiKeyTitle?: string
  setupApiKeyDescription?: string
  setupTestingTitle?: string
  setupBackendTitle?: string
  setupBackendDescription?: string
  setupCompleteTitle?: string
}

/**
 * Main plugin configuration
 */
export interface RestifyAiConfig {
  // Core API Configuration
  endpoints: RestifyAiEndpoints
  baseUrl?: string
  getAuthToken: () => string | null | Promise<string | null>
  getCustomHeaders?: () => Record<string, string> | Promise<Record<string, string>>

  // Request customization
  buildRequest?: (payload: AiRequestPayload) => AiRequestPayload | Promise<AiRequestPayload>
  parseStreamContent?: StreamParserFunction
  requestInterceptor?: RequestInterceptor
  responseInterceptor?: ResponseInterceptor

  // Retry configuration
  retry?: RetryConfig

  // Internationalization
  translate?: TranslateFunction
  can?: PermissionCheckFunction
  labels?: RestifyAiLabels

  // Providers
  mentionProviders?: MentionProvider[]
  suggestionProviders?: SuggestionProvider[]
  defaultSuggestions?: AISuggestion[]

  // Theme
  theme?: RestifyAiTheme

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
  canToggle?: () => boolean

  // Custom components
  assistantAvatar?: any
  userAvatar?: string | (() => string | null)

  // Lifecycle callbacks
  onQuotaFetched?: (quota: ChatQuota) => void
  onError?: (error: Error) => void
  onMessageSent?: (message: ChatMessage) => void
  onResponseReceived?: (message: ChatMessage) => void
  onDrawerToggle?: (isOpen: boolean) => void
  onNewChat?: () => void
  onSetupComplete?: () => void

  // Stream lifecycle hooks
  onStreamStart?: OnStreamStartHook
  onStreamEnd?: OnStreamEndHook
  onStreamChunk?: OnStreamChunkHook
  beforeSend?: BeforeSendHook
  afterResponse?: AfterResponseHook

  // File upload
  onFileUploadStart?: (file: ChatAttachment) => void
  onFileUploadProgress?: (file: ChatAttachment, progress: number) => void
  onFileUploadComplete?: (file: ChatAttachment) => void
  onFileUploadError?: (file: ChatAttachment, error: Error) => void
}

/**
 * Store state interface
 */
export interface AiStoreState {
  chatHistoryLimit: number
  chatHistory: ChatMessage[]
  uploadedFiles: Record<string, ChatAttachment>
  loading: boolean
  showChat: boolean
  isFullscreen: boolean
  sending: boolean
  pageContext: PageContext | null
  quota: ChatQuota
  error: ChatError
  supportRequestMode: boolean
  setupState: SetupState
}
