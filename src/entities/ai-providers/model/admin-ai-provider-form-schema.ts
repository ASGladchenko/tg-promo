import * as z from "zod";

export const adminAiProviderFormSchema = z.object({
  baseUrl: z.url("Base URL must be a valid URL"),
  code: z.string().trim().min(1, "Code is required"),
  name: z.string().trim().min(1, "Name is required")
});
