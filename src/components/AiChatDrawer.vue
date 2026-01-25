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
        class="fixed bottom-0 z-50 flex-shrink-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl will-change-transform"
        :class="[
          position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          ui?.drawer
        ]"
        :style="{ width: isFullscreen ? fullscreenWidth : width, top: topOffset, height: `calc(100vh - ${topOffset})` }"
      >
        <div 
          class="h-full flex flex-col relative bg-white dark:bg-gray-900"
          :class="ui?.panel"
        >
          <!-- Header Slot -->
          <slot
            name="header"
            v-bind="headerSlotProps"
          >
            <DrawerHeader
              :ui="ui"
              :is-setup-mode="isSetupMode"
              :show-new-chat-button="showNewChatButton"
              :has-history="store.chatHistory.length > 0"
              :show-quota="showQuota"
              :quota="store.quota"
              :show-close-button="showCloseButton"
              :show-minimize-button="showMinimizeButton"
              :show-fullscreen-toggle="showFullscreenToggle"
              :is-fullscreen="isFullscreen"
              :show-message-count="showMessageCount"
              :message-count="store.quota.used"
              :message-limit="store.quota.limit"
              :t="t"
              @new-chat="startNewChat"
              @close="handleClose"
              @minimize="handleMinimize"
              @toggle-fullscreen="toggleFullscreen"
            >
              <template #quota>
                <slot
                  name="quota"
                  :quota="store.quota"
                />
              </template>
            </DrawerHeader>
          </slot>

          <div 
            class="h-full flex flex-col mx-auto w-full overflow-hidden" 
            :class="[{ 'max-w-5xl': isFullscreen }, ui?.body]"
          >
            <!-- Setup Mode -->
            <div
              v-if="isSetupMode"
              class="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto"
            >
              <slot name="setup">
                <SetupGuide
                  :copied="copied"
                  @copy="copySetupCode"
                />
              </slot>
            </div>

            <!-- Normal mode -->
            <template v-else>
              <!-- Empty State -->
              <div
                v-if="store.chatHistory.length === 0"
                class="flex-1 flex flex-col overflow-y-auto"
              >
                <slot
                  name="empty-state"
                  :suggestions="mappedSuggestions"
                  :on-click="onExampleClick"
                >
                  <AiEmptyState @item-click="onExampleClick" />
                </slot>
              </div>

              <!-- Chat Messages -->
              <div
                v-else
                ref="chatContainer"
                class="flex-1 overflow-y-auto py-6 pb-24"
              >
                <DrawerMessageList
                  :messages="store.chatHistory"
                  :loading-message="loadingMessage"
                  :quota="store.quota"
                  :error="store.error"
                  :ui="ui"
                  :t="t"
                  @copy="copyToClipboard"
                  @contact-support="handleContactSupport"
                  @retry="handleRetry"
                >
                  <template #message="slotProps">
                    <slot 
                      name="message" 
                      :message="slotProps.message" 
                      :is-user="slotProps.isUser" 
                      :is-loading="slotProps.isLoading" 
                      :is-streaming="slotProps.isStreaming"
                    />
                  </template>
                </DrawerMessageList>
              </div>

              <div
                id="rai-chat-bottom"
                class="h-8"
              />

              <!-- Chat Input -->
              <slot
                name="input"
                v-bind="inputSlotProps"
              >
                <ChatInput
                  ref="chatInputRef"
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
        <ConfirmDialog
          :show="showCloseConfirm"
          :title="t('closeConfirmTitle')"
          :message="t('closeConfirmMessage')"
          :confirm-text="t('confirmClose')"
          :cancel-text="t('cancel')"
          :ui="ui"
          confirm-variant="danger"
          @confirm="confirmCloseAction"
          @cancel="showCloseConfirm = false"
        />

        <!-- History Limit Warning Dialog -->
        <ConfirmDialog
          :show="showHistoryLimitWarning"
          :title="historyLimitDialogTitle"
          :message="historyLimitDialogMessage"
          :confirm-text="t('startNewChat')"
          :cancel-text="historyLimitReached ? t('continueChat') : t('cancel')"
          :ui="ui"
          :icon="'warning'"
          confirm-variant="primary"
          @confirm="handleHistoryLimitAction"
          @cancel="dismissHistoryLimitWarning"
        />
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRestifyAiStore } from '../store'
import { getLabel, isConfigured, getConfigValue } from '../config'
import { useAiSuggestions } from '../composables/useAiSuggestions'
import { useLoadingText } from '../composables/useLoadingText'
import { useHistoryLimit } from '../composables/useHistoryLimit'
import { useSuggestionFilter } from '../composables/useSuggestionFilter'
import { useAutoScroll } from '../composables/useAutoScroll'
import AiEmptyState from './AiEmptyState.vue'
import ChatInput from './ChatInput.vue'
import DrawerHeader from './drawer/DrawerHeader.vue'
import DrawerMessageList from './drawer/DrawerMessageList.vue'
import SetupGuide from './drawer/SetupGuide.vue'
import ConfirmDialog from './drawer/ConfirmDialog.vue'
import type { 
  ChatAttachment,
  AISuggestion,
  Mention, 
  HeaderSlotProps, 
  InputSlotProps,
  AiChatDrawerUI,
  AiChatDrawerTexts,
  HistoryLimitConfig,
  LoadingTextConfig,
} from '../types'

