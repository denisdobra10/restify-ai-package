import { ChatQuota, SubmitPayload, AiChatDrawerUI, AiChatDrawerTexts } from '../types';

interface Props {
    modelValue: boolean;
    /** Custom UI classes for styling */
    ui?: AiChatDrawerUI;
    /** Custom text overrides for i18n support */
    texts?: AiChatDrawerTexts;
    /** Width of the drawer when not fullscreen */
    width?: string;
    /** Width of the drawer when fullscreen */
    fullscreenWidth?: string;
    /** Position of the drawer */
    position?: 'left' | 'right';
    /** Show backdrop overlay */
    showBackdrop?: boolean;
    /** Close on backdrop click */
    closeOnBackdropClick?: boolean;
    /** Close on escape key */
    closeOnEscape?: boolean;
    /** Show quota display */
    showQuota?: boolean;
    /** Show fullscreen toggle */
    showFullscreenToggle?: boolean;
    /** Show minimize button */
    showMinimizeButton?: boolean;
    /** Show close button */
    showCloseButton?: boolean;
    /** Show new chat button */
    showNewChatButton?: boolean;
    /** Confirm before closing if there's chat history */
    confirmClose?: boolean;
}
declare function onExampleClick(item: {
    prompt: string;
}): void;
declare function __VLS_template(): {
    header?(_: {
        quota: ChatQuota;
        isFullscreen: boolean;
        hasHistory: boolean;
        onNewChat: () => void;
        onClose: () => void;
        onMinimize: () => void;
        onToggleFullscreen: () => void;
    }): any;
    quota?(_: {
        quota: {
            limit: number;
            used: number;
            remaining: number;
        };
    }): any;
    setup?(_: {}): any;
    "empty-state"?(_: {
        suggestions: {
            id: string;
            title: string;
            description: string;
        }[];
        onClick: typeof onExampleClick;
    }): any;
    message?(_: {
        message: {
            id: string;
            role: import('..').ChatRole | string;
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
        };
        isUser: boolean;
        isLoading: boolean | undefined;
        isStreaming: boolean | undefined;
    }): any;
    input?(_: {
        modelValue: string;
        sending: boolean;
        disabled: boolean;
        onSubmit: (payload: SubmitPayload) => void;
        onCancel: () => void;
    }): any;
    "context-link"?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    width: string;
    fullscreenWidth: string;
    position: string;
    showBackdrop: boolean;
    closeOnBackdropClick: boolean;
    closeOnEscape: boolean;
    showQuota: boolean;
    showFullscreenToggle: boolean;
    showMinimizeButton: boolean;
    showCloseButton: boolean;
    showNewChatButton: boolean;
    confirmClose: boolean;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => void;
    close: () => void;
    "contact-support": () => void;
    "new-chat": () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    width: string;
    fullscreenWidth: string;
    position: string;
    showBackdrop: boolean;
    closeOnBackdropClick: boolean;
    closeOnEscape: boolean;
    showQuota: boolean;
    showFullscreenToggle: boolean;
    showMinimizeButton: boolean;
    showCloseButton: boolean;
    showNewChatButton: boolean;
    confirmClose: boolean;
}>>> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    "onContact-support"?: (() => any) | undefined;
    "onNew-chat"?: (() => any) | undefined;
}>, {
    confirmClose: boolean;
    width: string;
    fullscreenWidth: string;
    position: "left" | "right";
    showBackdrop: boolean;
    closeOnBackdropClick: boolean;
    closeOnEscape: boolean;
    showQuota: boolean;
    showFullscreenToggle: boolean;
    showMinimizeButton: boolean;
    showCloseButton: boolean;
    showNewChatButton: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=AiChatDrawer.vue.d.ts.map