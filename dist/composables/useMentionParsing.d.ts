import { Mention, MentionItem, MentionContext, MentionParseResult, MentionProvider } from '../types';

/**
 * Extract mentions from text in the format @[Name](id)
 */
export declare function extractMentions(text: string): MentionParseResult;
/**
 * Parse message and return clean text without mention markers
 */
export declare function parseAndCleanMessage(text: string): string;
/**
 * Convert @mentions to styled HTML spans
 */
export declare function renderMentionsInHtml(text: string): string;
/**
 * Check if cursor is in a mention context
 */
export declare function detectMentionContext(text: string, cursorPos: number): MentionContext;
/**
 * Get display name for a mention item
 */
export declare function getMentionDisplayName(item: MentionItem, provider?: MentionProvider): string;
/**
 * Get subtitle for a mention item
 */
export declare function getMentionSubtitle(item: MentionItem, provider?: MentionProvider): string | null;
/**
 * Build mention text
 */
export declare function buildMentionText(item: MentionItem, provider?: MentionProvider): string;
/**
 * Get mention provider for a type
 */
export declare function getMentionProvider(type: string): MentionProvider | undefined;
/**
 * Get all active mention providers for current route
 */
export declare function getActiveMentionProviders(routePath?: string): MentionProvider[];
/**
 * Format mentions for API request (Laravel Restify format)
 */
export declare function formatMentionsForApi(mentions: Mention[]): Array<{
    type: string;
    id: string;
    name: string;
}>;
/**
 * Group mentions by type for display
 */
export declare function groupMentionsByType(mentions: Mention[]): Record<string, Mention[]>;
/**
 * Composable for mention parsing utilities
 */
export declare function useMentionParsing(): {
    extractMentions: typeof extractMentions;
    parseAndCleanMessage: typeof parseAndCleanMessage;
    renderMentionsInHtml: typeof renderMentionsInHtml;
    detectMentionContext: typeof detectMentionContext;
    getMentionDisplayName: typeof getMentionDisplayName;
    getMentionSubtitle: typeof getMentionSubtitle;
    buildMentionText: typeof buildMentionText;
    getMentionProvider: typeof getMentionProvider;
    getActiveMentionProviders: typeof getActiveMentionProviders;
    formatMentionsForApi: typeof formatMentionsForApi;
    groupMentionsByType: typeof groupMentionsByType;
};
//# sourceMappingURL=useMentionParsing.d.ts.map