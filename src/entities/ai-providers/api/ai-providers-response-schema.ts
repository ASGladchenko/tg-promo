import * as z from "zod";

export const aiProviderDtoSchema = z.object({
  adapter: z.string(),
  baseUrl: z.url(),
  code: z.string(),
  createdAt: z.string(),
  hasApiKey: z.boolean(),
  id: z.uuid(),
  isActive: z.boolean(),
  isBuiltin: z.boolean(),
  isSelected: z.boolean(),
  name: z.string(),
  selectedModel: z.string().nullable(),
  updatedAt: z.string()
});

export const aiProvidersResponseDtoSchema = z.array(aiProviderDtoSchema);
