import type { AISuggestion, PageContext, SuggestionProvider } from '../types'
import { getRestifyAiConfig } from '../config'

/**
 * Internal provider registry
 */
const providers: SuggestionProvider[] = []

/**
 * Default provider (fallback)
 */
const defaultProvider: SuggestionProvider = {
  id: 'default',
  matcher: () => true,
  priority: 0,
  getSuggestions: () => {
    const config = getRestifyAiConfig()
    return config?.defaultSuggestions || []
  },
}

/**
 * Initialize providers from config
 */
export function initializeProviders(): void {
  providers.length = 0
  
  const config = getRestifyAiConfig()
  if (config?.suggestionProviders) {
    providers.push(...config.suggestionProviders)
  }
  
  providers.push(defaultProvider)
}

/**
 * Find the best matching provider for a path
 */
function findProviderForPath(path: string, context: PageContext | null): SuggestionProvider {
  const sortedProviders = [...providers].sort((a, b) => {
    return (b.priority || 0) - (a.priority || 0)
  })

  for (const provider of sortedProviders) {
    if (provider.matcher && provider.matcher(path, context)) {
      return provider
    }

    if (provider.routes) {
      const matches = provider.routes.some((pattern) => {
        if (pattern.endsWith('*')) {
          return path.startsWith(pattern.slice(0, -1))
        }
        return path === pattern || path.startsWith(pattern + '/')
      })
      if (matches) {
        return provider
      }
    }
  }

  return defaultProvider
}

/**
 * Get AI suggestions for a specific path and context
 */
export function getSuggestionsForPath(
  path: string,
  context: PageContext | null,
): AISuggestion[] {
  if (providers.length === 0) {
    initializeProviders()
  }

  const provider = findProviderForPath(path, context)

  const fullContext: PageContext = context || {
    pageType: 'default',
    routePath: path,
  }

  if (provider.extractContext) {
    fullContext.metadata = {
      ...fullContext.metadata,
      ...provider.extractContext(path),
    }
  }

  return provider.getSuggestions(fullContext) || []
}

/**
 * Register a provider at runtime
 */
export function registerProvider(provider: SuggestionProvider): void {
  const existingIndex = providers.findIndex((p) => p.id === provider.id)

  if (existingIndex >= 0) {
    providers[existingIndex] = provider
  } else {
    const defaultIndex = providers.findIndex((p) => p.id === 'default')
    if (defaultIndex >= 0) {
      providers.splice(defaultIndex, 0, provider)
    } else {
      providers.push(provider)
    }
  }
}

/**
 * Unregister a provider
 */
export function unregisterProvider(id: string): void {
  if (id === 'default') return
  const index = providers.findIndex((p) => p.id === id)
  if (index >= 0) {
    providers.splice(index, 1)
  }
}

/**
 * Get all providers
 */
export function getAllProviders(): SuggestionProvider[] {
  return [...providers]
}

export const registerSuggestionProvider = registerProvider
