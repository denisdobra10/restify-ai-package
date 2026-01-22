<template>
  <div
    class="group relative animate-in fade-in slide-in-from-bottom-2 duration-300"
    :class="[
      ui.root,
      {
        'flex justify-end': message.role === 'user',
        'flex justify-start': message.role === 'assistant',
      }
    ]"
  >
    <!-- User Message Layout -->
    <div 
      v-if="message.role === 'user'" 
      class="flex gap-3 justify-end"
      :class="ui.userMessage"
    >
      <!-- Message Content -->
      <div 
        class="rounded-2xl px-4 py-3 bg-primary-500 text-white max-w-fit"
        :class="ui.userBubble"
      >
        <p
          v-if="message.message"
          class="text-sm whitespace-pre-wrap"
          :class="[ui.content, { 'line-clamp-4': !isExpanded && isLongMessage }]"
        >
          {{ message.message }}
        </p>
        <button
          v-if="isLongMessage"
          class="mt-2 text-xs text-white/80 hover:text-white underline"
          :class="ui.showMoreButton"
          @click="toggleExpanded"
        >
          {{ isExpanded ? t('showLess') : t('showMore') }}
        </button>

        <!-- Attachments -->
        <div 
          v-if="hasAttachments" 
          class="mt-3 space-y-2"
          :class="ui.attachmentsContainer"
        >
          <component
            :is="file.url ? 'a' : 'div'"
            v-for="file in attachments"
            :key="file.id"
            :href="file.url || undefined"
            :target="file.url ? '_blank' : undefined"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-2 transition"
            :class="[ui.attachmentItem, file.url ? 'hover:bg-white/20 cursor-pointer' : '']"
          >
            <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-white/20 overflow-hidden">
              <img
                v-if="file.url && isImage(file)"
                :src="file.url"
                class="object-cover h-full w-full"
                alt=""
              >
              <svg
                v-else
                class="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">
                {{ file.name || t('attachment') }}
              </p>
              <p class="text-xs text-white/70">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
            <span
              v-if="file.url"
              class="text-xs font-medium text-white/90"
            >
              {{ t('openAttachment') }}
            </span>
          </component>
        </div>
      </div>

      <!-- User Avatar -->
      <div 
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 overflow-hidden"
        :class="ui.userAvatar"
      >
        <img 
          v-if="userAvatarUrl" 
          :src="userAvatarUrl" 
          alt="User" 
          class="h-full w-full object-cover"
        >
        <svg
          v-else
          class="h-4 w-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Assistant Message Layout -->
    <div 
      v-else 
      class="flex items-start gap-3"
      :class="ui.assistantMessage"
    >
      <!-- Avatar -->
      <div class="flex-shrink-0 group-hover:opacity-0 transition-opacity">
        <AiAvatar />
      </div>

      <!-- Message Content -->
      <div 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm rounded-2xl transition-all duration-200 max-w-[85%]"
        :class="ui.assistantBubble"
      >
        <!-- Loading State -->
        <div 
          v-if="message.loading" 
          class="flex items-center gap-2 text-sm min-w-[150px]"
          :class="ui.loadingIndicator"
        >
          <div
            class="flex space-x-1"
            :class="ui.loadingDots"
          >
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0ms"
            />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 150ms"
            />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 300ms"
            />
          </div>
          <span class="text-gray-600 dark:text-gray-400">{{ texts?.loadingText || loadingText }}</span>
        </div>

        <!-- Message Content -->
        <div
          v-else-if="message.message"
          :id="message.id"
          class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
          :class="ui.content"
          v-html="renderedMessage"
        />

        <!-- Attachments -->
        <div 
          v-if="!message.loading && hasAttachments" 
          class="mt-4 space-y-2"
          :class="ui.attachmentsContainer"
        >
          <component
            :is="file.url ? 'a' : 'div'"
            v-for="file in attachments"
            :key="file.id"
            :href="file.url || undefined"
            :target="file.url ? '_blank' : undefined"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 transition"
            :class="[ui.attachmentItem, file.url ? 'hover:bg-white dark:hover:bg-gray-600 cursor-pointer' : '']"
          >
            <div class="h-12 w-12 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-600">
              <img
                v-if="file.url && isImage(file)"
                :src="file.url"
                class="object-cover h-full w-full"
                alt=""
              >
              <svg
                v-else
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                {{ file.name || t('attachment') }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
            <span
              v-if="file.url"
              class="text-xs font-medium text-primary"
            >
              {{ t('openAttachment') }}
            </span>
          </component>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <ChatMessageActions
      v-if="message.role === 'assistant' && !message.loading && !message.streaming && showActions"
      :message="message"
      class="absolute top-0 left-0"
      :class="ui.actionsContainer"
      @copy="handleCopy"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AiAvatar from './AiAvatar.vue'
import ChatMessageActions from './ChatMessageActions.vue'
import { useChatMarkdown } from '../composables/useChatMarkdown'
import { getRestifyAiConfig } from '../config'
import type { ChatMessage, ChatAttachment, ChatMessageUI, ChatMessageTexts } from '../types'

interface Props {
  message: ChatMessage
  showActions?: boolean
  loadingText?: string
  /** Custom UI classes for styling */
  ui?: ChatMessageUI
  /** Custom text overrides for i18n support */
  texts?: ChatMessageTexts
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  loadingText: 'Gathering data...',
})

