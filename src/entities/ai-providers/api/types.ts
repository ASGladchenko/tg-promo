import { type z } from "zod";

import { aiProviderModelsResponseDtoSchema } from "./ai-provider-models-response-schema";
import { aiProviderDtoSchema, aiProvidersResponseDtoSchema } from "./ai-providers-response-schema";

export type AiProviderDto = z.output<typeof aiProviderDtoSchema>;
export type AiProviderModelsResponseDto = z.output<typeof aiProviderModelsResponseDtoSchema>;
export type AiProvidersResponseDto = z.output<typeof aiProvidersResponseDtoSchema>;

export type CreateAiProviderPayload = Pick<AiProviderDto, "baseUrl" | "code" | "name">;
export type UpdateAiProviderApiKeyPayload = {
  apiKey: string;
};

export type UpdateAiProviderModelPayload = {
  model: string;
};

export type UpdateAiProviderStatusPayload = Partial<Pick<AiProviderDto, "isActive" | "isSelected">>;
