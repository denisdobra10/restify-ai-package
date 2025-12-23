/**
 * Text/i18n Props Types - Component text overrides
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
  historyLimitWarningTitle?: string
  historyLimitWarningMessage?: string
  historyLimitReachedTitle?: string
  historyLimitReachedMessage?: string
  startNewChat?: string
  continueChat?: string
  messageCount?: string
}

export interface ChatInputTexts {
  placeholder?: string
  supportPlaceholder?: string
  attachedFiles?: string
  attachFiles?: string
  toggleSupportMode?: string
  exitSupportMode?: string
  supportLabel?: string
}

export interface ChatMessageTexts {
  loadingText?: string
  showMore?: string
  showLess?: string
  openAttachment?: string
  attachment?: string
}

export interface AiEmptyStateTexts {
  aiName?: string
  title?: string
  description?: string
}

export interface MentionListTexts {
  defaultGroupLabel?: string
}

export interface ChatMessageActionsTexts {
  copyToClipboard?: string
  copied?: string
}
