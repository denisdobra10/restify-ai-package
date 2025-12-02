import { AISuggestion, PageContext, SuggestionProvider } from '../types';

/**
 * Initialize providers from config
 */
export declare function initializeProviders(): void;
/**
 * Get AI suggestions for a specific path and context
 */
export declare function getSuggestionsForPath(path: string, context: PageContext | null): AISuggestion[];
/**
 * Register a provider at runtime
 */
export declare function registerProvider(provider: SuggestionProvider): void;
/**
 * Unregister a provider
 */
export declare function unregisterProvider(id: string): void;
/**
 * Get all providers
 */
export declare function getAllProviders(): SuggestionProvider[];
export declare const registerSuggestionProvider: typeof registerProvider;
//# sourceMappingURL=index.d.ts.map