const emit = defineEmits<{
  (e: 'copy', message: ChatMessage): void
}>()

// Text helper with props fallback
const t = (key: keyof ChatMessageTexts): string => {
  if (props.texts?.[key]) {
    return props.texts[key] as string
  }
  const defaults: Record<keyof ChatMessageTexts, string> = {
    loadingText: 'Gathering data...',
    showMore: 'Show more',
    showLess: 'Show less',
    openAttachment: 'Open',
    attachment: 'Attachment',
  }
  return defaults[key] || key
}

// UI class helpers
const ui = computed(() => props.ui || {})

const { parseMarkdown } = useChatMarkdown()

const isExpanded = ref(false)
const attachments = computed<ChatAttachment[]>(() => props.message.attachments ?? [])
const hasAttachments = computed(() => attachments.value.length > 0)

const isLongMessage = computed(() => {
  if (props.message.role !== 'user') return false
  const message = props.message.message || ''
  const lineCount = message.split('\n').length
  return message.length > 200 || lineCount > 4
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function isImage(file: ChatAttachment): boolean {
  const type = file.type || ''
  if (type.startsWith('image/')) return true
  return /(png|jpe?g|gif|webp)$/i.test(file.name || '')
}

// Get user avatar from config
const userAvatarUrl = computed(() => {
  const config = getRestifyAiConfig()
  if (!config?.userAvatar) return null
  if (typeof config.userAvatar === 'string') return config.userAvatar
  if (typeof config.userAvatar === 'function') return config.userAvatar()
  return null
})

function formatFileSize(size?: number | string): string {
  if (size === undefined || size === null) return ''
  const value = typeof size === 'string' ? parseInt(size, 10) : size
  if (Number.isNaN(value)) return ''
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
  if (value >= 1024) return `${Math.round(value / 1024)} KB`
  return `${value} B`
}

const renderedMessage = computed(() => {
  if (props.message.role === 'assistant') {
    let text = props.message.message
    text = text.replace(/\\n/g, '\n')
    return parseMarkdown(text)
  }
  return props.message.message
})

function handleCopy(message: ChatMessage) {
  emit('copy', message)
}
</script>

<style lang="postcss" scoped>
/* Mention styling */
:deep(.mention) {
  @apply inline-flex items-center px-2 py-0.5 bg-primary/20 text-primary rounded-md font-medium transition-colors;
}

/* User message mentions */
:deep(.bg-primary .mention) {
  @apply bg-white/20 text-white;
}

/* Markdown content styling for assistant messages */
:deep(h1) {
  @apply text-lg font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2 first:mt-0;
}

:deep(h2) {
  @apply text-base font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2 first:mt-0;
}

:deep(h3) {
  @apply text-sm font-bold text-gray-900 dark:text-gray-100 mt-3 mb-1.5 first:mt-0;
}

:deep(h4), :deep(h5), :deep(h6) {
  @apply text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1 first:mt-0;
}

:deep(p) {
  @apply my-2 first:mt-0 last:mb-0;
}

:deep(ul) {
  @apply my-2 ml-4 list-disc space-y-1;
}

:deep(ol) {
  @apply my-2 ml-4 list-decimal space-y-1;
}

:deep(li) {
  @apply text-sm text-gray-700 dark:text-gray-200;
}

:deep(li > p) {
  @apply my-0;
}

:deep(code) {
  @apply bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-xs font-mono;
}

:deep(pre) {
  @apply bg-gray-100 dark:bg-gray-700 rounded-lg p-3 my-3 overflow-x-auto;
}

:deep(pre code) {
  @apply bg-transparent p-0 text-xs;
}

:deep(blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-3 italic text-gray-600 dark:text-gray-400;
}

:deep(a) {
  @apply text-primary hover:underline;
}

:deep(strong) {
  @apply font-semibold text-gray-900 dark:text-gray-100;
}

:deep(em) {
  @apply italic;
}

:deep(table) {
  @apply w-full my-3 text-sm border-collapse;
}

:deep(th) {
  @apply bg-gray-100 dark:bg-gray-700 px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600;
}

:deep(td) {
  @apply px-3 py-2 border border-gray-200 dark:border-gray-600;
}

:deep(hr) {
  @apply my-4 border-gray-200 dark:border-gray-600;
}
</style>
