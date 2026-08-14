import { type z } from "zod";

import { crackSafeRuleDtoSchema, crackSafeRuleRewardDtoSchema } from "./crack-safe-rules-response-schema";

export type CrackSafeRuleRewardDto = z.output<typeof crackSafeRuleRewardDtoSchema>;
export type CrackSafeRuleDto = z.output<typeof crackSafeRuleDtoSchema>;
type PrizeId = CrackSafeRuleRewardDto["prizeId"];
export type CrackSafeRuleRewardPayload = {
  prizeId: PrizeId;
  promoCodes: string[];
};
export type CreateCrackSafeRulePayload = {
  codeLength: number;
  endDate: string;
  jackpotPrize: CrackSafeRuleRewardPayload;
  semiJackpotPrize?: CrackSafeRuleRewardPayload;
  startDate: string;
};
export type UpdateCrackSafeRulePayload = Partial<{
  codeLength: number;
  endDate: string;
  jackpotPrize: CrackSafeRuleRewardPayload | null;
  semiJackpotPrize: CrackSafeRuleRewardPayload | null;
  startDate: string;
}>;
export type UpdateCrackSafeRuleVariables = {
  payload: UpdateCrackSafeRulePayload;
  startDate: string;
};
