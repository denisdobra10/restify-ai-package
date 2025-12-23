import type { ChatMessage, ChatAttachment, SetupState } from '../types'
import { ChatRoles } from '../types'
import { getRestifyAiConfig } from '../config'

// Storage key helpers
function getStorageKey(key: 'chatHistory' | 'drawerState' | 'setupComplete'): string {
  const config = getRestifyAiConfig()
  if (key === 'chatHistory') {
    return config?.chatHistoryKey || 'restify_ai_chat_history'
  }
  if (key === 'setupComplete') {
    return 'restify_ai_setup_complete'
  }
  return config?.drawerStateKey || 'restify_ai_drawer_open'
}

// Chat history persistence
export function saveChatHistory(history: ChatMessage[]): void {
  try {
    sessionStorage.setItem(getStorageKey('chatHistory'), JSON.stringify(history))
  } catch (err) {
    console.warn('[RestifyAi] Failed to save chat history:', err)
  }
}

export interface LoadedChatState {
  history: ChatMessage[]
  hasOrphanedUserMessage: boolean
  orphanedMessage?: { question: string; attachments: ChatAttachment[] }
}

export function loadChatHistory(): LoadedChatState {
  try {
    const stored = sessionStorage.getItem(getStorageKey('chatHistory'))
    if (stored) {
      const history: ChatMessage[] = JSON.parse(stored)
      // Sanitize history on load: remove incomplete/loading messages
      const sanitized = history.filter((msg) => {
        if (msg.role === ChatRoles.Assistant && msg.loading) return false
        if (msg.role === ChatRoles.Assistant && !msg.message?.trim()) return false
        return true
      }).map((msg) => ({
        ...msg,
        streaming: false,
        loading: false,
      }))

      if (sanitized.length !== history.length) {
        sessionStorage.setItem(getStorageKey('chatHistory'), JSON.stringify(sanitized))
      }

      const lastMessage = sanitized[sanitized.length - 1]
      const hasOrphanedUserMessage = lastMessage?.role === ChatRoles.User

      return {
        history: sanitized,
        hasOrphanedUserMessage,
        orphanedMessage: hasOrphanedUserMessage ? {
          question: lastMessage.message,
          attachments: lastMessage.attachments || []
        } : undefined
      }
    }
  } catch (err) {
    console.warn('[RestifyAi] Failed to load chat history:', err)
  }
  return { history: [], hasOrphanedUserMessage: false }
}

export function clearStoredChatHistory(): void {
  try {
    sessionStorage.removeItem(getStorageKey('chatHistory'))
  } catch (err) {
    console.warn('[RestifyAi] Failed to clear chat history:', err)
  }
}

// Error state persistence
export function saveErrorState(error: { message: string | null; failedQuestion: string | null; failedAttachments: ChatAttachment[] | null }): void {
  try {
    if (error.message || error.failedQuestion) {
      sessionStorage.setItem('restify_ai_error_state', JSON.stringify(error))
    } else {
      sessionStorage.removeItem('restify_ai_error_state')
    }
  } catch (err) {
    console.warn('[RestifyAi] Failed to save error state:', err)
  }
}

export function loadErrorState(): { message: string | null; failedQuestion: string | null; failedAttachments: ChatAttachment[] | null } | null {
  try {
    const stored = sessionStorage.getItem('restify_ai_error_state')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('[RestifyAi] Failed to load error state:', err)
  }
  return null
}

export function clearErrorState(): void {
  try {
    sessionStorage.removeItem('restify_ai_error_state')
  } catch (err) {
    console.warn('[RestifyAi] Failed to clear error state:', err)
  }
}

// Drawer state persistence
export function saveDrawerState(isOpen: boolean): void {
  try {
    localStorage.setItem(getStorageKey('drawerState'), JSON.stringify(isOpen))
  } catch (err) {
    console.warn('[RestifyAi] Failed to save drawer state:', err)
  }
}

export function loadDrawerState(): boolean {
  try {
    const stored = localStorage.getItem(getStorageKey('drawerState'))
    if (stored !== null) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('[RestifyAi] Failed to load drawer state:', err)
  }
  return false
}

// Setup state persistence
export function isSetupComplete(): boolean {
  try {
    return localStorage.getItem(getStorageKey('setupComplete')) === 'true'
  } catch {
    return false
  }
}

export function markSetupComplete(): void {
  try {
    localStorage.setItem(getStorageKey('setupComplete'), 'true')
  } catch (err) {
    console.warn('[RestifyAi] Failed to mark setup complete:', err)
  }
}

export function getDefaultSetupState(): SetupState {
  return {
    isActive: false,
    currentStep: 'welcome',
    testApiKey: null,
    connectionStatus: 'idle',
    backendConfigured: false,
    lastError: null,
  }
}
