import { type z } from "zod";

import { type CrackSafeRuleDto, type CrackSafeRuleRewardDto } from "../api/types";
import { adminCrackSafeRuleFormSchema } from "./admin-crack-safe-rule-form-schema";

export type AdminCrackSafeRuleFormInput = z.input<typeof adminCrackSafeRuleFormSchema>;
export type AdminCrackSafeRuleFormState = z.output<typeof adminCrackSafeRuleFormSchema>;

export type CrackSafeRuleReward = CrackSafeRuleRewardDto;
export type CrackSafeRule = CrackSafeRuleDto;
