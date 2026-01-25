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
  const config = getRestifyAiConfig()

  function getCurrentPath(): string {
    if (context.value?.routePath) {
      return context.value.routePath
    }
    return typeof window !== 'undefined' ? window.location.pathname : '/'
  }

  function filterByPermissions(suggestions: AISuggestion[]): AISuggestion[] {
    if (!config?.can) return suggestions

    return suggestions.filter((suggestion) => {
      if (!suggestion.permission) return true
      return config.can!(suggestion.permission)
    })
  }

  const suggestions = computed<AISuggestion[]>(() => {
    // Support mode suggestion when quota is 0
    if (store.quota.remaining === 0) {
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

    const currentPath = getCurrentPath()
    const allSuggestions = getSuggestionsForPath(currentPath, context.value) || []

    return filterByPermissions(allSuggestions)
  })

  const hasContextualSuggestions = computed(() => {
    return context.value !== null && context.value.pageType !== 'default'
  })

  function resolvePrompt(suggestion: AISuggestion): string {
    if (typeof suggestion.prompt === 'function') {
      return suggestion.prompt(context.value || { pageType: 'default' })
    }
    return suggestion.prompt
  }

  return {
    suggestions,
    hasContextualSuggestions,
    resolvePrompt,
  }
}
