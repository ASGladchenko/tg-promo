import { type z } from "zod";

import {
  type luckyMeadowRuleDtoSchema,
  type luckyMeadowRulesResponseDtoSchema
} from "./lucky-meadow-rules-response-schema";

export type LuckyMeadowRuleDto = z.output<typeof luckyMeadowRuleDtoSchema>;
export type LuckyMeadowRulesResponseDto = z.output<typeof luckyMeadowRulesResponseDtoSchema>;
