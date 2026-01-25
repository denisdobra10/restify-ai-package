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
          <IconSparkles class="w-4 h-4" />
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
        <IconChatBubble 
          class="w-3.5 h-3.5" 
          :class="messageCountIconClass"
        />
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
        v-if="showSeparator" 
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
          <IconWarning class="w-3.5 h-3.5 text-red-500" />
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
        <IconClose class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      <button
        v-if="showMinimizeButton"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :class="ui?.headerActionButton"
        :title="t('minimize')"
        @click="$emit('minimize')"
      >
        <IconMinimize class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      <button
        v-if="showFullscreenToggle"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :class="ui?.headerActionButton"
        :title="isFullscreen ? t('exitFullscreen') : t('fullscreen')"
        @click="$emit('toggle-fullscreen')"
      >
        <IconFullscreen
          v-if="!isFullscreen"
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
        />
        <IconExitFullscreen
          v-else
          class="w-5 h-5 text-gray-600 dark:text-gray-400"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconSparkles, IconChatBubble, IconWarning, IconClose, IconMinimize, IconFullscreen, IconExitFullscreen } from '../icons'
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

// Helper for message count status
function getMessageCountStatus(): 'danger' | 'warning' | 'default' {
  const ratio = props.messageCount / props.messageLimit
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.8) return 'warning'
  return 'default'
}

const statusColors = {
  icon: {
    danger: 'text-red-500 dark:text-red-400',
    warning: 'text-amber-500 dark:text-amber-400',
    default: 'text-gray-400 dark:text-gray-500',
  },
  text: {
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    default: 'text-gray-600 dark:text-gray-300',
  },
}

const messageCountClass = computed(() => statusColors.text[getMessageCountStatus()])
const messageCountIconClass = computed(() => statusColors.icon[getMessageCountStatus()])

const showSeparator = computed(() => 
  props.showMessageCount && props.hasHistory && props.showQuota && props.quota.remaining >= 0
)
</script>
