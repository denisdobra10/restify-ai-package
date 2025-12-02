import { EventSourceMessage } from '@microsoft/fetch-event-source';
import { ChatAttachment, Mention, PageContext, AiStoreState, SetupState } from './types';

export declare const useRestifyAiStore: import('pinia').StoreDefinition<"restifyAiStore", AiStoreState, {
    hasMessages: (state: {
        chatHistoryLimit: number;
        chatHistory: {
            id: string;
            role: import('./types').ChatRole | string;
            message: string;
            loading?: boolean | undefined;
            streaming?: boolean | undefined;
            timestamp?: number | undefined;
            created_at?: (string | Date) | undefined;
            attachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | undefined;
            mentions?: {
                id: string;
                name: string;
                type: string;
                metadata?: Record<string, any> | undefined;
            }[] | undefined;
        }[];
        uploadedFiles: Record<string, ChatAttachment>;
        loading: boolean;
        showChat: boolean;
        isFullscreen: boolean;
        sending: boolean;
        pageContext: {
            pageType: string;
            entityId?: string | undefined;
            entityType?: string | undefined;
            metadata?: Record<string, any> | undefined;
            routePath?: string | undefined;
        } | null;
        quota: {
            limit: number;
            used: number;
            remaining: number;
        };
        error: {
            message: string | null;
            failedQuestion: string | null;
            failedAttachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | null | undefined;
            timestamp: number | null;
            quotaExceeded?: boolean | undefined;
        };
        supportRequestMode: boolean;
        setupState: {
            isActive: boolean;
            currentStep: import('./types').SetupStep;
            testApiKey: string | null;
            connectionStatus: "idle" | "testing" | "connected" | "failed";
            backendConfigured: boolean;
            lastError: string | null;
        };
    } & import('pinia').PiniaCustomStateProperties<AiStoreState>) => boolean;
    isInSetupMode: (state: {
        chatHistoryLimit: number;
        chatHistory: {
            id: string;
            role: import('./types').ChatRole | string;
            message: string;
            loading?: boolean | undefined;
            streaming?: boolean | undefined;
            timestamp?: number | undefined;
            created_at?: (string | Date) | undefined;
            attachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | undefined;
            mentions?: {
                id: string;
                name: string;
                type: string;
                metadata?: Record<string, any> | undefined;
            }[] | undefined;
        }[];
        uploadedFiles: Record<string, ChatAttachment>;
        loading: boolean;
        showChat: boolean;
        isFullscreen: boolean;
        sending: boolean;
        pageContext: {
            pageType: string;
            entityId?: string | undefined;
            entityType?: string | undefined;
            metadata?: Record<string, any> | undefined;
            routePath?: string | undefined;
        } | null;
        quota: {
            limit: number;
            used: number;
            remaining: number;
        };
        error: {
            message: string | null;
            failedQuestion: string | null;
            failedAttachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | null | undefined;
            timestamp: number | null;
            quotaExceeded?: boolean | undefined;
        };
        supportRequestMode: boolean;
        setupState: {
            isActive: boolean;
            currentStep: import('./types').SetupStep;
            testApiKey: string | null;
            connectionStatus: "idle" | "testing" | "connected" | "failed";
            backendConfigured: boolean;
            lastError: string | null;
        };
    } & import('pinia').PiniaCustomStateProperties<AiStoreState>) => boolean;
    canChat: (state: {
        chatHistoryLimit: number;
        chatHistory: {
            id: string;
            role: import('./types').ChatRole | string;
            message: string;
            loading?: boolean | undefined;
            streaming?: boolean | undefined;
            timestamp?: number | undefined;
            created_at?: (string | Date) | undefined;
            attachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | undefined;
            mentions?: {
                id: string;
                name: string;
                type: string;
                metadata?: Record<string, any> | undefined;
            }[] | undefined;
        }[];
        uploadedFiles: Record<string, ChatAttachment>;
        loading: boolean;
        showChat: boolean;
        isFullscreen: boolean;
        sending: boolean;
        pageContext: {
            pageType: string;
            entityId?: string | undefined;
            entityType?: string | undefined;
            metadata?: Record<string, any> | undefined;
            routePath?: string | undefined;
        } | null;
        quota: {
            limit: number;
            used: number;
            remaining: number;
        };
        error: {
            message: string | null;
            failedQuestion: string | null;
            failedAttachments?: {
                id: string;
                name: string;
                url?: string | undefined;
                type?: string | undefined;
                size?: number | undefined;
                extractedText?: string | undefined;
                uploading?: boolean | undefined;
                progress?: number | undefined;
                previewUrl?: string | undefined;
            }[] | null | undefined;
            timestamp: number | null;
            quotaExceeded?: boolean | undefined;
        };
        supportRequestMode: boolean;
        setupState: {
            isActive: boolean;
            currentStep: import('./types').SetupStep;
            testApiKey: string | null;
            connectionStatus: "idle" | "testing" | "connected" | "failed";
            backendConfigured: boolean;
            lastError: string | null;
        };
    } & import('pinia').PiniaCustomStateProperties<AiStoreState>) => boolean;
}, {
    scrollToBottom(): Promise<void>;
    parseStreamContent(event: EventSourceMessage): string | null;
    askQuestion(question: string, attachments?: ChatAttachment[], mentions?: Mention[], isSupportRequest?: boolean): Promise<boolean>;
    cancelRequest(): void;
    clearChatHistory(): void;
    retry(): Promise<boolean>;
    clearError(): void;
    toggleSupportMode(): void;
    fetchQuota(): Promise<void>;
    uploadFile(file: File): Promise<ChatAttachment | null>;
    setPageContext(context: PageContext | null): void;
    toggleDrawer(): void;
    openDrawer(): void;
    closeDrawer(): void;
    startSupportRequest(): void;
    cancelSupportRequest(): void;
    registerUploadedFile(attachment: ChatAttachment): void;
    startSetupMode(): void;
    setSetupStep(step: SetupState["currentStep"]): void;
    setTestApiKey(key: string): void;
    testConnection(): Promise<boolean>;
    completeSetup(): void;
    skipSetup(): void;
}>;
export type RestifyAiStore = ReturnType<typeof useRestifyAiStore>;
//# sourceMappingURL=store.d.ts.map