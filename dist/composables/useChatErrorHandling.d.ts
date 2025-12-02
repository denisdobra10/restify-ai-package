import { ComputedRef } from 'vue';
import { ChatError } from '../types';

export interface UseChatErrorHandlingReturn {
    errorState: ComputedRef<ChatError>;
    hasError: ComputedRef<boolean>;
    retry: () => Promise<boolean>;
    clearError: () => void;
}
/**
 * Chat Error Handling Composable
 */
export declare function useChatErrorHandling(): UseChatErrorHandlingReturn;
//# sourceMappingURL=useChatErrorHandling.d.ts.map