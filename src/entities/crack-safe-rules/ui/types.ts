import { type ReactNode } from "react";

import { type AdminCrackSafeRuleFormState } from "../model/types";

export type AdminCrackSafeRuleFormModalTriggerRenderProps = {
  isPending: boolean;
  openModal: () => void;
};
export type AdminCrackSafeRulePrizeOption = {
  id: string;
  name: string;
};
export type AdminCrackSafeRuleFormModalTriggerProps = {
  canClearSemiJackpotPrize?: boolean;
  closeAriaLabel: string;
  defaultValues: AdminCrackSafeRuleFormState;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (data: AdminCrackSafeRuleFormState) => Promise<void>;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  renderTrigger: (props: AdminCrackSafeRuleFormModalTriggerRenderProps) => ReactNode;
  submitLabel: string;
  title: string;
};
