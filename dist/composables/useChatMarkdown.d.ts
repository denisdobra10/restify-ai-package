export interface UseChatMarkdownReturn {
    parseMarkdown: (text: string) => string;
}
/**
 * Chat Markdown Composable
 *
 * Provides markdown parsing with XSS protection via DOMPurify sanitization.
 */
export declare function useChatMarkdown(): UseChatMarkdownReturn;
//# sourceMappingURL=useChatMarkdown.d.ts.map