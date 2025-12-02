import { onMounted, onUnmounted, watch, type Ref, isRef } from 'vue'
import { useAiContext } from './useAiContext'
import type { PageContext } from '../types'

/**
 * Auto-setup composable for page AI context
 *
 * @param pageType - The type of page (e.g., 'users', 'products')
 * @param dynamicMetadata - Optional reactive metadata
 *
 * @example
 * ```ts
 * // Simple usage
 * usePageAiContext('users')
 *
 * // With dynamic metadata
 * usePageAiContext('users', {
 *   userId: computed(() => route.params.id),
 *   userName: computed(() => user.value?.name)
 * })
 * ```
 */
export function usePageAiContext(
  pageType: string,
  dynamicMetadata?: Record<string, any | Ref<any>>,
): { setupContext: () => void } {
  const { setContext, clearContext, updateContext } = useAiContext()

  function resolveMetadata(): Record<string, any> {
    if (!dynamicMetadata) {
      return {}
    }

    const resolved: Record<string, any> = {}
    for (const [key, value] of Object.entries(dynamicMetadata)) {
      resolved[key] = isRef(value) ? value.value : value
    }
    return resolved
  }

  function setupContext(): void {
    const context: PageContext = {
      pageType,
      routePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
      metadata: resolveMetadata(),
    }

    setContext(context)
  }

  onMounted(() => {
    setupContext()
  })

  onUnmounted(() => {
    clearContext()
  })

  // Watch for dynamic metadata changes
  if (dynamicMetadata) {
    watch(
      () => resolveMetadata(),
      (newMetadata) => {
        updateContext({ metadata: newMetadata })
      },
      { deep: true },
    )
  }

  return {
    setupContext,
  }
}
