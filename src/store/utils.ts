import type { ChatMessage, ChatAttachment } from '../types'
import { getRestifyAiConfig } from '../config'

/**
 * Build full URL with baseUrl support
 */
export function buildUrl(endpoint: string | undefined): string {
  if (!endpoint) {
    console.error('[RestifyAi] Endpoint is undefined. Check your endpoints configuration.')
    throw new Error('AI service endpoint is not configured. Please contact support.')
  }

  const config = getRestifyAiConfig()
  const baseUrl = config?.baseUrl || ''

  if (!baseUrl) return endpoint
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${normalizedBase}${normalizedEndpoint}`
}

/**
 * Convert technical errors to user-friendly messages
 */
export function getUserFriendlyErrorMessage(err: unknown): string {
  const errorMessage = err instanceof Error ? err.message : String(err)
  const lowerMessage = errorMessage.toLowerCase()

  if (lowerMessage.includes('failed to fetch') || lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'Unable to connect to the AI service. Please check your internet connection and try again.'
  }
  if (lowerMessage.includes('500') || lowerMessage.includes('internal server error')) {
    return 'The AI service is temporarily unavailable. Please try again in a few moments.'
  }
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'The request took too long. Please try again.'
  }
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return 'Your session has expired. Please refresh the page and try again.'
  }
  if (lowerMessage.includes('429') || lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return 'Too many requests. Please wait a moment before trying again.'
  }
  if (lowerMessage.includes('cors') || lowerMessage.includes('cross-origin')) {
    return 'Unable to connect to the AI service. Please contact support.'
  }
  if (lowerMessage.includes('endpoint is not configured')) {
    return 'AI service endpoint is not configured. Please contact support.'
  }

  return 'Something went wrong. Please try again later.'
}

/**
 * Default stream parser - supports OpenAI format
 */
export function defaultParseStreamContent(eventData: string): string | null {
  try {
    if (eventData === '[DONE]') return '[DONE]'
    const data = JSON.parse(eventData)
    return data?.choices?.[0]?.delta?.content || ''
  } catch {
    return null
  }
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Extract uploaded files from chat history
 */
export function extractUploadedFiles(history: ChatMessage[]): Record<string, ChatAttachment> {
  const files: Record<string, ChatAttachment> = {}
  history.forEach((entry) => {
    entry.attachments?.forEach((attachment) => {
      if (attachment?.id) {
        files[attachment.id] = attachment
      }
    })
  })
  return files
}
