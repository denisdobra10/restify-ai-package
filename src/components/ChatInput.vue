<template>
  <div
    class="px-4 pb-4 bg-white dark:bg-gray-900 sticky bottom-0"
    :class="ui.root"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <form @submit.prevent="handleSubmit" :class="ui.form">
      <div class="max-w-3xl mx-auto space-y-3">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          multiple
          :accept="acceptedFileTypes"
          @change="handleFileSelect"
        />

        <!-- Attachments Preview -->
        <div 
          v-if="attachments.length" 
          class="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 bg-gray-50 dark:bg-gray-800 space-y-3"
          :class="ui.attachmentsContainer"
        >
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {{ texts?.attachedFiles || 'Attached files' }}
          </p>
          <ul class="space-y-2">
            <li
              v-for="file in attachments"
              :key="file.id"
              class="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-700 p-2 shadow-sm border border-gray-100 dark:border-gray-600"
              :class="ui.attachmentItem"
            >
              <div 
                class="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-600 overflow-hidden"
                :class="ui.attachmentThumbnail"
              >
                <img
                  v-if="isImage(file)"
                  :src="file.previewUrl || file.url"
                  class="object-cover h-full w-full"
                  alt=""
                />
                <svg v-else class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>
                <div v-if="file.uploading" class="mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all" :style="{ width: `${file.progress ?? 10}%` }" />
                </div>
              </div>
              <span v-if="file.uploading" class="text-xs text-gray-400">
                {{ Math.round(file.progress ?? 0) }}%
              </span>
              <button
                type="button"
                class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="ui.attachmentRemove"
                :disabled="file.uploading"
                @click="removeAttachment(file.id)"
              >
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <div class="relative" :class="ui.inputContainer">
          <!-- Suggestions Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showSuggestions && suggestions.length > 0"
              ref="dropdownRef"
              class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg max-h-80 overflow-y-auto z-10"
              :class="ui.suggestionsDropdown"
            >
              <ul class="py-1">
                <li
                  v-for="(suggestion, index) in suggestions"
                  :key="suggestion.id"
                  class="px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  :class="[
                    ui.suggestionItem,
                    {
                      [ui.suggestionItemSelected || 'bg-primary/10']: index === selectedSuggestionIndex,
                      'hover:bg-gray-50 dark:hover:bg-gray-700': index !== selectedSuggestionIndex
                    }
                  ]"
                  @click="handleSuggestionClick(suggestion)"
                  @mouseenter="selectedSuggestionIndex = index"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ suggestion.title }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {{ suggestion.description }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Transition>

          <!-- Mention Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MentionList
              v-if="showMentions && mentionItems.length > 0"
              :items="mentionItems"
              :selected-index="selectedMentionIndex"
              :providers="mentionProviders"
              @select="handleMentionSelect"
              @update:selected-index="selectedMentionIndex = $event"
            />
          </Transition>

          <!-- Input Container -->
          <div
            class="rounded-2xl border shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
            :class="[
              ui.inputWrapper,
              {
                'border-primary shadow-primary/30': isFocused || isDraggingFiles,
                'border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900': !isFocused && !isDraggingFiles,
              }
            ]"
          >
            <!-- Attach Button -->
            <button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition z-10"
              :class="ui.attachButton"
              :title="texts?.attachFiles || 'Attach files'"
              @click="triggerFilePicker"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
              </svg>
            </button>

            <!-- Textarea -->
            <div class="flex items-center">
              <textarea
                ref="textareaRef"
                v-model="internalValue"
                rows="1"
                data-ai-input
                :placeholder="computedPlaceholder"
                :disabled="disabled"
                class="block w-full bg-transparent py-3 text-sm leading-5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 focus:outline-none focus-visible:outline-none resize-none pl-12"
                :class="[ui.textarea, textareaRightPadding]"
                @input="handleTextInput"
                @keydown="handleKeyDown"
                @focus="handleFocus"
                @blur="handleBlur"
              />
            </div>

            <!-- Right side buttons -->
            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
              <!-- Support Mode Toggle (question mark) - only when configured AND not in support mode -->
              <button
                v-if="showSupportModeToggle && !supportRequestMode"
                type="button"
                class="h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
                :class="ui.supportToggle"
                :title="texts?.toggleSupportMode || getLabel('toggleSupportMode')"
                @click="toggleSupportMode"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </button>

              <!-- Support Mode Active Badge - only when in support mode -->
              <button
                v-if="showSupportModeToggle && supportRequestMode"
                type="button"
                class="h-7 px-2 rounded-lg flex items-center gap-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition flex-shrink-0"
                :class="ui.supportBadge"
                :title="texts?.exitSupportMode || getLabel('exitSupportMode')"
                @click="toggleSupportMode"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span>{{ texts?.supportLabel || 'Support' }}</span>
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Send/Stop Button -->
              <button
                :disabled="!canSend && !sending"
                class="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
                :class="[
                  ui.sendButton,
                  {
                    [ui.sendButtonActive || 'bg-primary text-white hover:bg-primary/90']: canSend && !sending,
                    [ui.stopButton || 'bg-red-500 text-white hover:bg-red-600']: sending,
                    [ui.sendButtonDisabled || 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60']: !canSend && !sending,
                  }
                ]"
                type="button"
                @click.prevent="handleButtonClick"
              >
                <svg v-if="!sending" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Context Link Slot -->
        <slot name="context-link">
          <div v-if="contextLinkText" class="flex justify-center">
            <button
              type="button"
              class="text-xs text-gray-400 hover:text-primary transition-colors"
              :class="ui.contextLink"
              @click="$emit('context-link-click')"
            >
              {{ contextLinkText }}
            </button>
          </div>
        </slot>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { getConfigValue, getLabel, getRestifyAiConfig } from '../config'
