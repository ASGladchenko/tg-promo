import { type z } from "zod";

import {
  type luckyMeadowRuleDtoSchema,
  type luckyMeadowRulePrizeDtoSchema,
  type luckyMeadowRulesResponseDtoSchema
} from "./lucky-meadow-rules-response-schema";

export type LuckyMeadowRulePrizeDto = z.output<typeof luckyMeadowRulePrizeDtoSchema>;
export type LuckyMeadowRuleDto = z.output<typeof luckyMeadowRuleDtoSchema>;
export type LuckyMeadowRulesResponseDto = z.output<typeof luckyMeadowRulesResponseDtoSchema>;

export type CreateLuckyMeadowRulePayload = {
  endDate: string;
  jackpotPrize: LuckyMeadowRulePrizeDto;
  semiJackpotPrize?: LuckyMeadowRulePrizeDto;
  startDate: string;
};

export type UpdateLuckyMeadowRulePayload = Partial<CreateLuckyMeadowRulePayload>;
