import { ChatAttachment, ChatInputUI, ChatInputTexts } from '../types';

interface Suggestion {
    id: string;
    title: string;
    description: string;
}
interface Props {
    modelValue: string;
    disabled?: boolean;
    sending?: boolean;
    placeholder?: string;
    supportPlaceholder?: string;
    minLength?: number;
    suggestions?: Suggestion[];
    hasHistory?: boolean;
    supportRequestMode?: boolean;
    showSupportModeToggle?: boolean;
    contextLinkText?: string;
    /** Custom UI classes for styling */
    ui?: ChatInputUI;
    /** Custom text overrides for i18n support */
    texts?: ChatInputTexts;
}
interface Mention {
    id: string;
    name: string;
    type?: string;
    metadata?: Record<string, any>;
}
interface SubmitPayload {
    message: string;
    attachments: ChatAttachment[];
    mentions: Mention[];
    isSupportRequest?: boolean;
}
declare function __VLS_template(): {
    "context-link"?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    disabled: boolean;
    sending: boolean;
    placeholder: string;
    supportPlaceholder: string;
    minLength: number;
    suggestions: () => never[];
    hasHistory: boolean;
    supportRequestMode: boolean;
    showSupportModeToggle: boolean;
    contextLinkText: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => void;
    submit: (payload: SubmitPayload) => void;
    cancel: () => void;
    "suggestion-select": (suggestion: Suggestion) => void;
    "toggle-support-mode": () => void;
    "context-link-click": () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    disabled: boolean;
    sending: boolean;
    placeholder: string;
    supportPlaceholder: string;
    minLength: number;
    suggestions: () => never[];
    hasHistory: boolean;
    supportRequestMode: boolean;
    showSupportModeToggle: boolean;
    contextLinkText: string;
}>>> & Readonly<{
    onCancel?: (() => any) | undefined;
    onSubmit?: ((payload: SubmitPayload) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    "onSuggestion-select"?: ((suggestion: Suggestion) => any) | undefined;
    "onToggle-support-mode"?: (() => any) | undefined;
    "onContext-link-click"?: (() => any) | undefined;
}>, {
    placeholder: string;
    supportPlaceholder: string;
    sending: boolean;
    supportRequestMode: boolean;
    suggestions: Suggestion[];
    disabled: boolean;
    minLength: number;
    hasHistory: boolean;
    showSupportModeToggle: boolean;
    contextLinkText: string;
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
//# sourceMappingURL=ChatInput.vue.d.ts.map