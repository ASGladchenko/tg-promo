import * as z from "zod";

export const consolationPrizeDtoSchema = z.object({
  createdAt: z.string(),
  createdBy: z.uuid(),
  expiresAt: z.string().nullable(),
  id: z.uuid(),
  isActive: z.boolean(),
  prizeId: z.uuid(),
  promoCode: z.string(),
  updatedAt: z.string()
});

export const consolationPrizesResponseDtoSchema = z.array(consolationPrizeDtoSchema);
