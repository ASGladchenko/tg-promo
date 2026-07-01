import * as z from "zod";

export type LoginFormState = z.infer<typeof formLoginSchema>;

export const formLoginSchema = z.object({
  login: z
    .string()
    .min(2, "Login must be at least 2 characters")
    .max(49, "Login must be at most 49 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      "Login must start with a letter and contain only letters, numbers, _ or -"
    ),
  password: z.string().min(8, "Password must be at least 8 characters")
});
