/**
 * Mention Types
 */

export interface MentionProvider {
  type: string
  label: string
  icon?: any
  iconClass?: string
  search: (query: string) => Promise<MentionItem[]> | MentionItem[]
  routes?: string[]
  priority?: number
  getDisplayName?: (item: MentionItem) => string
  getSubtitle?: (item: MentionItem) => string | null
  buildMentionText?: (item: MentionItem) => string
}

export interface MentionItem {
  id: string
  type: string
  name?: string
  label?: string
  title?: string
  attributes?: Record<string, any> | null
  relationships?: Record<string, any> | null
}

export interface MentionContext {
  inMention: boolean
  query: string
  startPos: number
}

export interface MentionParseResult {
  cleanText: string
  mentions: import('./chat').Mention[]
}
