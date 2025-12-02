import { ref, type Ref } from 'vue'
import type { RestifyAiConfig, RestifyAiLabels } from './types'

let _config: RestifyAiConfig | null = null
const _configRef: Ref<RestifyAiConfig | null> = ref(null)

export const defaultLabels: Required<RestifyAiLabels> = {
  title: 'AI Assistant',
  aiName: 'AI Assistant',
  you: 'You',
  newChat: 'New chat',
  placeholder: 'Ask me anything...',
  inputPlaceholder: 'Ask me anything...',
  supportPlaceholder: 'Describe your support request...',
  loadingText: 'Thinking...',
  analyzingText: 'Analyzing...',
  craftingText: 'Crafting response...',
  quotaRemaining: '{count} questions remaining',
  noQuota: 'No AI credit available',
  contactSupport: 'Contact Support',
  close: 'Close',
  minimize: 'Minimize',
  fullscreen: 'Fullscreen',
  exitFullscreen: 'Exit fullscreen',
  copyToClipboard: 'Copy to clipboard',
  copied: 'Copied!',
  showMore: 'Show more',
  showLess: 'Show less',
  retry: 'Retry',
  attachFiles: 'Attach files',
  emptyStateTitle: 'How can I help you today?',
  emptyStateDescription: 'Ask me anything or choose a suggestion below',
  keyboardShortcutHint: 'Press ⌘G to toggle',
  sendMessage: 'Send message',
  attachFile: 'Attach file',
  // Close confirmation
  closeConfirmTitle: 'Close conversation?',
  closeConfirmMessage: 'This will clear your chat history. Are you sure you want to close?',
  confirmClose: 'Close & Clear',
  cancel: 'Cancel',
  // Support mode
  toggleSupportMode: 'Toggle support mode',
  exitSupportMode: 'Exit support mode',
  // Setup mode labels
  setupWelcomeTitle: 'Welcome to AI Assistant',
  setupWelcomeDescription: 'Let\'s get you set up to start using AI features.',
  setupApiKeyTitle: 'API Key Configuration',
  setupApiKeyDescription: 'Enter your API key to test the connection',
  setupTestingTitle: 'Testing Connection...',
  setupBackendTitle: 'Backend Configuration',
  setupBackendDescription: 'Configure your backend endpoint',
  setupCompleteTitle: 'Setup Complete!',
}

export function setRestifyAiConfig(config: RestifyAiConfig): void {
  _config = config
  _configRef.value = config
}

export function getRestifyAiConfig(): RestifyAiConfig | null {
  return _config
}

export function getRestifyAiConfigOrThrow(): RestifyAiConfig {
  if (!_config) {
    throw new Error(
      '[@doderasoftware/restify-ai] Plugin not initialized. ' +
      'Make sure to call app.use(RestifyAiPlugin, config) before using the components.'
    )
  }
  return _config
}

export function useRestifyAiConfig(): Ref<RestifyAiConfig | null> {
  return _configRef
}

export function isConfigured(): boolean {
  return _config !== null
}

export function getLabel(key: keyof RestifyAiLabels, params?: Record<string, any>): string {
  const config = _config
  const labels = config?.labels || {}
  const translate = config?.translate

  if (translate) {
    const translated = translate(key, params)
    if (translated !== key) {
      return translated
    }
  }

  let text = labels[key] || defaultLabels[key]

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }

  return text
}

export function getDefaultConfigValue<K extends keyof RestifyAiConfig>(
  key: K
): RestifyAiConfig[K] | undefined {
  const defaults: Partial<RestifyAiConfig> = {
    chatHistoryLimit: 15,
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024,
    acceptedFileTypes: 'image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv',
    chatHistoryKey: 'restify_ai_chat_history',
    drawerStateKey: 'restify_ai_drawer_open',
    keyboardShortcut: 'cmd+g',
    enableSupportMode: false,
  }
  return defaults[key]
}

export function getConfigValue<K extends keyof RestifyAiConfig>(
  key: K
): RestifyAiConfig[K] | undefined {
  const config = _config
  if (!config) {
    return getDefaultConfigValue(key)
  }
  return config[key] ?? getDefaultConfigValue(key)
}
