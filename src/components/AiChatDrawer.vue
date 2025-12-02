<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="rai-fade">
      <div 
        v-if="modelValue && showBackdrop"
        class="fixed inset-0 bg-black/30 z-40"
        :class="ui?.backdrop"
        @click="closeOnBackdropClick && handleMinimize()"
      />
    </Transition>
    
    <!-- Drawer -->
    <Transition :name="position === 'left' ? 'rai-slide-right' : 'rai-slide-left'">
      <aside
        v-if="modelValue"
        class="fixed top-0 bottom-0 z-50 flex-shrink-0 h-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl will-change-transform"
        :class="[
          position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          ui?.drawer
        ]"
        :style="{ width: isFullscreen ? fullscreenWidth : width }"
      >
        <div 
          class="h-full flex flex-col relative bg-white dark:bg-gray-900"
          :class="ui?.panel"
        >
        <!-- Header Slot -->
        <slot name="header" v-bind="headerSlotProps">
          <div 
            class="flex items-center justify-between px-4 sm:px-6 pt-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            :class="ui?.header"
          >
            <div class="flex items-center gap-3">
              <template v-if="!isSetupMode">
                <button
                  v-if="showNewChatButton && store.chatHistory.length > 0"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm"
                  :class="ui?.newChatButton"
                  @click="startNewChat"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                  <span>{{ t('newChat') }}</span>
                </button>
                <span v-else class="text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {{ t('keyboardShortcutHint') }}
                </span>
              </template>
              <div v-else class="flex items-center gap-2">
                <span class="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Setup Required</span>
              </div>
            </div>

            <!-- Quota Display -->
            <div v-if="showQuota && !isSetupMode" class="flex items-center gap-2 ml-auto mr-3">
              <slot name="quota" :quota="store.quota">
                <span 
                  v-if="store.quota.remaining > 0" 
                  class="text-xs text-green-600 dark:text-green-400"
                  :class="ui?.quotaDisplay"
                >
                  {{ t('quotaRemaining', { count: store.quota.remaining }) }}
                </span>
                <span 
                  v-else-if="store.quota.remaining === 0" 
                  class="text-xs text-red-600 dark:text-red-400"
                  :class="ui?.quotaDisplay"
                >
                  {{ t('noQuota') }}
                </span>
              </slot>
            </div>

            <div class="flex items-center gap-1" :class="ui?.headerActions">
              <button
                v-if="showCloseButton"
                type="button"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="ui?.headerActionButton"
                :title="t('close')"
                @click="handleClose"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                v-if="showMinimizeButton"
                type="button"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="ui?.headerActionButton"
                :title="t('minimize')"
                @click="handleMinimize"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
              </button>

              <button
                v-if="showFullscreenToggle"
                type="button"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="ui?.headerActionButton"
                :title="isFullscreen ? t('exitFullscreen') : t('fullscreen')"
                @click="toggleFullscreen"
              >
                <svg v-if="!isFullscreen" class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              </button>
            </div>
          </div>
        </slot>

        <div 
          class="h-full flex flex-col mx-auto w-full overflow-hidden" 
          :class="[{ 'max-w-5xl': isFullscreen }, ui?.body]"
        >
          <!-- Setup Mode -->
          <div v-if="isSetupMode" class="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
            <slot name="setup">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Almost there!
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-center">
                Configure the plugin in your app entry file to start using AI.
              </p>
              
              <div class="w-full max-w-md">
                <div class="bg-gray-900 rounded-xl overflow-hidden">
                  <div class="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                    <span class="text-xs text-gray-400">main.ts</span>
                    <button 
                      type="button"
                      class="text-xs text-gray-400 hover:text-white transition-colors"
                      @click="copySetupCode"
                    >
                      {{ copied ? '✓ Copied' : 'Copy' }}
                    </button>
                  </div>
                  <pre class="text-xs text-gray-100 p-4 overflow-x-auto leading-relaxed"><code class="language-typescript"><span class="text-purple-400">import</span> { RestifyAiPlugin } <span class="text-purple-400">from</span> <span class="text-green-400">'@doderasoftware/restify-ai'</span>

