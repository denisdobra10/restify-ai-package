import { computed, type ComputedRef } from 'vue'
import { useRestifyAiStore } from '../store'
import type { ChatError } from '../types'

export interface UseChatErrorHandlingReturn {
  errorState: ComputedRef<ChatError>
  hasError: ComputedRef<boolean>
  retry: () => Promise<boolean>
  clearError: () => void
}

/**
 * Chat Error Handling Composable
 */
export function useChatErrorHandling(): UseChatErrorHandlingReturn {
  const store = useRestifyAiStore()

  const errorState = computed<ChatError>(() => store.error)

  const hasError = computed<boolean>(() => {
    return errorState.value?.message !== null && errorState.value?.message !== undefined
  })

  const retry = async (): Promise<boolean> => {
    return await store.retry()
  }

  const clearError = (): void => {
    store.clearError()
  }

  return {
    errorState,
    hasError,
    retry,
    clearError,
  }
}
