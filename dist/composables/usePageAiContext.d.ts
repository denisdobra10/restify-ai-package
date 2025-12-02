import { Ref } from 'vue';

/**
 * Auto-setup composable for page AI context
 *
 * @param pageType - The type of page (e.g., 'users', 'products')
 * @param dynamicMetadata - Optional reactive metadata
 *
 * @example
 * ```ts
 * // Simple usage
 * usePageAiContext('users')
 *
 * // With dynamic metadata
 * usePageAiContext('users', {
 *   userId: computed(() => route.params.id),
 *   userName: computed(() => user.value?.name)
 * })
 * ```
 */
export declare function usePageAiContext(pageType: string, dynamicMetadata?: Record<string, any | Ref<any>>): {
    setupContext: () => void;
};
//# sourceMappingURL=usePageAiContext.d.ts.map