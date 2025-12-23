<template>
  <div 
    class="flex items-center justify-between px-4 sm:px-6 pt-4 border-b border-gray-200 dark:border-gray-700 pb-4"
    :class="ui?.header"
  >
    <div class="flex items-center gap-3">
      <template v-if="!isSetupMode">
        <button
          v-if="showNewChatButton && hasHistory"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm"
          :class="ui?.newChatButton"
          @click="$emit('new-chat')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
          <span>{{ t('newChat') }}</span>
        </button>
        <span
          v-else
          class="text-xs text-gray-400 dark:text-gray-500 font-medium"
        >
          {{ t('keyboardShortcutHint') }}
        </span>
      </template>
      <div
        v-else
        class="flex items-center gap-2"
      >
        <span class="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Setup Required</span>
      </div>
    </div>

    <!-- Message Count & Quota Display -->
    <div
      v-if="!isSetupMode && (showMessageCount || showQuota)"
      class="flex items-center gap-2 ml-auto mr-4"
    >
      <!-- Message Count Badge -->
      <div 
        v-if="showMessageCount && hasHistory"
        class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800"
        :class="ui?.messageCountBadge"
      >
        <svg 
          class="w-3.5 h-3.5" 
          :class="messageCountIconClass"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span 
          class="text-xs font-medium tabular-nums"
          :class="messageCountClass"
        >
          <slot name="message-count">
            {{ messageCount }}<span class="text-gray-400 dark:text-gray-500">/</span>{{ messageLimit }}
          </slot>
        </span>
      </div>

      <!-- Separator -->
      <span 
        v-if="showMessageCount && hasHistory && showQuota && quota.remaining >= 0" 
        class="text-gray-300 dark:text-gray-600"
      >
        •
      </span>

      <!-- Quota Display -->
      <slot
        v-if="showQuota"
        name="quota"
      >
        <div 
          v-if="quota.remaining > 0" 
          class="flex items-center gap-1.5 text-xs"
          :class="ui?.quotaDisplay"
        >
          <span class="text-green-600 dark:text-green-400 font-medium tabular-nums">{{ quota.remaining }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ t('quotaRemaining') }}</span>
        </div>
        <div 
          v-else-if="quota.remaining === 0" 
          class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20"
        >
          <svg
            class="w-3.5 h-3.5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span class="text-xs text-red-600 dark:text-red-400 font-medium">
            {{ t('noQuota') }}
          </span>
        </div>
      </slot>
    </div>

    <div
      class="flex items-center gap-1"
      :class="ui?.headerActions"
    >
      <button
        v-if="showCloseButton"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :class="ui?.headerActionButton"
        :title="t('close')"
        @click="$emit('close')"
      >
        <svg
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <button
        v-if="showMinimizeButton"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :class="ui?.headerActionButton"
        :title="t('minimize')"
        @click="$emit('minimize')"
      >
        <svg
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 12h14"
          />
        </svg>
      </button>

      <button
        v-if="showFullscreenToggle"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :class="ui?.headerActionButton"
        :title="isFullscreen ? t('exitFullscreen') : t('fullscreen')"
        @click="$emit('toggle-fullscreen')"
      >
        <svg
          v-if="!isFullscreen"
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AiChatDrawerUI, AiChatDrawerTexts, ChatQuota } from '../../types'

interface Props {
  ui?: AiChatDrawerUI
  isSetupMode: boolean
  showNewChatButton: boolean
  hasHistory: boolean
  showQuota: boolean
  quota: ChatQuota
  showCloseButton: boolean
  showMinimizeButton: boolean
  showFullscreenToggle: boolean
  isFullscreen: boolean
  showMessageCount: boolean
  messageCount: number
  messageLimit: number
  t: (key: keyof AiChatDrawerTexts, params?: Record<string, any>) => string
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'new-chat'): void
  (e: 'close'): void
  (e: 'minimize'): void
  (e: 'toggle-fullscreen'): void
}>()

const messageCountClass = computed(() => {
  const ratio = props.messageCount / props.messageLimit
  if (ratio >= 1) {
    return 'text-red-600 dark:text-red-400'
  }
  if (ratio >= 0.8) {
    return 'text-amber-600 dark:text-amber-400'
  }
  return 'text-gray-600 dark:text-gray-300'
})

const messageCountIconClass = computed(() => {
  const ratio = props.messageCount / props.messageLimit
  if (ratio >= 1) {
    return 'text-red-500 dark:text-red-400'
  }
  if (ratio >= 0.8) {
    return 'text-amber-500 dark:text-amber-400'
  }
  return 'text-gray-400 dark:text-gray-500'
})
</script>
