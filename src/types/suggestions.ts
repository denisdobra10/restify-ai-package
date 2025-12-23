/**
 * Suggestion Types
 */

export interface PageContext {
  pageType: string
  entityId?: string
  entityType?: string
  metadata?: Record<string, any>
  routePath?: string
}

export interface AISuggestion {
  id: string
  title: string
  description?: string
  icon?: any
  className?: string
  gradientClass?: string
  prompt: string | ((context: PageContext) => string)
  permission?: string
  category?: string
  isSupportRequest?: boolean
}

// Alias for backwards compatibility
export type AiSuggestion = AISuggestion

export interface SuggestionProvider {
  id: string
  routes?: string[]
  matcher?: (path: string, context: PageContext | null) => boolean
  getSuggestions: (context: PageContext) => AISuggestion[]
  extractContext?: (path: string) => Record<string, any>
  priority?: number
}
