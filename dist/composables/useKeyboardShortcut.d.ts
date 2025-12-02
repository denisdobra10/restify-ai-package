export interface UseKeyboardShortcutOptions {
    shortcut?: string | null;
    onToggle: () => void;
    enabled?: boolean;
}
export declare function useKeyboardShortcut(options: UseKeyboardShortcutOptions): {
    isActive: import('vue').Ref<boolean, boolean>;
};
export declare function useAiDrawerShortcut(drawerRef: {
    value: boolean;
}): {
    isActive: import('vue').Ref<boolean, boolean>;
};
//# sourceMappingURL=useKeyboardShortcut.d.ts.map