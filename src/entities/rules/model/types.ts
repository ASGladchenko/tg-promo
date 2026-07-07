import { type z } from "zod";

import { type RuleDto, type RuleRewardDto } from "../api/types";
import { adminRuleFormSchema } from "./admin-rule-form-schema";

export type AdminRuleFormInput = z.input<typeof adminRuleFormSchema>;
export type AdminRuleFormState = z.output<typeof adminRuleFormSchema>;

export type RuleReward = RuleRewardDto;
export type Rule = RuleDto;
