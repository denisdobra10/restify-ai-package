/**
 * UI Customization Types - Component class overrides
 */

export interface AiChatDrawerUI {
  backdrop?: string
  drawer?: string
  panel?: string
  header?: string
  headerTitle?: string
  headerActions?: string
  headerActionButton?: string
  body?: string
  footer?: string
  closeConfirmModal?: string
  closeConfirmButton?: string
  cancelButton?: string
  quotaDisplay?: string
  newChatButton?: string
  errorContainer?: string
  errorMessage?: string
  retryButton?: string
  historyLimitModal?: string
  historyLimitButton?: string
}

export interface ChatInputUI {
  root?: string
  form?: string
  inputContainer?: string
  inputWrapper?: string
  textarea?: string
  attachButton?: string
  sendButton?: string
  sendButtonActive?: string
  sendButtonDisabled?: string
  stopButton?: string
  supportToggle?: string
  supportBadge?: string
  attachmentsContainer?: string
  attachmentItem?: string
  attachmentThumbnail?: string
  attachmentRemove?: string
  suggestionsDropdown?: string
  suggestionItem?: string
  suggestionItemSelected?: string
  contextLink?: string
}

export interface ChatMessageUI {
  root?: string
  userMessage?: string
  userBubble?: string
  userAvatar?: string
  assistantMessage?: string
  assistantBubble?: string
  loadingIndicator?: string
  loadingDots?: string
  content?: string
  attachmentsContainer?: string
  attachmentItem?: string
  actionsContainer?: string
  showMoreButton?: string
}

export interface AiEmptyStateUI {
  root?: string
  content?: string
  header?: string
  badge?: string
  title?: string
  description?: string
  grid?: string
  suggestionCard?: string
  suggestionIconContainer?: string
  suggestionIcon?: string
  suggestionTitle?: string
  suggestionDescription?: string
}

export interface MentionListUI {
  root?: string
  container?: string
  groupHeader?: string
  item?: string
  itemSelected?: string
  itemIcon?: string
  itemContent?: string
  itemName?: string
  itemSubtitle?: string
}

export interface AiAvatarUI {
  container?: string
  icon?: string
}

export interface UserAvatarUI {
  container?: string
  icon?: string
}

export interface ChatMessageActionsUI {
  container?: string
  button?: string
  copyButton?: string
  successState?: string
}
