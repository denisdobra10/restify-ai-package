import type { ChatMessage } from './chat'

/**
 * Request/Response Types for hooks
 */
export interface AiRequestPayload {
  message: string
  history: Array<{
    role: string
    content: string

  }>
  stream: boolean
  files?: Array<Record<string, unknown>>
  context?: Record<string, unknown>
  contact_support?: boolean
  model?: string
  temperature?: number
  max_tokens?: number
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
export type StreamParserFunction = (eventData: string, eventType?: string) => string | null
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
