export const aiProvidersQueryKey = ["ai-providers"] as const;

export const aiProviderModelsQueryKey = (code: string) => ["ai-provider-models", code] as const;
