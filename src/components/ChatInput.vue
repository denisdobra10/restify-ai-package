<template>
  <div
    class="px-4 pb-4 bg-white dark:bg-gray-900 sticky bottom-0"
    :class="uiClasses.root"
    @dragenter.prevent="fileAttachments.handleDragEnter"
    @dragover.prevent="fileAttachments.handleDragOver"
    @dragleave.prevent="fileAttachments.handleDragLeave"
    @drop.prevent="fileAttachments.handleDrop"
  >
    <form
      :class="uiClasses.form"
      @submit.prevent="handleSubmit"
    >
      <div class="max-w-3xl mx-auto space-y-3">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          multiple
          :accept="fileAttachments.acceptedFileTypes"
          @change="fileAttachments.handleFileSelect"
        >

        <!-- Attachments Preview -->
        <AttachmentsPreview
          v-if="fileAttachments.hasAttachments.value"
          :attachments="fileAttachments.attachments.value"
          :ui="uiClasses"
          :texts="texts"
          :is-image="fileAttachments.isImage"
          :format-file-size="fileAttachments.formatFileSize"
          @remove="fileAttachments.removeAttachment"
        />

        <div
          class="relative"
          :class="uiClasses.inputContainer"
        >
          <!-- Suggestions Dropdown -->
          <SuggestionsDropdown
            v-if="suggestionsHandler.showSuggestions.value && suggestions.length > 0"
            ref="suggestionsHandler.dropdownRef.value"
            :suggestions="suggestions"
            :selected-index="suggestionsHandler.selectedSuggestionIndex.value"
            :ui="uiClasses"
            @select="handleSuggestionClick"
            @hover="suggestionsHandler.selectedSuggestionIndex.value = $event"
          />

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
              v-if="mentionHandler.showMentions.value && mentionHandler.mentionItems.value.length > 0"
              :items="mentionHandler.mentionItems.value"
              :selected-index="mentionHandler.selectedMentionIndex.value"
              :providers="mentionHandler.mentionProviders.value"
              @select="mentionHandler.handleMentionSelect"
              @update:selected-index="mentionHandler.selectedMentionIndex.value = $event"
            />
          </Transition>

          <!-- Input Container -->
          <div
            class="rounded-2xl border shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
            :class="[
              uiClasses.inputWrapper,
              {
                'border-primary shadow-primary/30': isFocused || fileAttachments.isDraggingFiles.value,
                'border-gray-200 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900': !isFocused && !fileAttachments.isDraggingFiles.value,
              }
            ]"
          >
            <!-- Attach Button -->
            <button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition z-10"
              :class="uiClasses.attachButton"
              :title="texts?.attachFiles || 'Attach files'"
              @click="triggerFilePicker"
            >
              <IconPaperclip class="w-5 h-5" />
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
                class="block w-full bg-transparent py-3 text-sm leading-5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 focus:outline-none focus-visible:outline-none resize-none"
                :class="uiClasses.textarea"
                :style="textareaStyle"
                @input="handleTextInput"
                @keydown="handleKeyDown"
                @focus="handleFocus"
                @blur="handleBlur"
              />
            </div>

            <!-- Right side buttons -->
            <InputActions
              :sending="sending"
              :can-send="canSend"
              :support-request-mode="supportRequestMode"
              :show-support-mode-toggle="showSupportModeToggle"
              :ui="uiClasses"
              :texts="texts"
              @toggle-support-mode="$emit('toggle-support-mode')"
              @click="handleButtonClick"
            />
          </div>
        </div>

        <!-- Context Link Slot -->
        <slot name="context-link">
          <div
            v-if="contextLinkText"
            class="flex justify-center"
          >
            <button
              type="button"
              class="text-xs text-gray-400 hover:text-primary transition-colors"
              :class="uiClasses.contextLink"
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
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import { useFileAttachments, useMentionInput, useInputSuggestions, useTextareaResize } from '../composables/useChatInput'
import MentionList from './MentionList.vue'
import AttachmentsPreview from './input/AttachmentsPreview.vue'
import SuggestionsDropdown from './input/SuggestionsDropdown.vue'
import InputActions from './input/InputActions.vue'
import { IconPaperclip } from './icons'
import type { ChatInputUI, ChatInputTexts } from '../types'

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
  ui?: ChatInputUI
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

