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
      :title="texts?.exitSupportMode || 'Exit support mode'"
      @click="$emit('toggle-support-mode')"
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
      :class="buttonClasses"
      type="button"
      @click.prevent="$emit('click')"
    >
      <svg v-if="!sending" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
      <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
    return [props.ui.sendButtonActive || 'bg-primary text-white hover:bg-primary/90']
  }
  return [props.ui.sendButtonDisabled || 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60']
})
</script>
