import { PageContext } from '../types';

/**
 * Composable for managing AI page context
 */
export declare function useAiContext(): {
    context: import('vue').ComputedRef<{
        pageType: string;
        entityId?: string | undefined;
        entityType?: string | undefined;
        metadata?: Record<string, any> | undefined;
        routePath?: string | undefined;
    } | null>;
    setContext: (newContext: PageContext | null) => void;
    clearContext: () => void;
    updateContext: (partial: Partial<PageContext>) => void;
};
//# sourceMappingURL=useAiContext.d.ts.map