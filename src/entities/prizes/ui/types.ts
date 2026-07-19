import { ReactNode } from "react";

import { AdminPrizeFormState } from "../model/types";

export type AdminPrizeFormModalTriggerRenderProps = {
  isPending: boolean;
  openModal: () => void;
};
export type AdminPrizeFormDescriptionLabelActionRenderProps = {
  disabled: boolean;
};
export type AdminPrizeFormModalTriggerProps = {
  closeAriaLabel: string;
  defaultValues: AdminPrizeFormState;
  descriptionLabelAction?: (props: AdminPrizeFormDescriptionLabelActionRenderProps) => ReactNode;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (data: AdminPrizeFormState) => Promise<void>;
  renderTrigger: (props: AdminPrizeFormModalTriggerRenderProps) => ReactNode;
  submitLabel: string;
  title: string;
};
