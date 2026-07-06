import { type z } from "zod";

import { ruleDtoSchema, ruleRewardDtoSchema, rulesResponseDtoSchema } from "./rules-response-schema";

export type RuleRewardDto = z.output<typeof ruleRewardDtoSchema>;
export type RuleDto = z.output<typeof ruleDtoSchema>;
export type RulesResponseDto = z.output<typeof rulesResponseDtoSchema>;

export type RuleRewardPayload = {
  prizeId: string;
  promoCodes: string[];
};

export type CreateRulePayload = {
  codeLength: number;
  gameDate: string;
  jackpotPrize: RuleRewardPayload;
  semiJackpotPrize?: RuleRewardPayload;
};

export type CreateTodayRulePayload = Omit<CreateRulePayload, "gameDate">;

export type UpdateRulePayload = Partial<{
  codeLength: number;
  gameDate: string;
  jackpotPrize: RuleRewardPayload | null;
  semiJackpotPrize: RuleRewardPayload | null;
}>;

export type UpdateRuleVariables = {
  date: string;
  payload: UpdateRulePayload;
};
