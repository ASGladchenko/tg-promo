import { type z } from "zod";

import { adminLuckyMeadowRuleFormSchema } from "./admin-lucky-meadow-rule-form-schema";

export type AdminLuckyMeadowRuleFormInput = z.input<typeof adminLuckyMeadowRuleFormSchema>;
export type AdminLuckyMeadowRuleFormState = z.output<typeof adminLuckyMeadowRuleFormSchema>;
