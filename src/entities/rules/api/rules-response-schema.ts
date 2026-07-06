import * as z from "zod";

export const ruleRewardDtoSchema = z.object({
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

export const ruleDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  gameDate: z.string(),
  id: z.uuid(),
  jackpotPrize: ruleRewardDtoSchema.nullable(),
  jackpotWinsLimit: z.number(),
  semiJackpotPrize: ruleRewardDtoSchema.nullable(),
  semiJackpotWinsLimit: z.number(),
  updatedAt: z.string()
});

export const rulesResponseDtoSchema = z.array(ruleDtoSchema);
