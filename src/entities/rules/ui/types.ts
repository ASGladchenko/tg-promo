import { type ReactNode } from "react";

import { type AdminRuleFormState } from "../model/types";

export type AdminRuleFormModalTriggerRenderProps = {
  isPending: boolean;
  openModal: () => void;
};
export type AdminRulePrizeOption = {
  id: string;
  name: string;
};
export type AdminRuleFormModalTriggerProps = {
  canClearSemiJackpotPrize?: boolean;
  closeAriaLabel: string;
  defaultValues: AdminRuleFormState;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (data: AdminRuleFormState) => Promise<void>;
  prizeOptions: AdminRulePrizeOption[];
  renderTrigger: (props: AdminRuleFormModalTriggerRenderProps) => ReactNode;
  submitLabel: string;
  title: string;
};
