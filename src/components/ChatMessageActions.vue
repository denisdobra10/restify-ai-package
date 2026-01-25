<template>
  <div 
    class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
    :class="ui.container"
  >
    <button
      type="button"
      class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="[ui.button, ui.copyButton]"
      :title="copied ? t('copied') : t('copyToClipboard')"
      @click="handleCopy"
    >
      <IconCopy
        v-if="!copied"
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
      />
      <IconCheck
        v-else
        class="w-4 h-4 text-green-500"
        :class="ui.successState"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getLabel } from '../config'
import { IconCopy, IconCheck } from './icons'
import type { ChatMessage, ChatMessageActionsUI, ChatMessageActionsTexts } from '../types'

interface Props {
  message: ChatMessage
  /** Custom UI classes for styling */
  ui?: ChatMessageActionsUI
  /** Custom text overrides for i18n support */
  texts?: ChatMessageActionsTexts
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'copy', message: ChatMessage): void
}>()

// Text helper with props fallback
const t = (key: keyof ChatMessageActionsTexts): string => {
  if (props.texts?.[key]) {
    return props.texts[key] as string
  }
  const labelMappings: Record<keyof ChatMessageActionsTexts, string> = {
    copyToClipboard: 'copyToClipboard',
    copied: 'copied',
  }
  return getLabel(labelMappings[key] as any)
}

// UI class helpers
const ui = computed(() => props.ui || {})

const copied = ref(false)

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.message.message)
    copied.value = true
    emit('copy', props.message)
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
