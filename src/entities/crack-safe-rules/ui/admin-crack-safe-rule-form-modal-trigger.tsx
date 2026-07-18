import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminCrackSafeRuleFormSchema } from "../model/admin-crack-safe-rule-form-schema";
import { type AdminCrackSafeRuleFormState } from "../model/types";
import { AdminCrackSafeRuleFormFields } from "./admin-crack-safe-rule-form-fields";
import { AdminCrackSafeRuleFormModalTriggerProps } from "./types";

import "./admin-crack-safe-rule-form-modal-trigger.scss";

export function AdminCrackSafeRuleFormModalTrigger({
  title,
  onReset,
  onSubmit,
  isPending,
  submitLabel,
  defaultValues,
  failureMessage,
  prizeOptions,
  renderTrigger,
  closeAriaLabel,
  modalAriaLabel,
  canClearSemiJackpotPrize = true
}: AdminCrackSafeRuleFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const rootErrorMessage =
    typeof errors.root?.server?.message === "string" ? errors.root.server.message : undefined;

  const openModal = () => {
    reset(defaultValues);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onReset();
    reset(defaultValues);
  };

  const handleSubmit = async (data: AdminCrackSafeRuleFormState) => {
    try {
      await onSubmit(data);
      closeModal();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : failureMessage
      });
    }
  };

  return (
    <>
      {renderTrigger({ isPending, openModal })}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        ariaLabel={modalAriaLabel}
        hasOverlay
        className="admin-crack-safe-rule-form-modal-trigger__modal"
      >
        <AdminModalForm<AdminCrackSafeRuleFormState>
          form={form}
          title={title}
          eyebrow="Crack Safe Rule"
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel={closeAriaLabel}
        >
          <AdminCrackSafeRuleFormFields
            disabled={isFormPending}
            prizeOptions={prizeOptions}
            canClearSemiJackpotPrize={canClearSemiJackpotPrize}
          />

          <AdminModalFormRootError message={rootErrorMessage} />

          <div className="admin-modal-form__actions">
            <ButtonBase type="button" onClick={closeModal} disabled={isFormPending} variant="danger">
              Cancel
            </ButtonBase>

            <ButtonLoading type="submit" variant="primary" disabled={isFormPending} isLoading={isFormPending}>
              <span>{submitLabel}</span>
            </ButtonLoading>
          </div>
        </AdminModalForm>
      </Modal>
    </>
  );
}