import { useRestifyAiStore } from '../store'
import { detectMentionContext, getActiveMentionProviders } from '../composables/useMentionParsing'
import MentionList from './MentionList.vue'
import type { ChatAttachment, MentionItem, MentionProvider, ChatInputUI, ChatInputTexts } from '../types'

interface Suggestion {
  id: string
  title: string
  description: string
}

interface Props {
  modelValue: string
  disabled?: boolean
  sending?: boolean
  placeholder?: string
  supportPlaceholder?: string
  minLength?: number
  suggestions?: Suggestion[]
  hasHistory?: boolean
  supportRequestMode?: boolean
  showSupportModeToggle?: boolean
  contextLinkText?: string
  /** Custom UI classes for styling */
  ui?: ChatInputUI
  /** Custom text overrides for i18n support */
  texts?: ChatInputTexts
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  sending: false,
  placeholder: 'Ask me anything...',
  supportPlaceholder: 'Describe your support request...',
  minLength: 3,
  suggestions: () => [],
  hasHistory: false,
  supportRequestMode: false,
  showSupportModeToggle: false,
  contextLinkText: '',
})

// Text helper with props fallback
const t = (key: keyof ChatInputTexts): string => {
  if (props.texts?.[key]) {
    return props.texts[key] as string
  }
  // Fallback mappings
  const labelMappings: Record<keyof ChatInputTexts, string> = {
    placeholder: 'inputPlaceholder',
    supportPlaceholder: 'supportPlaceholder',
    attachedFiles: 'attachedFiles',
    attachFiles: 'attachFiles',
    toggleSupportMode: 'toggleSupportMode',
    exitSupportMode: 'exitSupportMode',
    supportLabel: 'support',
  }
  return getLabel(labelMappings[key] as any) || key
}

// UI class helpers
const ui = computed(() => props.ui || {})

interface Mention {
  id: string
  name: string
  type?: string
  metadata?: Record<string, any>
}

