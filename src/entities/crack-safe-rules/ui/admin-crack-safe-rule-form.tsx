import { type ReactNode } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";

import { adminCrackSafeRuleFormSchema } from "../model/admin-crack-safe-rule-form-schema";
import { type AdminCrackSafeRuleFormState } from "../model/types";
import { AdminCrackSafeRuleFormFields } from "./admin-crack-safe-rule-form-fields";
import { type AdminCrackSafeRulePrizeOption } from "./types";

import "./admin-crack-safe-rule-form.scss";

type AdminCrackSafeRuleFormProps = {
  canClearSemiJackpotPrize?: boolean;
  closeAriaLabel: string;
  defaultValues: AdminCrackSafeRuleFormState;
  deleteAction?: {
    isPending: boolean;
    label: string;
    onClick: () => void;
  };
  errorMessage?: string;
  failureMessage: string;
  isPending: boolean;
  onClose: () => void;
  onReset: () => void;
  onSubmit: (data: AdminCrackSafeRuleFormState) => Promise<void>;
  onSuccess: () => void;
  periodContent?: ReactNode;
  periodLabel?: string;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  submitLabel: string;
  title: string;
};

export function AdminCrackSafeRuleForm({
  title,
  onClose,
  onReset,
  onSubmit,
  onSuccess,
  periodContent,
  isPending,
  submitLabel,
  defaultValues,
  deleteAction,
  errorMessage,
  failureMessage,
  prizeOptions,
  closeAriaLabel,
  periodLabel,
  canClearSemiJackpotPrize = true
}: AdminCrackSafeRuleFormProps) {
  const form = useForm<AdminCrackSafeRuleFormState>({
    resolver: zodResolver(adminCrackSafeRuleFormSchema),
    defaultValues
  });

  const {
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = form;

  const isFormPending = isSubmitting || isPending;
  const formRootErrorMessage =
    typeof errors.root?.server?.message === "string" ? errors.root.server.message : undefined;
  const rootErrorMessage = errorMessage ?? formRootErrorMessage;

  const resetForm = () => {
    onReset();
    reset(defaultValues);
  };

  const closeForm = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (data: AdminCrackSafeRuleFormState) => {
    try {
      await onSubmit(data);
      resetForm();
      onSuccess();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : failureMessage
      });
    }
  };

  return (
    <AdminModalForm<AdminCrackSafeRuleFormState>
      closeAriaLabel={closeAriaLabel}
      eyebrow="Crack Safe Rule"
      form={form}
      isCloseDisabled={isFormPending}
      onClose={closeForm}
      onSubmit={handleSubmit}
      title={title}
    >
      {periodLabel ? <p className="admin-crack-safe-rule-form__period">{periodLabel}</p> : null}

      {periodContent}

      <AdminCrackSafeRuleFormFields
        disabled={isFormPending}
        prizeOptions={prizeOptions}
        canClearSemiJackpotPrize={canClearSemiJackpotPrize}
      />

      <AdminModalFormRootError message={rootErrorMessage} />

      <div
        className={clsx("admin-modal-form__actions", {
          "admin-modal-form__actions--split": deleteAction
        })}
      >
        {deleteAction ? (
          <ButtonLoading
            type="button"
            appearance="outline"
            disabled={isFormPending}
            isLoading={deleteAction.isPending}
            onClick={deleteAction.onClick}
            variant="danger"
          >
            <span>{deleteAction.label}</span>
          </ButtonLoading>
        ) : null}

        <div className="admin-modal-form__primary-actions">
          <ButtonBase type="button" onClick={closeForm} disabled={isFormPending} variant="danger">
            Cancel
          </ButtonBase>

          <ButtonLoading type="submit" variant="primary" disabled={isFormPending} isLoading={isFormPending}>
            <span>{submitLabel}</span>
          </ButtonLoading>
        </div>
      </div>
    </AdminModalForm>
  );
}
