import * as z from "zod";

export const crackSafeRuleRewardDtoSchema = z.object({
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

export const crackSafeRuleDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  gameDate: z.string(),
  id: z.uuid(),
  jackpotPrize: crackSafeRuleRewardDtoSchema.nullable(),
  jackpotWinsLimit: z.number(),
  semiJackpotPrize: crackSafeRuleRewardDtoSchema.nullable(),
  semiJackpotWinsLimit: z.number(),
  updatedAt: z.string()
});

export const crackSafeRulesResponseDtoSchema = z.array(crackSafeRuleDtoSchema);