interface SubmitPayload {
  message: string
  attachments: ChatAttachment[]
  mentions: Mention[]
  isSupportRequest?: boolean
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', payload: SubmitPayload): void
  (e: 'cancel'): void
  (e: 'suggestion-select', suggestion: Suggestion): void
  (e: 'toggle-support-mode'): void
  (e: 'context-link-click'): void
}>()

const internalValue = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isFocused = ref(false)
const isDraggingFiles = ref(false)
const dragItemCounter = ref(0)

const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)
const dropdownRef = ref<HTMLElement | null>(null)

// Mentions
const showMentions = ref(false)
const mentionItems = ref<MentionItem[]>([])
const selectedMentionIndex = ref(0)
const mentionContext = ref({ inMention: false, query: '', startPos: 0 })
const insertedMentions = ref<Mention[]>([])

const mentionProviders = computed<MentionProvider[]>(() => {
  const config = getRestifyAiConfig()
  return config?.mentionProviders || []
})

interface UploadingAttachment extends ChatAttachment {
  uploading?: boolean
  progress?: number
  previewUrl?: string
}

const attachments = ref<UploadingAttachment[]>([])
const MAX_TEXTAREA_HEIGHT = 300
const maxAttachments = getConfigValue('maxAttachments') || 5
const maxFileSize = getConfigValue('maxFileSize') || 10 * 1024 * 1024
const acceptedFileTypes = getConfigValue('acceptedFileTypes') || 'image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv'

const computedPlaceholder = computed(() => {
  return props.supportRequestMode ? props.supportPlaceholder : props.placeholder
})

// Calculate right padding based on visible buttons
// Send button: ~48px, Support toggle: ~40px, Support badge: ~90px
const textareaRightPadding = computed(() => {
  if (!props.showSupportModeToggle) {
    return 'pr-14' // Just send button
  }
  if (props.supportRequestMode) {
    return 'pr-32' // Send button + support badge (wider)
  }
  return 'pr-24' // Send button + question mark toggle
})

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
  nextTick(adjustTextareaHeight)
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
  nextTick(adjustTextareaHeight)
  checkForMentions(newValue)
})

const hasAttachments = computed(() => attachments.value.length > 0)
const isUploading = computed(() => attachments.value.some(a => a.uploading))

function adjustTextareaHeight() {
  const textarea = textareaRef.value
  if (!textarea) return

  textarea.style.height = 'auto'
  const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)
  textarea.style.height = `${nextHeight}px`
  textarea.style.overflowY = textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'
}

const isValid = computed(() => {
  const trimmed = internalValue.value?.trim() ?? ''
  if (trimmed.length >= props.minLength) return true
  return hasAttachments.value
})

const canSend = computed(() => !props.disabled && !props.sending && isValid.value && !isUploading.value)

function handleTextInput() {
  adjustTextareaHeight()
}

function toggleSupportMode() {
  emit('toggle-support-mode')
}

// Mention detection
function checkForMentions(text: string) {
  const textarea = textareaRef.value
  if (!textarea) return

  const cursorPos = textarea.selectionStart
  const context = detectMentionContext(text, cursorPos)
  mentionContext.value = context

  if (context.inMention && context.query.length >= 0) {
    searchMentions(context.query)
  } else {
    showMentions.value = false
    mentionItems.value = []
  }
}

async function searchMentions(query: string) {
  const providers = getActiveMentionProviders()
  if (providers.length === 0) {
    showMentions.value = false
    return
  }

  const results: MentionItem[] = []
  
  for (const provider of providers) {
    try {
      const items = await provider.search(query)
      results.push(...items.map(item => ({ ...item, type: provider.type })))
    } catch (e) {
      console.warn(`Mention provider ${provider.type} failed:`, e)
    }
  }

  mentionItems.value = results.slice(0, 10)
  showMentions.value = results.length > 0
  selectedMentionIndex.value = 0
}

