import * as z from "zod";

export const ADMIN_RULE_DEFAULT_CODE_LENGTH = 3;

const adminRuleRewardSchema = z.object({
  prizeId: z.string().trim().min(1, "Prize ID is required"),
  promoCodes: z
    .array(
      z.object({
        value: z.string().trim().min(1, "Promo code is required")
      })
    )
    .min(1, "At least one promo code is required")
});

export const adminRuleFormSchema = z
  .object({
    gameDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Game date must use YYYY-MM-DD format"),
    codeLength: z
      .string()
      .trim()
      .min(1, "Code length is required")
      .regex(/^\d+$/, "Code length must be an integer")
      .refine((value) => Number(value) > 0, "Code length must be greater than 0"),
    jackpotPrize: adminRuleRewardSchema,
    semiJackpotPrize: adminRuleRewardSchema.nullable()
  })
  .superRefine((data, context) => {
    if (!data.semiJackpotPrize) {
      return;
    }

    const jackpotPromoCodesCount = data.jackpotPrize.promoCodes.length;
    const semiJackpotPromoCodesCount = data.semiJackpotPrize.promoCodes.length;

    if (semiJackpotPromoCodesCount % jackpotPromoCodesCount !== 0) {
      context.addIssue({
        code: "custom",
        message: `Semi-jackpot promo codes count must be divisible by jackpot promo codes count (${jackpotPromoCodesCount})`,
        path: ["semiJackpotPrize", "promoCodes", "root"]
      });
    }
  });
