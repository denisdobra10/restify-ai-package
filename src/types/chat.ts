/**
 * Core Chat Types
 */

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

export interface SubmitPayload {
  message: string
  attachments: ChatAttachment[]
  mentions: Mention[]
  isSupportRequest?: boolean
}
