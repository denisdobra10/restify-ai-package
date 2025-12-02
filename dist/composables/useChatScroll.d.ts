export interface UseChatScrollReturn {
    scrollToBottom: (container?: HTMLElement | null) => void;
    setupAutoScroll: (container: HTMLElement) => void;
    cleanupAutoScroll: () => void;
}
/**
 * Chat Scroll Composable
 */
export declare function useChatScroll(): UseChatScrollReturn;
//# sourceMappingURL=useChatScroll.d.ts.map