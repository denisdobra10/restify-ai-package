import { Ref } from 'vue';
import { RestifyAiConfig, RestifyAiLabels } from './types';

export declare const defaultLabels: Required<RestifyAiLabels>;
export declare function setRestifyAiConfig(config: RestifyAiConfig): void;
export declare function getRestifyAiConfig(): RestifyAiConfig | null;
export declare function getRestifyAiConfigOrThrow(): RestifyAiConfig;
export declare function useRestifyAiConfig(): Ref<RestifyAiConfig | null>;
export declare function isConfigured(): boolean;
export declare function getLabel(key: keyof RestifyAiLabels, params?: Record<string, any>): string;
export declare function getDefaultConfigValue<K extends keyof RestifyAiConfig>(key: K): RestifyAiConfig[K] | undefined;
export declare function getConfigValue<K extends keyof RestifyAiConfig>(key: K): RestifyAiConfig[K] | undefined;
//# sourceMappingURL=config.d.ts.map