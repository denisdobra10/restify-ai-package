import { computed } from 'vue'
import { useAiContext } from './useAiContext'
import { useRestifyAiStore } from '../store'
import { getSuggestionsForPath } from '../suggestions'
import { getRestifyAiConfig, getLabel } from '../config'
import type { AISuggestion } from '../types'

/**
 * Composable for getting context-aware AI suggestions
 */
export function useAiSuggestions() {
  const { context } = useAiContext()
  const store = useRestifyAiStore()

  const suggestions = computed<AISuggestion[]>(() => {
    // Support mode suggestion when quota is 0
    if (store.quota.remaining === 0) {
      const config = getRestifyAiConfig()
      if (config?.enableSupportMode !== false) {
        return [
          {
            id: 'contact-support-quota',
            title: getLabel('contactSupport'),
            description: getLabel('noQuota'),
            prompt: 'I need help with my account',
            className: 'rai-suggestion--warning',
            isSupportRequest: true,
          },
        ]
      }
      return []
    }

    const currentPath = context.value?.routePath || 
      (typeof window !== 'undefined' ? window.location.pathname : '/')
    
    const allSuggestions = getSuggestionsForPath(currentPath, context.value) || []

    // Filter by permissions if available
    const config = getRestifyAiConfig()
    if (config?.can) {
      return allSuggestions.filter((suggestion) => {
        if (suggestion.permission && !config.can!(suggestion.permission)) {
          return false
        }
        return true
      })
    }

    return allSuggestions
  })

  const hasContextualSuggestions = computed(() => {
    return context.value !== null && context.value.pageType !== 'default'
  })

  function resolvePrompt(suggestion: AISuggestion): string {
    if (typeof suggestion.prompt === 'function') {
      return suggestion.prompt(
        context.value || { pageType: 'default' },
      )
    }
    return suggestion.prompt
  }

  return {
    suggestions,
    hasContextualSuggestions,
    resolvePrompt,
  }
}
