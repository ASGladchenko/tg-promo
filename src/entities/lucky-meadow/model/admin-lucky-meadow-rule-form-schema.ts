import * as z from "zod";

export const ADMIN_LUCKY_MEADOW_RULE_DEFAULT_TRAP_COUNT = 5;
export const ADMIN_LUCKY_MEADOW_RULE_MIN_TRAP_COUNT = 0;
export const ADMIN_LUCKY_MEADOW_RULE_MAX_TRAP_COUNT = 18;
export const ADMIN_LUCKY_MEADOW_RULE_DEFAULT_SEMI_FALLBACK_ATTEMPTS = 10;
export const ADMIN_LUCKY_MEADOW_RULE_MIN_SEMI_FALLBACK_ATTEMPTS = 1;
export const ADMIN_LUCKY_MEADOW_RULE_MAX_SEMI_FALLBACK_ATTEMPTS = 1000;

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
    semiFallbackAttempts: z
      .string()
      .trim()
      .min(1, "Semi fallback attempts is required")
      .regex(/^\d+$/, "Semi fallback attempts must be an integer")
      .refine(
        (value) => Number(value) >= ADMIN_LUCKY_MEADOW_RULE_MIN_SEMI_FALLBACK_ATTEMPTS,
        `Semi fallback attempts must be at least ${ADMIN_LUCKY_MEADOW_RULE_MIN_SEMI_FALLBACK_ATTEMPTS}`
      )
      .refine(
        (value) => Number(value) <= ADMIN_LUCKY_MEADOW_RULE_MAX_SEMI_FALLBACK_ATTEMPTS,
        `Semi fallback attempts must be at most ${ADMIN_LUCKY_MEADOW_RULE_MAX_SEMI_FALLBACK_ATTEMPTS}`
      ),
    semiJackpotPrize: adminLuckyMeadowRulePrizeSchema.nullable(),
    startDate: adminLuckyMeadowRuleDateSchema,
    trapCount: z
      .string()
      .trim()
      .min(1, "Trap count is required")
      .regex(/^\d+$/, "Trap count must be an integer")
      .refine(
        (value) => Number(value) >= ADMIN_LUCKY_MEADOW_RULE_MIN_TRAP_COUNT,
        `Trap count must be at least ${ADMIN_LUCKY_MEADOW_RULE_MIN_TRAP_COUNT}`
      )
      .refine(
        (value) => Number(value) <= ADMIN_LUCKY_MEADOW_RULE_MAX_TRAP_COUNT,
        `Trap count must be at most ${ADMIN_LUCKY_MEADOW_RULE_MAX_TRAP_COUNT}`
      )
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"]
  });
