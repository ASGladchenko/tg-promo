import * as z from "zod";

export const consolationPrizeDtoSchema = z.object({
  createdAt: z.string(),
  createdBy: z.uuid(),
  description: z.string().nullable(),
  expiresAt: z.string().nullable(),
  id: z.uuid(),
  isActive: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  prizeId: z.uuid(),
  promoCode: z.string(),
  updatedAt: z.string()
});

export const consolationPrizesResponseDtoSchema = z.array(consolationPrizeDtoSchema);
