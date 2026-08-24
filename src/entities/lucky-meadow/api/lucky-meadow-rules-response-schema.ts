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
  semiFallbackAttempts: z.number(),
  semiJackpotPrize: luckyMeadowRulePrizeDtoSchema.nullable(),
  startDate: z.string(),
  trapCount: z.number(),
  updatedAt: z.string()
});