function handleMentionSelect(item: MentionItem) {
  const { startPos } = mentionContext.value
  const before = internalValue.value.slice(0, startPos)
  const after = internalValue.value.slice(textareaRef.value?.selectionStart || startPos)
  
  const displayName = item.name || item.label || item.title || item.id
  internalValue.value = `${before}@${displayName} ${after}`
  
  insertedMentions.value.push({
    id: item.id,
    name: displayName,
    type: item.type,
    metadata: item.attributes,
  })
  
  showMentions.value = false
  mentionItems.value = []
  
  nextTick(() => {
    textareaRef.value?.focus()
    const newPos = before.length + displayName.length + 2
    textareaRef.value?.setSelectionRange(newPos, newPos)
  })
}

function scrollSuggestionIntoView() {
  nextTick(() => {
    const dropdown = dropdownRef.value
    if (!dropdown) return
    const selected = dropdown.querySelector(`li:nth-child(${selectedSuggestionIndex.value + 1})`) as HTMLElement
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

function handleKeyDown(evt: KeyboardEvent) {
  // Mention navigation
  if (showMentions.value && mentionItems.value.length > 0) {
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      selectedMentionIndex.value = Math.min(selectedMentionIndex.value + 1, mentionItems.value.length - 1)
      return
    }
    if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      selectedMentionIndex.value = Math.max(selectedMentionIndex.value - 1, 0)
      return
    }
    if (evt.key === 'Enter' || evt.key === 'Tab') {
      evt.preventDefault()
      const selected = mentionItems.value[selectedMentionIndex.value]
      if (selected) handleMentionSelect(selected)
      return
    }
    if (evt.key === 'Escape') {
      evt.preventDefault()
      showMentions.value = false
      return
    }
  }

  // Suggestion navigation
  if (showSuggestions.value && props.suggestions.length > 0) {
    if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      selectedSuggestionIndex.value = Math.min(selectedSuggestionIndex.value + 1, props.suggestions.length - 1)
      scrollSuggestionIntoView()
      return
    }
    if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, 0)
      scrollSuggestionIntoView()
      return
    }
    if (evt.key === 'Enter' && selectedSuggestionIndex.value >= 0) {
      evt.preventDefault()
      const selected = props.suggestions[selectedSuggestionIndex.value]
      if (selected) handleSuggestionClick(selected)
      return
    }
    if (evt.key === 'Escape') {
      evt.preventDefault()
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      return
    }
  }

  // Submit on Enter
  if (evt.key === 'Enter') {
    if (evt.shiftKey) return
    if (!props.sending && canSend.value) {
      evt.preventDefault()
      handleSubmit()
    }
  }
}

function handleSubmit() {
  if (!canSend.value) return

  const payloadAttachments = buildAttachmentPayload()
  const message = internalValue.value.trim()
  const payloadMentions = [...insertedMentions.value]

  emit('submit', {
    message,
    attachments: payloadAttachments,
    mentions: payloadMentions,
    isSupportRequest: props.supportRequestMode,
  })

  internalValue.value = ''
  clearAttachments()
  insertedMentions.value = []
  nextTick(adjustTextareaHeight)
}

function handleButtonClick() {
  if (props.sending) {
    emit('cancel')
  } else if (canSend.value) {
    handleSubmit()
  }
}

function triggerFilePicker() {
  if (props.disabled || props.sending) return
  if (attachments.value.length >= maxAttachments) return
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length) processFiles(files)
  target.value = ''
}

function processFiles(fileList: FileList | File[] | null) {
  if (!fileList) return

  const items = Array.from(fileList)
  for (const file of items) {
    if (attachments.value.length >= maxAttachments) break
    if (file.size > maxFileSize) continue
    addLocalFile(file)
  }
}

