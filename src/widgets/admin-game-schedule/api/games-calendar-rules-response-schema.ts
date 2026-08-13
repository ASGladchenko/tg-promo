import * as z from "zod";

const rulePrizeDtoSchema = z.object({
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

const crackSafeRuleDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  endDate: z.string(),
  id: z.uuid(),
  jackpotPrize: rulePrizeDtoSchema,
  jackpotWinsLimit: z.number(),
  scheduleId: z.uuid(),
  semiJackpotPrize: rulePrizeDtoSchema.nullable(),
  semiJackpotWinsLimit: z.number(),
  startDate: z.string(),
  updatedAt: z.string()
});

const luckyMeadowRuleDtoSchema = z.object({
  createdAt: z.string(),
  endDate: z.string(),
  id: z.uuid(),
  jackpotPrize: rulePrizeDtoSchema,
  scheduleId: z.uuid(),
  semiJackpotPrize: rulePrizeDtoSchema.nullable(),
  startDate: z.string(),
  updatedAt: z.string()
});

export const gamesCalendarRulesResponseDtoSchema = z.object({
  crackSafe: z.array(crackSafeRuleDtoSchema),
  luckyMeadow: z.array(luckyMeadowRuleDtoSchema)
});
