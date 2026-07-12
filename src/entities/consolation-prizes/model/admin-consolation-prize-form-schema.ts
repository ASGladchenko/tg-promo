import * as z from "zod";

export const adminConsolationPrizeFormSchema = z.object({
  prizeId: z.uuid("Select a prize"),
  promoCode: z
    .string()
    .trim()
    .min(1, "Promo code is required")
    .max(100, "Promo code must contain at most 100 characters"),
  description: z.string().trim(),
  expiresAt: z
    .string()
    .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use YYYY-MM-DD format"),
  isActive: z.boolean()
});
