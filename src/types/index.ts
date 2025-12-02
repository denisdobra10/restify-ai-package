import type { Component } from 'vue'

// Core Chat Types

/**
 * Configuration for chat history limit behavior
 */
export interface HistoryLimitConfig {
  /** Maximum number of messages in chat history */
  limit: number
  /** Show warning dialog when remaining messages equals this number */
  showWarningAt?: number
  /** Callback when limit is reached, return true to start new chat */
  onLimitReached?: () => Promise<boolean> | boolean
  /** Warning message shown when approaching limit */
  warningMessage?: string
  /** Message shown when limit is reached */
  limitMessage?: string
}

/**
 * Configuration for dynamic loading text messages
 */
export interface LoadingTextConfig {
  /** Array of messages to cycle through during loading */
  messages: string[]
  /** Delay in ms before showing each message (first message shows immediately) */
  intervals: number[]
}

export interface ChatAttachment {
  id: string
  name: string
  url?: string
  type?: string
  size?: number
  extractedText?: string
  uploading?: boolean
  progress?: number
  previewUrl?: string
}

export interface Mention {
  id: string
  name: string
  type: string
  metadata?: Record<string, any> | null
}

export const ChatRoles = {
  Assistant: 'assistant',
  User: 'user',
  System: 'system',
} as const

export type ChatRole = (typeof ChatRoles)[keyof typeof ChatRoles]

export interface ChatMessage {
  id: string
  role: ChatRole | string
  message: string
  loading?: boolean
  streaming?: boolean
  timestamp?: number
  created_at?: string | Date
  attachments?: ChatAttachment[]
  mentions?: Mention[]
}

// Quota & Error Types

export interface ChatQuota {
  limit: number
  used: number
  remaining: number
}

export interface ChatError {
  message: string | null
  failedQuestion: string | null
  failedAttachments?: ChatAttachment[] | null
  timestamp: number | null
  quotaExceeded?: boolean
}

// Setup Mode Types

export type SetupStep = 'welcome' | 'api-key' | 'testing' | 'backend-config' | 'complete'

export interface SetupState {
  isActive: boolean
  currentStep: SetupStep
  testApiKey: string | null
  connectionStatus: 'idle' | 'testing' | 'connected' | 'failed'
  backendConfigured: boolean
  lastError: string | null
}

// Suggestion Types

export interface PageContext {
  pageType: string
  entityId?: string
  entityType?: string
  metadata?: Record<string, any>
  routePath?: string
}

export interface AISuggestion {
  id: string
  title: string
  description?: string
  icon?: any // Allow any component type to avoid Vue version conflicts
  className?: string
  gradientClass?: string
  prompt: string | ((context: PageContext) => string)
  permission?: string
  category?: string
  isSupportRequest?: boolean
}

// Alias for backwards compatibility
export type AiSuggestion = AISuggestion

export interface SuggestionProvider {
  id: string
  routes?: string[]
  matcher?: (path: string, context: PageContext | null) => boolean
  getSuggestions: (context: PageContext) => AISuggestion[]
  extractContext?: (path: string) => Record<string, any>
  priority?: number
}

// Mention Types

export interface MentionProvider {
  type: string
  label: string
  icon?: any // Allow any component type to avoid Vue version conflicts
  iconClass?: string
  search: (query: string) => Promise<MentionItem[]> | MentionItem[]
  routes?: string[]
  priority?: number
  getDisplayName?: (item: MentionItem) => string
  getSubtitle?: (item: MentionItem) => string | null
  buildMentionText?: (item: MentionItem) => string
}

export interface MentionItem {
  id: string
  type: string
  name?: string
  label?: string
  title?: string
  attributes?: Record<string, any> | null
  relationships?: Record<string, any> | null
}

export interface MentionContext {
  inMention: boolean
  query: string
  startPos: number
}

export interface MentionParseResult {
  cleanText: string
  mentions: Mention[]
}

// Config Types

export interface RestifyAiEndpoints {
  ask: string
  uploadFile?: string
  quota?: string
}

export type TranslateFunction = (key: string, params?: Record<string, any>) => string
export type PermissionCheckFunction = (permission: string) => boolean

// Request/Response Types for hooks
export interface AiRequestPayload {
  question: string
  history: Array<{
    role: string
    message: string
    attachments: ChatAttachment[]
  }>
  stream: boolean
  files?: Array<Record<string, unknown>>
  mentions?: Mention[]
  contact_support?: boolean
  [key: string]: unknown
}

export interface AiStreamChunk {
  content: string
  done: boolean
  raw: unknown
}

