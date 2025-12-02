import { MentionItem, MentionProvider, MentionListUI, MentionListTexts } from '../types';

interface Props {
    items: MentionItem[];
    selectedIndex?: number;
    providers?: MentionProvider[];
    /** Custom UI classes for styling */
    ui?: MentionListUI;
    /** Custom text overrides for i18n support */
    texts?: MentionListTexts;
}
declare function __VLS_template(): {
    "item-icon"?(_: {
        item: MentionItem;
        type: string;
    }): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    selectedIndex: number;
    providers: () => never[];
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (item: MentionItem) => void;
    "update:selectedIndex": (index: number) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    selectedIndex: number;
    providers: () => never[];
}>>> & Readonly<{
    onSelect?: ((item: MentionItem) => any) | undefined;
    "onUpdate:selectedIndex"?: ((index: number) => any) | undefined;
}>, {
    selectedIndex: number;
    providers: MentionProvider[];
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
//# sourceMappingURL=MentionList.vue.d.ts.map