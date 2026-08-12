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
  onCancel?: () => void;
  onOpen?: () => void;
  onReset: () => void;
  onSubmit: (data: AdminCrackSafeRuleFormState) => Promise<void>;
  periodLabel?: string;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  renderTrigger: (props: AdminCrackSafeRuleFormModalTriggerRenderProps) => ReactNode;
  shouldShowPeriodFields?: boolean;
  submitLabel: string;
  title: string;
};
