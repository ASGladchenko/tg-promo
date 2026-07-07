import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminRuleFormSchema } from "../model/admin-rule-form-schema";
import { type AdminRuleFormState } from "../model/types";
import { AdminRuleFormFields } from "./admin-rule-form-fields";
import { AdminRuleFormModalTriggerProps } from "./types";

import "./admin-rule-form-modal-trigger.scss";

export function AdminRuleFormModalTrigger({
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
}: AdminRuleFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<AdminRuleFormState>({
    resolver: zodResolver(adminRuleFormSchema),
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

  const handleSubmit = async (data: AdminRuleFormState) => {
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
        className="admin-rule-form-modal-trigger__modal"
      >
        <AdminModalForm<AdminRuleFormState>
          form={form}
          title={title}
          eyebrow="Rule"
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel={closeAriaLabel}
        >
          <AdminRuleFormFields
            disabled={isFormPending}
            prizeOptions={prizeOptions}
            canClearSemiJackpotPrize={canClearSemiJackpotPrize}
          />

          {rootErrorMessage ? (
            <p className="admin-rule-form-modal-trigger__root-error" role="alert">
              {rootErrorMessage}
            </p>
          ) : null}

          <div className="admin-rule-form-modal-trigger__actions">
            <ButtonBase type="button" onClick={closeModal} disabled={isFormPending}>
              Cancel
            </ButtonBase>

            <ButtonLoading type="submit" variant="dark" disabled={isFormPending} isLoading={isFormPending}>
              <span>{submitLabel}</span>
            </ButtonLoading>
          </div>
        </AdminModalForm>
      </Modal>
    </>
  );
}
