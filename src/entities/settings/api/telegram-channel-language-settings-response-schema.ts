import * as z from "zod";

export const telegramChannelLanguageSchema = z.enum(["ar", "en", "fr"]);

export const telegramChannelLanguageSettingsResponseDtoSchema = z.object({
  language: telegramChannelLanguageSchema,
  supportedLanguages: z.array(telegramChannelLanguageSchema)
});
