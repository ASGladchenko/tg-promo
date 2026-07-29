import * as z from "zod";

export const crackSafeRuleRewardDtoSchema = z.object({
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

export const crackSafeRuleDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  endDate: z.string(),
  id: z.uuid(),
  jackpotPrize: crackSafeRuleRewardDtoSchema,
  jackpotWinsLimit: z.number(),
  scheduleId: z.uuid(),
  semiJackpotPrize: crackSafeRuleRewardDtoSchema.nullable(),
  semiJackpotWinsLimit: z.number(),
  startDate: z.string(),
  updatedAt: z.string()
});

export const crackSafeRulesResponseDtoSchema = z.array(crackSafeRuleDtoSchema);
