import { AISuggestion } from '../types';

/**
 * Composable for getting context-aware AI suggestions
 */
export declare function useAiSuggestions(): {
    suggestions: import('vue').ComputedRef<AISuggestion[]>;
    hasContextualSuggestions: import('vue').ComputedRef<boolean>;
    resolvePrompt: (suggestion: AISuggestion) => string;
};
//# sourceMappingURL=useAiSuggestions.d.ts.map