function addLocalFile(file: File) {
  const id = crypto.randomUUID()
  const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  const config = getRestifyAiConfig()
  const hasUploadEndpoint = !!config?.endpoints?.uploadFile
  
  const attachment: UploadingAttachment = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploading: hasUploadEndpoint,
    progress: hasUploadEndpoint ? 0 : 100,
    previewUrl,
  }
  
  attachments.value.push(attachment)
  
  // If upload endpoint is configured, upload the file
  if (hasUploadEndpoint) {
    uploadFileToServer(file, id)
  }
}

async function uploadFileToServer(file: File, attachmentId: string) {
  const store = useRestifyAiStore()
  
  try {
    const result = await store.uploadFile(file)
    const index = attachments.value.findIndex(a => a.id === attachmentId)
    
    if (index === -1) return
    
    if (result) {
      // Keep the original previewUrl for images
      const existingPreview = attachments.value[index].previewUrl
      attachments.value[index] = {
        ...attachments.value[index],
        id: result.id || attachmentId,
        url: result.url,
        extractedText: result.extractedText,
        uploading: false,
        progress: 100,
        previewUrl: existingPreview || result.previewUrl,
      }
    } else {
      // Upload failed, remove attachment
      removeAttachment(attachmentId)
    }
  } catch {
    removeAttachment(attachmentId)
  }
}

function isImage(file: UploadingAttachment): boolean {
  const type = file.type || ''
  if (type.startsWith('image/')) return true
  return /(png|jpe?g|gif|webp)$/i.test(file.name)
}

function formatFileSize(size?: number | string): string {
  if (size === undefined || size === null) return ''
  const value = typeof size === 'string' ? parseInt(size, 10) : size
  if (Number.isNaN(value)) return ''
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
  if (value >= 1024) return `${Math.round(value / 1024)} KB`
  return `${value} B`
}

function removeAttachment(id: string) {
  const index = attachments.value.findIndex(a => a.id === id)
  if (index === -1) return
  const [removed] = attachments.value.splice(index, 1)
  if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
}

function clearAttachments() {
  attachments.value.forEach(a => {
    if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
  })
  attachments.value = []
}

function buildAttachmentPayload(): ChatAttachment[] {
  return attachments.value
    .filter(a => !a.uploading)
    .map(a => ({
      id: a.id,
      name: a.name,
      url: a.url,
      type: a.type,
      size: a.size,
    }))
}

function hasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types || []).includes('Files')
}

function handleDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return
  dragItemCounter.value += 1
  isDraggingFiles.value = true
}

function handleDragOver(event: DragEvent) {
  if (!hasFiles(event)) event.preventDefault()
}

function handleDragLeave(event: DragEvent) {
  if (!hasFiles(event)) return
  dragItemCounter.value = Math.max(0, dragItemCounter.value - 1)
  if (dragItemCounter.value === 0) isDraggingFiles.value = false
}

function handleDrop(event: DragEvent) {
  if (!hasFiles(event)) return
  dragItemCounter.value = 0
  isDraggingFiles.value = false
  processFiles(event.dataTransfer?.files || null)
}

function handleSuggestionClick(suggestion: Suggestion) {
  emit('suggestion-select', suggestion)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  nextTick(() => textareaRef.value?.focus())
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
  setTimeout(() => {
    showSuggestions.value = false
    showMentions.value = false
    selectedSuggestionIndex.value = -1
  }, 200)
}

watch(internalValue, (newValue) => {
  if (newValue && !props.hasHistory && isFocused.value && props.suggestions.length > 0) {
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
})

watch(() => props.suggestions, (newSuggestions) => {
  if (internalValue.value && !props.hasHistory && isFocused.value && newSuggestions.length > 0) {
    showSuggestions.value = true
  } else if (newSuggestions.length === 0) {
    showSuggestions.value = false
  }
})

onMounted(() => {
  nextTick(adjustTextareaHeight)
})

onBeforeUnmount(() => {
  clearAttachments()
})
</script>
