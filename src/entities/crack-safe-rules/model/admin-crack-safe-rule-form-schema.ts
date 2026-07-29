import * as z from "zod";

export const ADMIN_CRACK_SAFE_RULE_DEFAULT_CODE_LENGTH = 3;

const adminCrackSafeRulePeriodDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format");

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
    codeLength: z
      .string()
      .trim()
      .min(1, "Code length is required")
      .regex(/^\d+$/, "Code length must be an integer")
      .refine((value) => Number(value) >= 3, "Code length must be at least 3")
      .refine((value) => Number(value) <= 6, "Code length must be at most 6"),
    endDate: adminCrackSafeRulePeriodDateSchema,
    jackpotPrize: adminCrackSafeRuleRewardSchema,
    semiJackpotPrize: adminCrackSafeRuleRewardSchema.nullable(),
    startDate: adminCrackSafeRulePeriodDateSchema
  })
  .superRefine((data, context) => {
    if (data.endDate < data.startDate) {
      context.addIssue({
        code: "custom",
        message: "End date must be greater than or equal to start date",
        path: ["endDate"]
      });
    }

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