app.<span class="text-yellow-300">use</span>(RestifyAiPlugin, {
  <span class="text-blue-300">endpoints</span>: {
    <span class="text-blue-300">ask</span>: <span class="text-green-400">'/api/ai/ask'</span>,
    <span class="text-blue-300">quota</span>: <span class="text-green-400">'/api/ai/quota'</span>, <span class="text-gray-500">// optional</span>
  },
  <span class="text-blue-300">getAuthToken</span>: () => <span class="text-yellow-300">getToken</span>(),
})</code></pre>
                </div>
                
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                  Need help? Check the <a href="https://github.com/doderasoftware/restify-ai" target="_blank" class="text-primary hover:underline">documentation</a>
                </p>
              </div>
            </slot>
          </div>

          <!-- Normal mode - Empty State -->
          <template v-else>
            <div v-if="store.chatHistory.length === 0" class="flex-1 flex flex-col overflow-y-auto">
              <slot name="empty-state" :suggestions="mappedSuggestions" :on-click="onExampleClick">
                <AiEmptyState @item-click="onExampleClick" />
              </slot>
            </div>

            <!-- Chat Messages -->
            <div
              v-else
              ref="chatContainer"
              class="flex-1 overflow-y-auto py-6 pb-24"
            >
              <div class="max-w-3xl mx-auto px-4 space-y-6">
                <!-- Assistant Badge -->
                <div class="flex justify-center">
                  <div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    <span>{{ t('title') || getLabel('aiName') }}</span>
                  </div>
                </div>

                <!-- Messages -->
                <template v-for="(message, index) in store.chatHistory" :key="message.id || index">
                  <slot name="message" :message="message" :is-user="message.role === 'user'" :is-loading="message.loading" :is-streaming="message.streaming">
                    <ChatMessage
                      :message="message"
                      :loading-text="loadingMessage"
                      @copy="copyToClipboard"
                    />
                  </slot>
                </template>

                <!-- Contact Support Button -->
                <div v-if="store.quota.remaining === 0" class="flex justify-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                    @click="handleContactSupport"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>{{ getLabel('contactSupport') }}</span>
                  </button>
                </div>

                <!-- Error Message -->
                <div 
                  v-if="store.error.message" 
                  class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 px-2 py-1 pb-6"
                  :class="ui?.errorContainer"
                >
                  <span :class="ui?.errorMessage">{{ store.error.message }}</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 font-medium"
                    :class="ui?.retryButton"
                    :title="t('retry')"
                    @click="handleRetry"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div id="rai-chat-bottom" class="h-8" />

            <!-- Chat Input -->
            <slot name="input" v-bind="inputSlotProps">
              <ChatInput
                v-model="question"
                :sending="store.sending"
                :placeholder="props.texts?.placeholder || getLabel('inputPlaceholder')"
                :support-placeholder="props.texts?.supportPlaceholder || getLabel('supportPlaceholder')"
                :suggestions="mappedSuggestions"
                :has-history="store.chatHistory.length > 0"
                :support-request-mode="store.supportRequestMode"
                :show-support-mode-toggle="enableSupportMode"
                @submit="handleSend"
                @cancel="store.cancelRequest"
                @suggestion-select="applySuggestion"
                @toggle-support-mode="toggleSupportMode"
              >
                <template #context-link>
                  <slot name="context-link" />
                </template>
              </ChatInput>
            </slot>
          </template>
        </div>
      </div>

      <!-- Close Confirmation Dialog -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCloseConfirm" class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl p-6 m-4 max-w-sm w-full shadow-xl"
            :class="ui?.closeConfirmModal"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('closeConfirmTitle') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {{ t('closeConfirmMessage') }}
            </p>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                :class="ui?.cancelButton"
                @click="showCloseConfirm = false"
              >
                {{ t('cancel') }}
              </button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                :class="ui?.closeConfirmButton"
                @click="confirmCloseAction"
              >
                {{ t('confirmClose') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRestifyAiStore } from '../store'
import { getLabel, isConfigured, getConfigValue } from '../config'
import { useAiSuggestions } from '../composables/useAiSuggestions'
import AiEmptyState from './AiEmptyState.vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import type { 
  ChatAttachment, 
  AISuggestion, 
  Mention, 
  ChatQuota, 
  SubmitPayload, 
  HeaderSlotProps, 
  InputSlotProps,
  AiChatDrawerUI,
  AiChatDrawerTexts,
} from '../types'

