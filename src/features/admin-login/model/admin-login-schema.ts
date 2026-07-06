import * as z from "zod";

export type LoginFormState = z.infer<typeof formLoginSchema>;

export const formLoginSchema = z.object({
  login: z
    .string()
    .min(2, "Min 2 chars")
    .max(49, "Max 49 chars")
    .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Letters, numbers, _ or -"),
  password: z.string().min(8, "Min 8 chars")
});
