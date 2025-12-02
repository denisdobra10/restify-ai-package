import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { renderMentionsInHtml } from './useMentionParsing'

export interface UseChatMarkdownReturn {
  parseMarkdown: (text: string) => string
}

/**
 * Chat Markdown Composable
 *
 * Provides markdown parsing with XSS protection via DOMPurify sanitization.
 */
export function useChatMarkdown(): UseChatMarkdownReturn {
  const parseMarkdown = (text: string): string => {
    if (!text || typeof text !== 'string') {
      return ''
    }

    // Render mentions as HTML spans
    const textWithMentions = renderMentionsInHtml(text)

    // Parse markdown to HTML
    const html = marked.parse(textWithMentions, {
      async: false,
      breaks: true,
      gfm: true,
    }) as string

    // Sanitize HTML
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'code', 'pre',
        'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'a', 'blockquote', 'span', 'div', 'table', 'thead',
        'tbody', 'tr', 'th', 'td',
      ],
      ALLOWED_ATTR: ['href', 'class', 'target', 'rel', 'data-mention-id', 'data-mention-type'],
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
      KEEP_CONTENT: true,
    })

    return sanitized
  }

  return {
    parseMarkdown,
  }
}