interface Props {
  modelValue: boolean
  ui?: AiChatDrawerUI
  texts?: AiChatDrawerTexts
  width?: string
  fullscreenWidth?: string
  topOffset?: string
  position?: 'left' | 'right'
  showBackdrop?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showQuota?: boolean
  showMessageCount?: boolean
  showFullscreenToggle?: boolean
  showMinimizeButton?: boolean
  showCloseButton?: boolean
  showNewChatButton?: boolean
  confirmClose?: boolean
  historyLimit?: HistoryLimitConfig
  loadingText?: LoadingTextConfig
  autoFetchQuota?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '600px',
  fullscreenWidth: '90vw',
  topOffset: '0',
  position: 'right',
  showBackdrop: false,
  closeOnBackdropClick: true,
  closeOnEscape: true,
  showQuota: true,
  showMessageCount: true,
  showFullscreenToggle: true,
  showMinimizeButton: true,
  showCloseButton: true,
  showNewChatButton: true,
  confirmClose: true,
  autoFetchQuota: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'contact-support'): void
  (e: 'new-chat'): void
}>()

// v-model
const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Text helper
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

// Store & State
const store = useRestifyAiStore()
const question = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null)
const isFullscreen = ref(false)
const copied = ref(false)
const showCloseConfirm = ref(false)

// Composables
const { loadingMessage, startLoadingText, resetLoadingText } = useLoadingText(
  () => store.sending,
  () => props.loadingText
)

const {
  showHistoryLimitWarning,
  historyLimitReached,
  historyLimitDialogTitle,
  historyLimitDialogMessage,
  dismissHistoryLimitWarning,
  handleHistoryLimitAction: handleLimitAction,
  checkHistoryLimit,
  setPendingMessage,
} = useHistoryLimit({
  getHistoryLength: () => store.quota.limit - store.quota.remaining,
  getStoreLimit: () => store.quota.limit,
  getConfig: () => props.historyLimit,
  getTexts: () => props.texts,
  onStartNewChat: () => store.clearChatHistory(),
  onNewChatEmit: () => emit('new-chat'),
})

// Computed
const isSetupMode = computed(() => !isConfigured())
const enableSupportMode = computed(() => getConfigValue('enableSupportMode') ?? false)

const { suggestions, resolvePrompt } = useAiSuggestions()

// Auto-scroll management
const { scrollToBottom, watchForScroll } = useAutoScroll(chatContainer)

// Suggestion filtering
const enabledSuggestions = computed(() => isSetupMode.value ? [] : (suggestions.value || []))
const { filteredSuggestions: mappedSuggestions } = useSuggestionFilter(enabledSuggestions, question)

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

// Actions
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

function copySetupCode() {
  const code = `import { RestifyAiPlugin } from '@doderasoftware/restify-ai'

app.use(RestifyAiPlugin, {
  endpoints: {
    ask: '/api/ai/ask',
    quota: '/api/ai/quota', // optional
  },
  getAuthToken: () => getToken(),
})`
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// History limit action handler
async function handleHistoryLimitAction() {
  const pending = await handleLimitAction()
  if (pending) {
    await nextTick()
    await processSend(pending.message, pending.attachments, pending.mentions, pending.isSupportRequest)
  }
}

// Message handling
interface InputMention {
  id: string
  name: string
  type?: string
  metadata?: Record<string, any> | null
}

interface SendPayload {
  message: string
  attachments: ChatAttachment[]
  mentions: InputMention[]
  isSupportRequest?: boolean
}

async function processSend(message: string, attachments: ChatAttachment[], mentions: Mention[], isSupportRequest?: boolean) {
  store.clearError()
  startLoadingText()
  await nextTick()
  scrollToBottom()

  const answered = await store.askQuestion(message, attachments, mentions, isSupportRequest)
  resetLoadingText()

  if (answered) scrollToBottom()
}

async function handleSend(payload: SendPayload) {
  const { message, attachments, mentions, isSupportRequest } = payload
  if (store.sending) return

  const normalizedMentions: Mention[] = mentions.map(m => ({
    id: m.id,
    name: m.name,
    type: m.type || 'unknown',
    metadata: m.metadata
  }))

  // Check history limit before sending
  if (!checkHistoryLimit()) {
    setPendingMessage({ message, attachments, mentions: normalizedMentions, isSupportRequest })
    return
  }

  await processSend(message, attachments, normalizedMentions, isSupportRequest)
}

async function handleRetry() {
  startLoadingText()
  const answered = await store.retry()
  resetLoadingText()
  if (answered) scrollToBottom()
}

// Keyboard handling
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

// Setup scroll watchers
watchForScroll(
  () => store.chatHistory.length,
  () => store.chatHistory.map((m: any) => m.message).join("")
)

// Auto-fetch quota and focus when drawer opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    await scrollToBottom()
    chatInputRef.value?.focus()
  }
  if (isOpen && props.autoFetchQuota) {
    store.fetchQuota()
  }
}, { immediate: true })

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
