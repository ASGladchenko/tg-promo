import * as z from "zod";

export const aiTranslateTextPayloadSchema = z.object({
  text: z.string().trim().min(1),
  targetLanguages: z.array(z.string().trim().min(1)).min(1),
  sourceLanguage: z.string().trim().min(1),
  context: z.string().trim().min(1)
});

export const aiTextTranslationsSchema = z.record(z.string().trim().min(1), z.string().trim().min(1));

export const aiTranslateTextResponseSchema = z.object({
  translations: aiTextTranslationsSchema
});

export type AiTranslateTextPayload = z.output<typeof aiTranslateTextPayloadSchema>;
export type AiTextTranslations = z.output<typeof aiTextTranslationsSchema>;