// Lifecycle hooks
export type BeforeSendHook = (payload: AiRequestPayload) => AiRequestPayload | Promise<AiRequestPayload>
export type AfterResponseHook = (message: ChatMessage) => void | Promise<void>
export type OnStreamStartHook = () => void
export type OnStreamEndHook = (fullMessage: string) => void
export type OnStreamChunkHook = (chunk: AiStreamChunk) => void
export type StreamParserFunction = (eventData: string) => string | null
export type RequestInterceptor = (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>

// Retry configuration
export interface RetryConfig {
  maxRetries?: number
  retryDelay?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
}

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
  // Close confirmation
  closeConfirmTitle?: string
  closeConfirmMessage?: string
  confirmClose?: string
  cancel?: string
  // Support mode
  toggleSupportMode?: string
  exitSupportMode?: string
  // History limit
  historyLimitWarningTitle?: string
  historyLimitWarningMessage?: string
  historyLimitReachedTitle?: string
  historyLimitReachedMessage?: string
  startNewChat?: string
  continueChat?: string
  // Setup mode labels
  setupWelcomeTitle?: string
  setupWelcomeDescription?: string
  setupApiKeyTitle?: string
  setupApiKeyDescription?: string
  setupTestingTitle?: string
  setupBackendTitle?: string
  setupBackendDescription?: string
  setupCompleteTitle?: string
}

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
  assistantAvatar?: any // Allow any component type to avoid Vue version conflicts
  userAvatar?: string | (() => string | null) // URL string or getter function for user avatar image

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

// Store Types

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

export interface SubmitPayload {
  message: string
  attachments: ChatAttachment[]
  mentions: Mention[]
  isSupportRequest?: boolean
}

export interface HeaderSlotProps {
  quota: ChatQuota
  isFullscreen: boolean
  hasHistory: boolean
  onNewChat: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleFullscreen: () => void
}

export interface EmptyStateSlotProps {
  suggestions: AISuggestion[]
  onSuggestionClick: (suggestion: AISuggestion) => void
}

export interface MessageSlotProps {
  message: ChatMessage
  isUser: boolean
  isLoading: boolean
  isStreaming: boolean
}

export interface InputSlotProps {
  modelValue: string
  sending: boolean
  disabled: boolean
  onSubmit: (payload: SubmitPayload) => void
  onCancel: () => void
}

// UI Customization Types

/**
 * UI classes for AiChatDrawer component
 */
export interface AiChatDrawerUI {
  /** Backdrop overlay classes */
  backdrop?: string
  /** Main drawer container classes */
  drawer?: string
  /** Drawer panel classes */
  panel?: string
  /** Header container classes */
  header?: string
  /** Header title classes */
  headerTitle?: string
  /** Header actions container classes */
  headerActions?: string
  /** Header action button classes */
  headerActionButton?: string
  /** Messages container/body classes */
  body?: string
  /** Footer container classes */
  footer?: string
  /** Close confirm modal classes */
  closeConfirmModal?: string
  /** Close confirm button classes */
  closeConfirmButton?: string
  /** Cancel button classes */
  cancelButton?: string
  /** Quota display classes */
  quotaDisplay?: string
  /** New chat button classes */
  newChatButton?: string
  /** Error container classes */
  errorContainer?: string
  /** Error message classes */
  errorMessage?: string
  /** Retry button classes */
  retryButton?: string
  /** History limit warning modal classes */
  historyLimitModal?: string
  /** History limit warning button classes */
  historyLimitButton?: string
}

/**
 * UI classes for ChatInput component
 */
export interface ChatInputUI {
  /** Root container classes */
  root?: string
  /** Form wrapper classes */
  form?: string
  /** Input container classes */
  inputContainer?: string
  /** Input border wrapper classes */
  inputWrapper?: string
  /** Textarea element classes */
  textarea?: string
  /** Attach button classes */
  attachButton?: string
  /** Send button classes */
  sendButton?: string
  /** Send button when active */
  sendButtonActive?: string
  /** Send button when disabled */
  sendButtonDisabled?: string
  /** Stop button classes */
  stopButton?: string
  /** Support toggle button classes */
  supportToggle?: string
  /** Support mode active badge classes */
  supportBadge?: string
  /** Attachments preview container classes */
  attachmentsContainer?: string
  /** Attachment item classes */
  attachmentItem?: string
  /** Attachment thumbnail classes */
  attachmentThumbnail?: string
  /** Attachment remove button classes */
  attachmentRemove?: string
  /** Suggestions dropdown classes */
  suggestionsDropdown?: string
  /** Suggestion item classes */
  suggestionItem?: string
  /** Suggestion item when selected */
  suggestionItemSelected?: string
  /** Context link classes */
  contextLink?: string
}

