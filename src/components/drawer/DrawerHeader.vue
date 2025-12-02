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
      <slot name="quota">
        <span 
          v-if="quota.remaining > 0" 
          class="text-xs text-green-600 dark:text-green-400"
          :class="ui?.quotaDisplay"
        >
          {{ quota.remaining }} {{ t('quotaRemaining') }}
        </span>
        <span 
          v-else-if="quota.remaining === 0" 
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
        @click="$emit('close')"
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
        @click="$emit('minimize')"
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
        @click="$emit('toggle-fullscreen')"
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
</template>

<script setup lang="ts">
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
  t: (key: keyof AiChatDrawerTexts, params?: Record<string, any>) => string
}

defineProps<Props>()

defineEmits<{
  (e: 'new-chat'): void
  (e: 'close'): void
  (e: 'minimize'): void
  (e: 'toggle-fullscreen'): void
}>()
</script>
