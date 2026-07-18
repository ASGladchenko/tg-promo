import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminPrizeFormSchema } from "../model/admin-prize-form-schema";
import { type AdminPrizeFormState } from "../model/types";
import { AdminPrizeFormFields } from "./admin-prize-form-fields";
import { AdminPrizeFormModalTriggerProps } from "./types";

import "./admin-prize-form-modal-trigger.scss";

export function AdminPrizeFormModalTrigger({
  title,
  onReset,
  onSubmit,
  isPending,
  submitLabel,
  defaultValues,
  renderTrigger,
  closeAriaLabel,
  failureMessage,
  modalAriaLabel
}: AdminPrizeFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<AdminPrizeFormState>({
    resolver: zodResolver(adminPrizeFormSchema),
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

  const handleSubmit = async (data: AdminPrizeFormState) => {
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
        className="admin-prize-form-modal-trigger__modal"
      >
        <AdminModalForm<AdminPrizeFormState>
          form={form}
          title={title}
          eyebrow="Prize"
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel={closeAriaLabel}
        >
          <AdminPrizeFormFields disabled={isFormPending} />

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
