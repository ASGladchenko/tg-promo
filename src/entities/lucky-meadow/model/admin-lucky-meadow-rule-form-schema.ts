import * as z from "zod";

const adminLuckyMeadowRuleDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format");

function parsePromoCodes(value: string) {
  return value
    .split(",")
    .map((promoCode) => promoCode.trim())
    .filter(Boolean);
}

const adminLuckyMeadowRulePrizeSchema = z.object({
  prizeId: z.string().trim().min(1, "Prize is required"),
  promoCodes: z
    .string()
    .trim()
    .min(1, "At least one promo code is required")
    .refine((value) => parsePromoCodes(value).length > 0, "At least one promo code is required")
    .refine((value) => {
      const promoCodes = parsePromoCodes(value);

      return new Set(promoCodes).size === promoCodes.length;
    }, "Promo codes must be unique")
});

export const adminLuckyMeadowRuleFormSchema = z
  .object({
    endDate: adminLuckyMeadowRuleDateSchema,
    jackpotPrize: adminLuckyMeadowRulePrizeSchema,
    semiJackpotPrize: adminLuckyMeadowRulePrizeSchema.nullable(),
    startDate: adminLuckyMeadowRuleDateSchema
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"]
  });
