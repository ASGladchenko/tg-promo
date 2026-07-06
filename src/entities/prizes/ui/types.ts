import { ReactNode } from "react";

import { AdminPrizeFormState } from "../model/types";

export type AdminPrizeFormModalTriggerRenderProps = {
  isPending: boolean;
  openModal: () => void;
};
export type AdminPrizeFormModalTriggerProps = {
  closeAriaLabel: string;
  defaultValues: AdminPrizeFormState;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (data: AdminPrizeFormState) => Promise<void>;
  renderTrigger: (props: AdminPrizeFormModalTriggerRenderProps) => ReactNode;
  submitLabel: string;
  title: string;
};
