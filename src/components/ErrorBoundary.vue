<template>
  <slot v-if="!hasError" />
  <slot
    v-else
    name="error"
    :error="error"
    :reset="reset"
  >
    <div 
      class="flex flex-col items-center justify-center p-6 text-center"
      :class="ui?.container"
    >
      <div 
        class="w-12 h-12 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
        :class="ui?.iconContainer"
      >
        <IconWarning class="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 
        class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
        :class="ui?.title"
      >
        {{ title }}
      </h3>
      <p 
        class="text-sm text-gray-600 dark:text-gray-400 mb-4"
        :class="ui?.message"
      >
        {{ message }}
      </p>
      <button
        v-if="showRetry"
        class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        :class="ui?.retryButton"
        @click="reset"
      >
        {{ retryText }}
      </button>
    </div>
  </slot>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { IconWarning } from './icons'

interface ErrorBoundaryUI {
  container?: string
  iconContainer?: string
  title?: string
  message?: string
  retryButton?: string
}

interface Props {
  title?: string
  message?: string
  retryText?: string
  showRetry?: boolean
  ui?: ErrorBoundaryUI
  onError?: (error: Error, info: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again.',
  retryText: 'Try Again',
  showRetry: true,
})

const emit = defineEmits<{
  (e: 'error', error: Error, info: string): void
  (e: 'reset'): void
}>()

const hasError = ref(false)
const error = ref<Error | null>(null)

onErrorCaptured((err: Error, instance, info: string) => {
  hasError.value = true
  error.value = err
  
  // Call onError callback if provided
  props.onError?.(err, info)
  
  // Emit error event
  emit('error', err, info)
  
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('[RestifyAi ErrorBoundary] Caught error:', err)
    console.error('[RestifyAi ErrorBoundary] Component info:', info)
  }
  
  // Prevent error from propagating
  return false
})

function reset() {
  hasError.value = false
  error.value = null
  emit('reset')
}

defineExpose({
  hasError,
  error,
  reset,
})
</script>
