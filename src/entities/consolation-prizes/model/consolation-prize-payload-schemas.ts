import * as z from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiration date must use YYYY-MM-DD format");

const consolationPrizePayloadFields = {
  prizeId: z.uuid("Prize id must be a UUID"),
  promoCode: z.string().trim().min(1, "Promo code is required").max(100, "Promo code is too long"),
  description: z.string().trim(),
  isActive: z.boolean()
};

export const createConsolationPrizePayloadSchema = z.object({
  ...consolationPrizePayloadFields,
  description: consolationPrizePayloadFields.description.optional(),
  expiresAt: dateSchema.optional(),
  isActive: consolationPrizePayloadFields.isActive.optional()
});

export const updateConsolationPrizePayloadSchema = z.object({
  prizeId: consolationPrizePayloadFields.prizeId.optional(),
  promoCode: consolationPrizePayloadFields.promoCode.optional(),
  description: consolationPrizePayloadFields.description.optional(),
  expiresAt: dateSchema.nullable().optional(),
  isActive: consolationPrizePayloadFields.isActive.optional()
});