/**
 * UI classes for ChatMessage component
 */
export interface ChatMessageUI {
  /** Root container classes */
  root?: string
  /** User message container classes */
  userMessage?: string
  /** User message bubble classes */
  userBubble?: string
  /** User avatar classes */
  userAvatar?: string
  /** Assistant message container classes */
  assistantMessage?: string
  /** Assistant message bubble classes */
  assistantBubble?: string
  /** Loading indicator classes */
  loadingIndicator?: string
  /** Loading dots classes */
  loadingDots?: string
  /** Message content wrapper classes */
  content?: string
  /** Attachment container classes */
  attachmentsContainer?: string
  /** Attachment item classes */
  attachmentItem?: string
  /** Actions container classes */
  actionsContainer?: string
  /** Show more button classes */
  showMoreButton?: string
}

/**
 * UI classes for AiEmptyState component
 */
export interface AiEmptyStateUI {
  /** Root container classes */
  root?: string
  /** Content wrapper classes */
  content?: string
  /** Header container classes */
  header?: string
  /** Badge/pill classes */
  badge?: string
  /** Title classes */
  title?: string
  /** Description classes */
  description?: string
  /** Suggestions grid classes */
  grid?: string
  /** Suggestion card classes */
  suggestionCard?: string
  /** Suggestion icon container classes */
  suggestionIconContainer?: string
  /** Suggestion icon classes */
  suggestionIcon?: string
  /** Suggestion title classes */
  suggestionTitle?: string
  /** Suggestion description classes */
  suggestionDescription?: string
}

/**
 * UI classes for MentionList component
 */
export interface MentionListUI {
  /** Root container classes */
  root?: string
  /** Inner padding container classes */
  container?: string
  /** Group header classes */
  groupHeader?: string
  /** Item button classes */
  item?: string
  /** Item when selected classes */
  itemSelected?: string
  /** Item icon/avatar classes */
  itemIcon?: string
  /** Item content wrapper classes */
  itemContent?: string
  /** Item name/title classes */
  itemName?: string
  /** Item subtitle classes */
  itemSubtitle?: string
}

/**
 * UI classes for AiAvatar component
 */
export interface AiAvatarUI {
  /** Container classes */
  container?: string
  /** Icon classes */
  icon?: string
}

/**
 * UI classes for UserAvatar component
 */
export interface UserAvatarUI {
  /** Container classes */
  container?: string
  /** Icon classes */
  icon?: string
}

/**
 * UI classes for ChatMessageActions component
 */
export interface ChatMessageActionsUI {
  /** Container classes */
  container?: string
  /** Action button classes */
  button?: string
  /** Copy button specific classes */
  copyButton?: string
  /** Success state classes */
  successState?: string
}

/**
 * Text props for AiChatDrawer component
 */
export interface AiChatDrawerTexts {
  title?: string
  quotaRemaining?: string
  noQuota?: string
  newChat?: string
  close?: string
  minimize?: string
  fullscreen?: string
  exitFullscreen?: string
  closeConfirmTitle?: string
  closeConfirmMessage?: string
  confirmClose?: string
  cancel?: string
  retry?: string
  keyboardShortcutHint?: string
  placeholder?: string
  supportPlaceholder?: string
  // History limit texts
  historyLimitWarningTitle?: string
  historyLimitWarningMessage?: string
  historyLimitReachedTitle?: string
  historyLimitReachedMessage?: string
  startNewChat?: string
  continueChat?: string
}

/**
 * Text props for ChatInput component
 */
export interface ChatInputTexts {
  placeholder?: string
  supportPlaceholder?: string
  attachedFiles?: string
  attachFiles?: string
  toggleSupportMode?: string
  exitSupportMode?: string
  supportLabel?: string
}

/**
 * Text props for ChatMessage component
 */
export interface ChatMessageTexts {
  loadingText?: string
  showMore?: string
  showLess?: string
  openAttachment?: string
  attachment?: string
}

/**
 * Text props for AiEmptyState component
 */
export interface AiEmptyStateTexts {
  aiName?: string
  title?: string
  description?: string
}

/**
 * Text props for MentionList component
 */
export interface MentionListTexts {
  defaultGroupLabel?: string
}

/**
 * Text props for ChatMessageActions component
 */
export interface ChatMessageActionsTexts {
  copyToClipboard?: string
  copied?: string
}
