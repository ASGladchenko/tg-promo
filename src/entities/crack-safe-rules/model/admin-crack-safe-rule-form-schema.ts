import * as z from "zod";

export const ADMIN_CRACK_SAFE_RULE_DEFAULT_CODE_LENGTH = 3;

function parsePromoCodes(value: string) {
  return value
    .split(",")
    .map((promoCode) => promoCode.trim())
    .filter(Boolean);
}

function hasDuplicatePromoCodes(value: string) {
  const promoCodes = parsePromoCodes(value);

  return new Set(promoCodes).size !== promoCodes.length;
}

const adminCrackSafeRuleRewardSchema = z.object({
  prizeId: z.string().trim().min(1, "Prize ID is required"),
  promoCodes: z
    .string()
    .trim()
    .min(1, "At least one promo code is required")
    .refine((value) => parsePromoCodes(value).length > 0, "At least one promo code is required")
    .refine((value) => !hasDuplicatePromoCodes(value), "Promo codes must be unique")
});

export const adminCrackSafeRuleFormSchema = z
  .object({
    gameDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Game date must use YYYY-MM-DD format"),
    codeLength: z
      .string()
      .trim()
      .min(1, "Code length is required")
      .regex(/^\d+$/, "Code length must be an integer")
      .refine((value) => Number(value) > 0, "Code length must be greater than 0"),
    jackpotPrize: adminCrackSafeRuleRewardSchema,
    semiJackpotPrize: adminCrackSafeRuleRewardSchema.nullable()
  })
  .superRefine((data, context) => {
    if (!data.semiJackpotPrize) {
      return;
    }

    const jackpotPromoCodesCount = parsePromoCodes(data.jackpotPrize.promoCodes).length;
    const semiJackpotPromoCodesCount = parsePromoCodes(data.semiJackpotPrize.promoCodes).length;

    if (semiJackpotPromoCodesCount % jackpotPromoCodesCount !== 0) {
      context.addIssue({
        code: "custom",
        message: `Semi-jackpot promo codes count must be divisible by jackpot promo codes count (${jackpotPromoCodesCount})`,
        path: ["semiJackpotPrize", "promoCodes"]
      });
    }
  });
