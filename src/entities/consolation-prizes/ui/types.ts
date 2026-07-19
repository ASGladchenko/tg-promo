import { type ReactNode } from "react";

import {
  type AdminConsolationPrizeDirtyFields,
  type AdminConsolationPrizeFormState,
  type ConsolationPrizeOption
} from "../model/types";

export type AdminConsolationPrizeFormModalTriggerProps = {
  closeAriaLabel: string;
  defaultValues: AdminConsolationPrizeFormState;
  descriptionLabelAction?: (props: { disabled: boolean }) => ReactNode;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (
    data: AdminConsolationPrizeFormState,
    dirtyFields: AdminConsolationPrizeDirtyFields
  ) => Promise<void>;
  prizeOptions: ConsolationPrizeOption[];
  renderTrigger: (props: { isPending: boolean; openModal: () => void }) => ReactNode;
  submitLabel: string;
  title: string;
};
