import { type z } from "zod";

import {
  crackSafeRuleDtoSchema,
  crackSafeRuleRewardDtoSchema,
  crackSafeRulesResponseDtoSchema
} from "./crack-safe-rules-response-schema";

export type CrackSafeRuleRewardDto = z.output<typeof crackSafeRuleRewardDtoSchema>;
export type CrackSafeRuleDto = z.output<typeof crackSafeRuleDtoSchema>;
export type CrackSafeRulesResponseDto = z.output<typeof crackSafeRulesResponseDtoSchema>;
type PrizeId = CrackSafeRuleRewardDto["prizeId"];
export type CrackSafeRuleRewardPayload = {
  prizeId: PrizeId;
  promoCodes: string[];
};
export type CreateCrackSafeRulePayload = {
  codeLength: number;
  gameDate: string;
  jackpotPrize: CrackSafeRuleRewardPayload;
  semiJackpotPrize?: CrackSafeRuleRewardPayload;
};
export type UpdateCrackSafeRulePayload = Partial<{
  codeLength: number;
  gameDate: string;
  jackpotPrize: CrackSafeRuleRewardPayload | null;
  semiJackpotPrize: CrackSafeRuleRewardPayload | null;
}>;
export type UpdateCrackSafeRuleVariables = {
  date: string;
  payload: UpdateCrackSafeRulePayload;
};