interface Props {
  modelValue: boolean
  /** Custom UI classes for styling */
  ui?: AiChatDrawerUI
  /** Custom text overrides for i18n support */
  texts?: AiChatDrawerTexts
  /** Width of the drawer when not fullscreen */
  width?: string
  /** Width of the drawer when fullscreen */
  fullscreenWidth?: string
  /** Position of the drawer */
  position?: 'left' | 'right'
  /** Show backdrop overlay */
  showBackdrop?: boolean
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean
  /** Close on escape key */
  closeOnEscape?: boolean
  /** Show quota display */
  showQuota?: boolean
  /** Show fullscreen toggle */
  showFullscreenToggle?: boolean
  /** Show minimize button */
  showMinimizeButton?: boolean
  /** Show close button */
  showCloseButton?: boolean
  /** Show new chat button */
  showNewChatButton?: boolean
  /** Confirm before closing if there's chat history */
  confirmClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '600px',
  fullscreenWidth: '90vw',
  position: 'right',
  showBackdrop: false,
  closeOnBackdropClick: false,
  closeOnEscape: true,
  showQuota: true,
  showFullscreenToggle: true,
  showMinimizeButton: true,
  showCloseButton: true,
  showNewChatButton: true,
  confirmClose: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'contact-support'): void
  (e: 'new-chat'): void
}>()

// Simple getter/setter for v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Text helper - not computed, just a function
function t(key: keyof AiChatDrawerTexts, params?: Record<string, any>): string {
  const customText = props.texts?.[key]
  if (customText) {
    let text = customText as string
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }
  return getLabel(key as any, params)
}

const store = useRestifyAiStore()
const question = ref('')
const loadingMessage = ref(getLabel('loadingText'))
const chatContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
const copied = ref(false)
const showCloseConfirm = ref(false)

// Lazy computed - only evaluated when needed
const isSetupMode = computed(() => !isConfigured())
const enableSupportMode = computed(() => getConfigValue('enableSupportMode') ?? false)

const { suggestions, resolvePrompt } = useAiSuggestions()

const setupCode = `import { RestifyAiPlugin } from '@doderasoftware/restify-ai'

app.use(RestifyAiPlugin, {
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota', // optional
  },
  getAuthToken: () => getToken(),
})`

