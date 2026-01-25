<template>
  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
    <!-- Support Mode Toggle (question mark) - only when configured AND not in support mode -->
    <button
      v-if="showSupportModeToggle && !supportRequestMode"
      type="button"
      class="h-9 w-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
      :class="ui.supportToggle"
      :title="texts?.toggleSupportMode || 'Toggle support mode'"
      @click="$emit('toggle-support-mode')"
    >
      <IconQuestionCircle class="w-5 h-5" />
    </button>

    <!-- Support Mode Active Badge - only when in support mode -->
    <button
      v-if="showSupportModeToggle && supportRequestMode"
      type="button"
      class="h-7 px-2 rounded-lg flex items-center gap-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition flex-shrink-0"
      :class="ui.supportBadge"
      :title="texts?.exitSupportMode || 'Exit support mode'"
      @click="$emit('toggle-support-mode')"
    >
      <IconQuestionCircle class="w-3.5 h-3.5" :stroke-width="2" />
      <span>{{ texts?.supportLabel || 'Support' }}</span>
      <IconClose class="w-3 h-3" :stroke-width="2" />
    </button>

    <!-- Send/Stop Button -->
    <button
      :disabled="!canSend && !sending"
      class="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
      :class="buttonClasses"
      type="button"
      @click.prevent="$emit('click')"
    >
      <IconSend v-if="!sending" class="w-4 h-4" />
      <IconStop v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconQuestionCircle, IconClose, IconSend, IconStop } from '../icons'
import type { ChatInputUI, ChatInputTexts } from '../../types'

interface Props {
  sending: boolean
  canSend: boolean
  supportRequestMode: boolean
  showSupportModeToggle: boolean
  ui: ChatInputUI
  texts?: ChatInputTexts
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'toggle-support-mode'): void
  (e: 'click'): void
}>()

const buttonClasses = computed(() => {
  if (props.sending) {
    return [props.ui.stopButton || 'bg-red-500 text-white hover:bg-red-600']
  }
  if (props.canSend) {
    return [props.ui.sendButtonActive || 'bg-primary-500 text-white hover:bg-primary-600']
  }
  return [props.ui.sendButtonDisabled || 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60']
})
</script>
