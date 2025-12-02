import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source'
import type {
  ChatMessage,
  ChatAttachment,
  Mention,
  ChatQuota,
  ChatError,
  PageContext,
  AiStoreState,
  SetupState,
  AiRequestPayload,
  AiStreamChunk,
} from './types'
import { ChatRoles } from './types'
import {
  getRestifyAiConfig,
  getConfigValue,
  getLabel,
  isConfigured,
} from './config'

let controller = new AbortController()

// Build full URL with baseUrl support
function buildUrl(endpoint: string): string {
  const config = getRestifyAiConfig()
  const baseUrl = config?.baseUrl || ''

  if (!baseUrl) return endpoint
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${normalizedBase}${normalizedEndpoint}`
}

// Default stream parser - supports OpenAI format
function defaultParseStreamContent(eventData: string): string | null {
  try {
    if (eventData === '[DONE]') return '[DONE]'
    const data = JSON.parse(eventData)
    return data?.choices?.[0]?.delta?.content || ''
  } catch {
    return null
  }
}

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Storage helpers - use defaults when config is not set
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

function saveChatHistory(history: ChatMessage[]): void {
  try {
    sessionStorage.setItem(getStorageKey('chatHistory'), JSON.stringify(history))
  } catch (err) {
    console.warn('[RestifyAi] Failed to save chat history:', err)
  }
}

function loadChatHistory(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(getStorageKey('chatHistory'))
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    console.warn('[RestifyAi] Failed to load chat history:', err)
  }
  return []
}

function clearStoredChatHistory(): void {
  try {
    sessionStorage.removeItem(getStorageKey('chatHistory'))
  } catch (err) {
    console.warn('[RestifyAi] Failed to clear chat history:', err)
  }
}

function saveDrawerState(isOpen: boolean): void {
  try {
    localStorage.setItem(getStorageKey('drawerState'), JSON.stringify(isOpen))
  } catch (err) {
    console.warn('[RestifyAi] Failed to save drawer state:', err)
  }
}

function loadDrawerState(): boolean {
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

function isSetupComplete(): boolean {
  try {
    return localStorage.getItem(getStorageKey('setupComplete')) === 'true'
  } catch {
    return false
  }
}

function markSetupComplete(): void {
  try {
    localStorage.setItem(getStorageKey('setupComplete'), 'true')
  } catch (err) {
    console.warn('[RestifyAi] Failed to mark setup complete:', err)
  }
}

function extractUploadedFiles(history: ChatMessage[]): Record<string, ChatAttachment> {
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

function getDefaultSetupState(): SetupState {
  return {
    isActive: false,
    currentStep: 'welcome',
    testApiKey: null,
    connectionStatus: 'idle',
    backendConfigured: false,
    lastError: null,
  }
}

export const useRestifyAiStore = defineStore('restifyAiStore', {
  state: (): AiStoreState => {
    const initialHistory = loadChatHistory()
    const config = getRestifyAiConfig()

    return {
      chatHistoryLimit: getConfigValue('chatHistoryLimit') || 15,
      chatHistory: initialHistory,
      uploadedFiles: extractUploadedFiles(initialHistory),
      loading: false,
      showChat: loadDrawerState(),
      isFullscreen: false,
      sending: false,
      pageContext: null,
      quota: {
        limit: 100,
        used: 0,
        remaining: 100,
      },
      error: {
        message: null,
        failedQuestion: null,
        failedAttachments: null,
        timestamp: null,
        quotaExceeded: false,
      },
      supportRequestMode: false,
      setupState: !isConfigured() && !isSetupComplete()
        ? { ...getDefaultSetupState(), isActive: true }
        : getDefaultSetupState(),
    }
  },

  getters: {
    hasMessages: (state) => state.chatHistory.length > 0,
    isInSetupMode: (state) => state.setupState.isActive,
    canChat: (state) => !state.setupState.isActive || state.setupState.connectionStatus === 'connected',
  },

  actions: {
    async scrollToBottom(): Promise<void> {
      await nextTick()
      const el = document.getElementById('rai-chat-bottom')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },

    parseStreamContent(event: EventSourceMessage): string | null {
      const config = getRestifyAiConfig()
      const customParser = config?.parseStreamContent

      if (customParser) {
        return customParser(event.data)
      }

      return defaultParseStreamContent(event.data)
    },

    async askQuestion(
      question: string,
      attachments: ChatAttachment[] = [],
      mentions: Mention[] = [],
      isSupportRequest: boolean = false
    ): Promise<boolean> {
      const config = getRestifyAiConfig()

      if (!config) {
        console.warn('[RestifyAi] Cannot ask question - plugin not configured')
        return false
      }

      let generatedContent = ''
      let hasError = false
      const retryConfig = config.retry || {}
      const maxRetries = retryConfig.maxRetries ?? 0
      const retryDelay = retryConfig.retryDelay ?? 1000
      let attempt = 0

      const normalizedAttachments = attachments.map((a) => ({
        id: a.id,
        name: a.name,
        url: a.url,
        type: a.type,
        size: a.size,
        extractedText: a.extractedText,
      }))

      const executeRequest = async (): Promise<boolean> => {
        try {
          // Add user message
          this.chatHistory.push({
            id: crypto.randomUUID(),
            role: ChatRoles.User,
            message: question,
            loading: false,
            attachments: normalizedAttachments,
            mentions: mentions,
            timestamp: Date.now(),
          })
          normalizedAttachments.forEach((a) => this.registerUploadedFile(a))
          saveChatHistory(this.chatHistory)

          if (this.chatHistory.length >= this.chatHistoryLimit) {
            config.onError?.(new Error('Chat history limit reached'))
          }

          // Build history for API
          const history = this.chatHistory.map((item) => ({
            role: item.role,
            message: item.message,
            attachments: item.attachments ?? [],
          }))

          // Build files map
          const filesMap: Record<string, Record<string, unknown>> = {}

          const addFile = (attachment: ChatAttachment): void => {
            if (!attachment?.id) return
            filesMap[attachment.id] = {
              extracted_text: attachment.extractedText || '',
              file_name: attachment.name,
              mime_type: attachment.type || '',
              ...(attachment.size ? { file_size: attachment.size } : {}),
              ...(attachment.url ? { file_url: attachment.url } : {}),
            }
          }

          Object.values(this.uploadedFiles).forEach(addFile)
          this.chatHistory.forEach((entry) => {
            entry.attachments?.forEach(addFile)
          })
          normalizedAttachments.forEach(addFile)

          const files = Object.values(filesMap)

          // Add assistant placeholder
          const index = this.chatHistory.length
          this.chatHistory.push({
            id: crypto.randomUUID(),
            role: ChatRoles.Assistant,
            message: '',
            loading: true,
            timestamp: Date.now(),
          })
          saveChatHistory(this.chatHistory)
          this.sending = true
          controller = new AbortController()

          // Get auth token
          const authToken = await config.getAuthToken()
          const customHeaders = config.getCustomHeaders
            ? await config.getCustomHeaders()
            : {}

          let headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.api+json',
            ...customHeaders,
          }

          if (this.setupState.isActive && this.setupState.testApiKey) {
            headers['X-Test-Api-Key'] = this.setupState.testApiKey
          } else if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`
          }

          // Build request payload
          let requestBody: AiRequestPayload = {
            question,
            history,
            stream: true,
            ...(files.length > 0 && { files }),
            ...(mentions.length > 0 && { mentions }),
            ...(this.supportRequestMode && { contact_support: true }),
          }

          // Apply beforeSend hook
          if (config.beforeSend) {
            requestBody = await config.beforeSend(requestBody)
          }

          // Apply custom request builder
          if (config.buildRequest) {
            requestBody = await config.buildRequest(requestBody)
          }

          config.onMessageSent?.(this.chatHistory[index - 1])

          // Build full URL
          const url = buildUrl(config.endpoints.ask)

          // Apply request interceptor
          let fetchOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers,
          }

          if (config.requestInterceptor) {
            fetchOptions = await config.requestInterceptor(url, fetchOptions)
          }

          // Notify stream start
          config.onStreamStart?.()

          await fetchEventSource(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            signal: controller.signal,
            headers: fetchOptions.headers as Record<string, string>,
            openWhenHidden: true,

            async onopen(response) {
              if (response.ok) return

              if (response.status === 429) {
                const store = useRestifyAiStore()
                store.error = {
                  message: getLabel('noQuota'),
                  failedQuestion: question,
                  failedAttachments: normalizedAttachments,
                  timestamp: Date.now(),
                  quotaExceeded: true,
                }
                await store.fetchQuota()
                throw new Error('Quota exceeded')
              }
              throw new Error(`Failed to connect: ${response.status}`)
            },

            onmessage: async (event) => {
              const content = this.parseStreamContent(event)
              if (!content) return

              this.chatHistory[index].loading = false

              // Create chunk object for hook
              const chunk: AiStreamChunk = {
                content,
                done: content === '[DONE]',
                raw: event.data,
              }

              // Notify chunk received
              config.onStreamChunk?.(chunk)

              if (!generatedContent) {
                generatedContent = content
                this.chatHistory[index].message = generatedContent
                this.chatHistory[index].streaming = true
              } else {
                if (content === '[DONE]') {
                  this.chatHistory[index].streaming = false
                  saveChatHistory(this.chatHistory)

                  // Notify stream end
                  config.onStreamEnd?.(generatedContent)

                  // Update quota
                  if (this.quota.remaining > 0 && !this.supportRequestMode) {
                    this.quota.remaining--
                    this.quota.used++

                    if (this.quota.remaining === 0 && config.enableSupportMode !== false) {
                      this.supportRequestMode = true
                    }
                  }

                  if (this.supportRequestMode && this.quota.remaining > 0) {
                    this.supportRequestMode = false
                  }

                  // Apply afterResponse hook
                  if (config.afterResponse) {
                    await config.afterResponse(this.chatHistory[index])
                  }

                  config.onResponseReceived?.(this.chatHistory[index])
                } else {
                  generatedContent += content
                  this.chatHistory[index].message = generatedContent
                }
              }

              await this.scrollToBottom()
            },

            onerror(err) {
              hasError = true
              throw err
            },
          })

          return true
        } catch (err: any) {
          hasError = true
          const index = this.chatHistory.length - 1
          this.chatHistory.splice(index, 1)

          if (err.name === 'AbortError') {
            return true
          }

          // Check if we should retry
          if (attempt < maxRetries) {
            const shouldRetry = retryConfig.shouldRetry
              ? retryConfig.shouldRetry(err, attempt)
              : true

            if (shouldRetry) {
              attempt++
              await sleep(retryDelay * attempt)
              return executeRequest()
            }
          }

          this.error = {
            message: err.message || 'Network error occurred. Please try again.',
            failedQuestion: question,
            failedAttachments: normalizedAttachments,
            timestamp: Date.now(),
          }

          config.onError?.(err)
          return false
        } finally {
          this.sending = false
        }
      }

      return executeRequest()
    },

    cancelRequest(): void {
      controller?.abort()
      this.chatHistory = this.chatHistory.map((message) => ({
        ...message,
        streaming: false,
        loading: false,
      }))
      this.sending = false
    },

    clearChatHistory(): void {
      const config = getRestifyAiConfig()
      this.chatHistory = []
      this.sending = false
      this.uploadedFiles = {}

      if (this.quota.remaining > 0) {
        this.supportRequestMode = false
      }

      clearStoredChatHistory()
      config?.onNewChat?.()
    },

    async retry(): Promise<boolean> {
      if (!this.error.failedQuestion) {
        return false
      }
      const question = this.error.failedQuestion
      const attachments = this.error.failedAttachments || []
      this.clearError()
      return await this.askQuestion(question, attachments)
    },

    clearError(): void {
      this.error = {
        message: null,
        failedQuestion: null,
        failedAttachments: null,
        timestamp: null,
        quotaExceeded: false,
      }
    },


    toggleSupportMode(): void {
      this.supportRequestMode = !this.supportRequestMode
    },

    async fetchQuota(): Promise<void> {
      const config = getRestifyAiConfig()

      if (!config?.endpoints?.quota) {
        return
      }

      try {
        const authToken = await config.getAuthToken()
        const customHeaders = config.getCustomHeaders
          ? await config.getCustomHeaders()
          : {}

        const url = buildUrl(config.endpoints.quota)

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            ...customHeaders,
          },
        })

        if (response.ok) {
          const data = await response.json()
          this.quota = {
            limit: data.limit ?? this.quota.limit,
            used: data.used ?? this.quota.used,
            remaining: data.remaining ?? this.quota.remaining,
          }

          if (this.quota.remaining === 0 && config.enableSupportMode !== false) {
            this.supportRequestMode = true
          }

          config.onQuotaFetched?.(this.quota)
        }
      } catch (err) {
        console.error('[RestifyAi] Failed to fetch quota:', err)
      }
    },

    async uploadFile(file: File): Promise<ChatAttachment | null> {
      const config = getRestifyAiConfig()

      if (!config?.endpoints?.uploadFile) {
        console.warn('[RestifyAi] No uploadFile endpoint configured')
        return null
      }

      const attachmentId = crypto.randomUUID()
      const attachment: ChatAttachment = {
        id: attachmentId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploading: true,
        progress: 0,
      }

      config.onFileUploadStart?.(attachment)

      try {
        const authToken = await config.getAuthToken()
        const customHeaders = config.getCustomHeaders
          ? await config.getCustomHeaders()
          : {}

        const url = buildUrl(config.endpoints.uploadFile)
        const formData = new FormData()
        formData.append('file', file)

        // Use XMLHttpRequest for progress tracking
        const result = await new Promise<ChatAttachment>((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100)
              attachment.progress = progress
              config.onFileUploadProgress?.(attachment, progress)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText)
                const uploadedAttachment: ChatAttachment = {
                  ...attachment,
                  url: response.url || response.data?.url,
                  extractedText: response.extracted_text || response.data?.extracted_text,
                  uploading: false,
                  progress: 100,
                }
                resolve(uploadedAttachment)
              } catch {
                reject(new Error('Failed to parse upload response'))
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`))
            }
          })

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'))
          })

          xhr.open('POST', url)

          if (authToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${authToken}`)
          }
          Object.entries(customHeaders).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value)
          })

          xhr.send(formData)
        })

        config.onFileUploadComplete?.(result)
        return result
      } catch (err: any) {
        const errorAttachment = { ...attachment, uploading: false }
        config.onFileUploadError?.(errorAttachment, err)
        config.onError?.(err)
        return null
      }
    },

    setPageContext(context: PageContext | null): void {
      this.pageContext = context
    },

    toggleDrawer(): void {
      this.showChat = !this.showChat
      saveDrawerState(this.showChat)
      getRestifyAiConfig()?.onDrawerToggle?.(this.showChat)
    },

    openDrawer(): void {
      this.showChat = true
      saveDrawerState(true)
      getRestifyAiConfig()?.onDrawerToggle?.(true)
    },

    closeDrawer(): void {
      this.showChat = false
      saveDrawerState(false)
      getRestifyAiConfig()?.onDrawerToggle?.(false)
    },

    startSupportRequest(): void {
      this.supportRequestMode = true
    },

    cancelSupportRequest(): void {
      if (this.quota.remaining > 0) {
        this.supportRequestMode = false
      }
    },

    registerUploadedFile(attachment: ChatAttachment): void {
      if (!attachment?.id) return
      this.uploadedFiles[attachment.id] = { ...attachment }
    },

    // Setup mode actions
    startSetupMode(): void {
      this.setupState = {
        isActive: true,
        currentStep: 'welcome',
        testApiKey: null,
        connectionStatus: 'idle',
        backendConfigured: false,
        lastError: null,
      }
    },

    setSetupStep(step: SetupState['currentStep']): void {
      this.setupState.currentStep = step
    },

    setTestApiKey(key: string): void {
      this.setupState.testApiKey = key
    },

    async testConnection(): Promise<boolean> {
      this.setupState.connectionStatus = 'testing'
      this.setupState.lastError = null

      const config = getRestifyAiConfig()

      if (!config) {
        this.setupState.connectionStatus = 'failed'
        this.setupState.lastError = 'Plugin not configured'
        return false
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }

        if (this.setupState.testApiKey) {
          headers['X-Test-Api-Key'] = this.setupState.testApiKey
        }

        // Try quota endpoint first, then ask endpoint with test message
        const testEndpoint = config.endpoints.quota || config.endpoints.ask
        const url = buildUrl(testEndpoint)

        const response = await fetch(url, {
          method: config.endpoints.quota ? 'GET' : 'POST',
          headers,
          ...(config.endpoints.quota ? {} : {
            body: JSON.stringify({ question: 'test', stream: false })
          }),
        })

        if (response.ok) {
          this.setupState.connectionStatus = 'connected'
          this.setupState.backendConfigured = true
          return true
        } else {
          this.setupState.connectionStatus = 'failed'
          this.setupState.lastError = `Connection failed: ${response.status} ${response.statusText}`
          return false
        }
      } catch (err: any) {
        this.setupState.connectionStatus = 'failed'
        this.setupState.lastError = err.message || 'Connection failed'
        return false
      }
    },

    completeSetup(): void {
      this.setupState.isActive = false
      this.setupState.currentStep = 'complete'
      markSetupComplete()
      getRestifyAiConfig()?.onSetupComplete?.()
    },

    skipSetup(): void {
      this.setupState.isActive = false
      markSetupComplete()
    },
  },
})

export type RestifyAiStore = ReturnType<typeof useRestifyAiStore>