function copySetupCode() {
  navigator.clipboard.writeText(setupCode)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const mappedSuggestions = computed(() => {
  if (isSetupMode.value) return []
  
  const rawQuery = question.value.toLowerCase().trim()
  const allSuggestions = suggestions.value || []
  
  let filtered = allSuggestions
  if (rawQuery) {
    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    const queryWords = rawQuery.split(/\s+/).filter(w => !stopWords.has(w))
    
    if (queryWords.length > 0) {
      filtered = allSuggestions.filter((s: AISuggestion) => {
        const text = `${s.title} ${s.description || ''}`.toLowerCase()
        return queryWords.every(word => text.includes(word))
      })
    }
  }
  
  return filtered.slice(0, 5).map(s => ({
    id: s.id,
    title: s.title,
    description: s.description || '',
  }))
})

// Slot props
const headerSlotProps = computed<HeaderSlotProps>(() => ({
  quota: store.quota,
  isFullscreen: isFullscreen.value,
  hasHistory: store.chatHistory.length > 0,
  onNewChat: startNewChat,
  onClose: handleClose,
  onMinimize: handleMinimize,
  onToggleFullscreen: toggleFullscreen,
}))

const inputSlotProps = computed<InputSlotProps>(() => ({
  modelValue: question.value,
  sending: store.sending,
  disabled: false,
  onSubmit: handleSend,
  onCancel: () => store.cancelRequest(),
}))

function applySuggestion(suggestion: { id: string; title: string; description: string }) {
  const original = (suggestions.value || []).find((s: AISuggestion) => s.id === suggestion.id)
  if (original) {
    question.value = resolvePrompt(original)
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function handleMinimize() {
  modelValue.value = false
}

function handleClose() {
  if (props.confirmClose && !isSetupMode.value && store.chatHistory.length > 0) {
    showCloseConfirm.value = true
  } else {
    modelValue.value = false
    emit('close')
  }
}

function confirmCloseAction() {
  showCloseConfirm.value = false
  store.clearChatHistory()
  modelValue.value = false
  emit('close')
}

function handleContactSupport() {
  emit('contact-support')
}

function toggleSupportMode() {
  store.toggleSupportMode()
}

async function scrollToBottom() {
  await nextTick()
  const el = document.getElementById('rai-chat-bottom')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
}

function onExampleClick(item: { prompt: string }) {
  question.value = item.prompt
  store.clearError()
}

function startNewChat() {
  store.clearChatHistory()
  emit('new-chat')
}

function copyToClipboard(_message: any) {
  // Event bubbled from ChatMessage
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function resetLoadingText() {
  loadingMessage.value = getLabel('loadingText')
}

async function updateLoadingText() {
  loadingMessage.value = getLabel('loadingText')
  await delay(2000)
  if (!store.sending) { resetLoadingText(); return }
  loadingMessage.value = getLabel('analyzingText')
  await delay(3000)
  if (!store.sending) { resetLoadingText(); return }
  loadingMessage.value = getLabel('craftingText')
}

interface InputMention {
  id: string
  name: string
  type?: string
  metadata?: Record<string, any>
}

interface SendPayload {
  message: string
  attachments: ChatAttachment[]
  mentions: InputMention[]
  isSupportRequest?: boolean
}

async function handleSend(payload: SendPayload) {
  const { message, attachments, mentions, isSupportRequest } = payload
  if (store.sending) return

  store.clearError()
  updateLoadingText()
  await nextTick()
  scrollToBottom()

  const normalizedMentions: Mention[] = mentions.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type || 'unknown',
    metadata: m.metadata
  }))

  const answered = await store.askQuestion(message, attachments, normalizedMentions, isSupportRequest)
  resetLoadingText()

  if (answered) scrollToBottom()
}

async function handleRetry() {
  updateLoadingText()
  const answered = await store.retry()
  resetLoadingText()
  if (answered) scrollToBottom()
}

function handleEscapeKey(e: KeyboardEvent) {
  if (!props.closeOnEscape) return
  if (e.key === 'Escape' && modelValue.value) {
    if (showCloseConfirm.value) {
      showCloseConfirm.value = false
    } else {
      handleMinimize()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<style scoped>
/* Slide from right (default) */
.rai-slide-left-enter-active,
.rai-slide-left-leave-active {
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.rai-slide-left-enter-from,
.rai-slide-left-leave-to {
  transform: translateX(100%);
}

/* Slide from left */
.rai-slide-right-enter-active,
.rai-slide-right-leave-active {
  transition: transform 280ms cubic-bezier(0.32, 0.72, 0, 1);
}
.rai-slide-right-enter-from,
.rai-slide-right-leave-to {
  transform: translateX(-100%);
}

/* Backdrop fade */
.rai-fade-enter-active,
.rai-fade-leave-active {
  transition: opacity 200ms ease-out;
}
.rai-fade-enter-from,
.rai-fade-leave-to {
  opacity: 0;
}
</style>
