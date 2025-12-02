<template>
  <div 
    class="flex items-center justify-center p-4 h-full"
    :class="ui.root"
  >
    <div 
      class="w-full max-w-4xl"
      :class="ui.content"
    >
      <!-- Header -->
      <div 
        class="mb-8 text-center"
        :class="ui.header"
      >
        <div 
          class="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          :class="ui.badge"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <span>{{ t('aiName') }}</span>
        </div>
        <h1 
          class="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
          :class="ui.title"
        >
          {{ t('title') }}
        </h1>
        <p 
          class="text-gray-600 dark:text-gray-400"
          :class="ui.description"
        >
          {{ t('description') }}
        </p>
      </div>

      <!-- Suggestions Grid -->
      <div 
        class="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        :class="ui.grid"
      >
        <button
          v-for="(item, idx) in items"
          :key="item.id || idx"
          class="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600 p-4 text-left transition-all hover:shadow-md hover:scale-[1.02]"
          :class="[ui.suggestionCard, getItemClasses(item)]"
          @click="handleItemClick(item)"
        >
          <!-- Icon -->
          <div 
            class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg"
            :class="[ui.suggestionIconContainer, getIconContainerClasses(item)]"
          >
            <component 
              v-if="item.icon" 
              :is="item.icon" 
              class="h-5 w-5"
              :class="[ui.suggestionIcon, getIconClasses(item)]"
            />
            <svg v-else class="h-5 w-5" :class="[ui.suggestionIcon, getIconClasses(item)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          
          <h3 
            class="mb-1 text-sm font-semibold text-gray-900 dark:text-white"
            :class="ui.suggestionTitle"
          >
            {{ item.title }}
          </h3>
          <p 
            class="text-xs text-gray-600 dark:text-gray-400"
            :class="ui.suggestionDescription"
          >
            {{ item.description }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLabel } from '../config'
import { useAiSuggestions } from '../composables/useAiSuggestions'
import type { AISuggestion, AiEmptyStateUI, AiEmptyStateTexts } from '../types'

interface Props {
  /** Custom UI classes for styling */
  ui?: AiEmptyStateUI
  /** Custom text overrides for i18n support */
  texts?: AiEmptyStateTexts
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'item-click', item: AISuggestion & { prompt: string }): void
}>()

// Text helper with props fallback
const t = (key: keyof AiEmptyStateTexts): string => {
  if (props.texts?.[key]) {
    return props.texts[key] as string
  }
  const labelMappings: Record<keyof AiEmptyStateTexts, string> = {
    aiName: 'aiName',
    title: 'emptyStateTitle',
    description: 'emptyStateDescription',
  }
  return getLabel(labelMappings[key] as any)
}

// UI class helpers
const ui = computed(() => props.ui || {})

const { suggestions: items, resolvePrompt } = useAiSuggestions()

function handleItemClick(item: AISuggestion) {
  const resolvedItem = {
    ...item,
    prompt: resolvePrompt(item),
  }
  emit('item-click', resolvedItem)
}

function getItemClasses(item: AISuggestion): string {
  if (item.gradientClass) {
    return item.gradientClass
  }
  if (item.className) {
    return item.className
  }
  return 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'
}

function getIconContainerClasses(item: AISuggestion): string {
  // Support for custom icon container classes based on category
  const category = item.category || 'default'
  const categoryClasses: Record<string, string> = {
    hr: 'bg-blue-100 dark:bg-blue-900/30',
    finance: 'bg-green-100 dark:bg-green-900/30',
    analytics: 'bg-purple-100 dark:bg-purple-900/30',
    support: 'bg-amber-100 dark:bg-amber-900/30',
    default: 'bg-primary/10',
  }
  return categoryClasses[category] || categoryClasses.default
}

function getIconClasses(item: AISuggestion): string {
  const category = item.category || 'default'
  const categoryClasses: Record<string, string> = {
    hr: 'text-blue-600 dark:text-blue-400',
    finance: 'text-green-600 dark:text-green-400',
    analytics: 'text-purple-600 dark:text-purple-400',
    support: 'text-amber-600 dark:text-amber-400',
    default: 'text-primary',
  }
  return categoryClasses[category] || categoryClasses.default
}
</script>
