import { computed } from 'vue'
import { useRestifyAiStore } from '../store'
import type { PageContext } from '../types'

/**
 * Composable for managing AI page context
 */
export function useAiContext() {
  const store = useRestifyAiStore()

  const context = computed(() => store.pageContext)

  function setContext(newContext: PageContext | null): void {
    store.setPageContext(newContext)
  }

  function clearContext(): void {
    store.setPageContext(null)
  }

  function updateContext(partial: Partial<PageContext>): void {
    const current = store.pageContext
    if (current) {
      store.setPageContext({
        ...current,
        ...partial,
        metadata: {
          ...current.metadata,
          ...partial.metadata,
        },
      })
    }
  }

  return {
    context,
    setContext,
    clearContext,
    updateContext,
  }
}
