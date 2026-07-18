import { type z } from "zod";

import { type AiProviderDto } from "../api/types";
import { adminAiProviderFormSchema } from "./admin-ai-provider-form-schema";

export type AdminAiProviderFormState = z.output<typeof adminAiProviderFormSchema>;
export type AiProvider = AiProviderDto;