// UI class helper
const uiClasses = computed(() => props.ui || {})

interface Mention {
  id: string
  name: string
  type?: string
  metadata?: Record<string, any> | null
}

interface SubmitPayload {
  message: string
  attachments: any[]
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

// Refs
const internalValue = ref(props.modelValue)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

// Composables
const fileAttachments = useFileAttachments()

const mentionHandler = useMentionInput(
  () => internalValue.value,
  (value) => { internalValue.value = value },
  () => textareaRef.value
)

const suggestionsHandler = useInputSuggestions(
  () => props.suggestions,
  () => props.hasHistory,
  () => isFocused.value,
  () => internalValue.value,
  (suggestion) => {
    emit('suggestion-select', suggestion)
    nextTick(() => textareaRef.value?.focus())
  }
)

const { adjustTextareaHeight } = useTextareaResize(() => textareaRef.value)

// Computed
const computedPlaceholder = computed(() => {
  return props.supportRequestMode ? props.supportPlaceholder : props.placeholder
})

const textareaStyle = computed(() => {
  if (!props.showSupportModeToggle) {
    return { paddingLeft: '3rem', paddingRight: '3.5rem' }
  }
  if (props.supportRequestMode) {
    return { paddingLeft: '3rem', paddingRight: '8rem' }
  }
  return { paddingLeft: '3rem', paddingRight: '6rem' }
})

const isValid = computed(() => {
  const trimmed = internalValue.value?.trim() ?? ''
  if (trimmed.length >= props.minLength) return true
  return fileAttachments.hasAttachments.value
})

const canSend = computed(() => 
  !props.disabled && 
  !props.sending && 
  isValid.value && 
  !fileAttachments.isUploading.value
)

// Watchers
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
  nextTick(adjustTextareaHeight)
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
  nextTick(adjustTextareaHeight)
  mentionHandler.checkForMentions(newValue)
  suggestionsHandler.updateSuggestionsVisibility()
})

watch(() => props.suggestions, () => {
  suggestionsHandler.updateSuggestionsVisibility()
})

// Handlers
function handleTextInput() {
  adjustTextareaHeight()
}

function handleKeyDown(evt: KeyboardEvent) {
  // Try mention navigation first
  if (mentionHandler.handleMentionKeyDown(evt)) return
  
  // Try suggestion navigation
  if (suggestionsHandler.handleSuggestionKeyDown(evt)) return

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

  const payloadAttachments = fileAttachments.buildPayload()
  const message = internalValue.value.trim()
  const payloadMentions = mentionHandler.getMentions()

  emit('submit', {
    message,
    attachments: payloadAttachments,
    mentions: payloadMentions,
    isSupportRequest: props.supportRequestMode,
  })

  internalValue.value = ''
  fileAttachments.clearAttachments()
  mentionHandler.clearMentions()
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
  if (!fileAttachments.canAddMore.value) return
  fileInputRef.value?.click()
}

function handleSuggestionClick(suggestion: Suggestion) {
  suggestionsHandler.handleSuggestionClick(suggestion)
}

function handleFocus() {
  isFocused.value = true
  suggestionsHandler.updateSuggestionsVisibility()
}

function handleBlur() {
  isFocused.value = false
  setTimeout(() => {
    suggestionsHandler.hideSuggestions()
    mentionHandler.showMentions.value = false
  }, 200)
}

defineExpose({
  focus: () => textareaRef.value?.focus()
})

onMounted(() => {
  nextTick(adjustTextareaHeight)
})
</script>
