import type { ChatQuota, ChatMessage, SubmitPayload } from './chat'
import type { AISuggestion } from './suggestions'

/**
 * Slot Props Types
 */

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
