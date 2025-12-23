import type { ChatAttachment, ChatMessage } from './chat'

/**
 * Request/Response Types for hooks
 */
export interface AiRequestPayload {
  question: string
  history: Array<{
    role: string
    message: string
    attachments: ChatAttachment[]
  }>
  stream: boolean
  files?: Array<Record<string, unknown>>
  mentions?: import('./chat').Mention[]
  contact_support?: boolean
  [key: string]: unknown
}

export interface AiStreamChunk {
  content: string
  done: boolean
  raw: unknown
}

/**
 * Lifecycle hooks
 */
export type BeforeSendHook = (payload: AiRequestPayload) => AiRequestPayload | Promise<AiRequestPayload>
export type AfterResponseHook = (message: ChatMessage) => void | Promise<void>
export type OnStreamStartHook = () => void
export type OnStreamEndHook = (fullMessage: string) => void
export type OnStreamChunkHook = (chunk: AiStreamChunk) => void
export type StreamParserFunction = (eventData: string) => string | null
export type RequestInterceptor = (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries?: number
  retryDelay?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
}
