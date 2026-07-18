import { type z } from "zod";

import { aiProviderDtoSchema, aiProvidersResponseDtoSchema } from "./ai-providers-response-schema";

export type AiProviderDto = z.output<typeof aiProviderDtoSchema>;
export type AiProvidersResponseDto = z.output<typeof aiProvidersResponseDtoSchema>;

export type CreateAiProviderPayload = Pick<AiProviderDto, "baseUrl" | "code" | "name">;
