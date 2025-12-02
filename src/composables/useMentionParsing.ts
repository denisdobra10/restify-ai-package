import type { Mention, MentionItem, MentionContext, MentionParseResult, MentionProvider } from '../types'
import { getRestifyAiConfig } from '../config'

/**
 * Extract mentions from text in the format @[Name](id)
 */
export function extractMentions(text: string): MentionParseResult {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g
  const mentions: Mention[] = []
  let cleanText = text

  let match
  while ((match = mentionRegex.exec(text)) !== null) {
    const [fullMatch, name, idPart] = match
    const [type, id] = idPart.includes(':') ? idPart.split(':') : ['default', idPart]

    mentions.push({
      id,
      name,
      type,
    })
    cleanText = cleanText.replace(fullMatch, name)
  }

  return {
    cleanText,
    mentions,
  }
}

/**
 * Parse message and return clean text without mention markers
 */
export function parseAndCleanMessage(text: string): string {
  const { cleanText } = extractMentions(text)
  return cleanText
}

/**
 * Convert @mentions to styled HTML spans
 */
export function renderMentionsInHtml(text: string): string {
  return text.replace(
    /@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    '<span class="rai-mention">@$1</span>',
  )
}

/**
 * Check if cursor is in a mention context
 */
export function detectMentionContext(text: string, cursorPos: number): MentionContext {
  const textBeforeCursor = text.substring(0, cursorPos)
  const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

  if (mentionMatch) {
    return {
      inMention: true,
      query: mentionMatch[1],
      startPos: cursorPos - mentionMatch[0].length,
    }
  }

  return {
    inMention: false,
    query: '',
    startPos: -1,
  }
}

/**
 * Get display name for a mention item
 */
export function getMentionDisplayName(item: MentionItem, provider?: MentionProvider): string {
  if (provider?.getDisplayName) {
    return provider.getDisplayName(item)
  }
  return item.name || item.title || item.attributes?.name || item.attributes?.title || 'Unknown'
}

/**
 * Get subtitle for a mention item
 */
export function getMentionSubtitle(item: MentionItem, provider?: MentionProvider): string | null {
  if (provider?.getSubtitle) {
    return provider.getSubtitle(item)
  }
  return item.attributes?.email || item.attributes?.description || null
}

/**
 * Build mention text
 */
export function buildMentionText(item: MentionItem, provider?: MentionProvider): string {
  if (provider?.buildMentionText) {
    return provider.buildMentionText(item)
  }
  const name = getMentionDisplayName(item, provider)
  return `@[${name}](${item.type}:${item.id})`
}

/**
 * Get mention provider for a type
 */
export function getMentionProvider(type: string): MentionProvider | undefined {
  const config = getRestifyAiConfig()
  return config?.mentionProviders?.find((p: MentionProvider) => p.type === type)
}

/**
 * Get all active mention providers for current route
 */
export function getActiveMentionProviders(routePath?: string): MentionProvider[] {
  const config = getRestifyAiConfig()
  const providers = config?.mentionProviders || []

  if (!routePath) {
    return providers
  }

  return providers.filter((p: MentionProvider) => {
    if (!p.routes) return true
    return p.routes.some((route: string) => {
      if (route.endsWith('*')) {
        return routePath.startsWith(route.slice(0, -1))
      }
      return routePath === route || routePath.startsWith(route + '/')
    })
  })
}

/**
 * Format mentions for API request (Laravel Restify format)
 */
export function formatMentionsForApi(mentions: Mention[]): Array<{ type: string; id: string; name: string }> {
  return mentions.map(m => ({
    type: m.type,
    id: m.id,
    name: m.name,
  }))
}

/**
 * Group mentions by type for display
 */
export function groupMentionsByType(mentions: Mention[]): Record<string, Mention[]> {
  return mentions.reduce((groups, mention) => {
    const type = mention.type || 'default'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(mention)
    return groups
  }, {} as Record<string, Mention[]>)
}

/**
 * Composable for mention parsing utilities
 */
export function useMentionParsing() {
  return {
    extractMentions,
    parseAndCleanMessage,
    renderMentionsInHtml,
    detectMentionContext,
    getMentionDisplayName,
    getMentionSubtitle,
    buildMentionText,
    getMentionProvider,
    getActiveMentionProviders,
    formatMentionsForApi,
    groupMentionsByType,
  }
}
