import * as z from "zod";

export const luckyMeadowRulePrizeDtoSchema = z.object({
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

export const luckyMeadowRuleDtoSchema = z.object({
  createdAt: z.string(),
  endDate: z.string(),
  id: z.uuid(),
  jackpotPrize: luckyMeadowRulePrizeDtoSchema,
  scheduleId: z.uuid(),
  semiJackpotPrize: luckyMeadowRulePrizeDtoSchema.nullable(),
  startDate: z.string(),
  updatedAt: z.string()
});

export const luckyMeadowRulesResponseDtoSchema = z.array(luckyMeadowRuleDtoSchema);
