<template>
  <Transition
    enter-active-class="transition ease-out duration-100"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-75"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
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
              [ui.suggestionItemSelected || 'bg-primary/10']: index === selectedIndex,
              'hover:bg-gray-50 dark:hover:bg-gray-700': index !== selectedIndex
            }
          ]"
          @click="$emit('select', suggestion)"
          @mouseenter="$emit('hover', index)"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ChatInputUI } from '../../types'

interface Suggestion {
  id: string
  title: string
  description: string
}

interface Props {
  suggestions: Suggestion[]
  selectedIndex: number
  ui: ChatInputUI
}

defineProps<Props>()

defineEmits<{
  (e: 'select', suggestion: Suggestion): void
  (e: 'hover', index: number): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)

defineExpose({ dropdownRef })
</script>
