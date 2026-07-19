import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminConsolationPrizeFormSchema } from "../model/admin-consolation-prize-form-schema";
import { type AdminConsolationPrizeFormState } from "../model/types";
import { AdminConsolationPrizeFormFields } from "./admin-consolation-prize-form-fields";
import { type AdminConsolationPrizeFormModalTriggerProps } from "./types";

import "./admin-consolation-prize-form-modal-trigger.scss";

export function AdminConsolationPrizeFormModalTrigger({
  title,
  onReset,
  onSubmit,
  isPending,
  submitLabel,
  defaultValues,
  renderTrigger,
  closeAriaLabel,
  descriptionLabelAction,
  failureMessage,
  modalAriaLabel,
  prizeOptions
}: AdminConsolationPrizeFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<AdminConsolationPrizeFormState>({
    resolver: zodResolver(adminConsolationPrizeFormSchema),
    defaultValues
  });
  const { reset, setError, formState } = form;
  const isFormPending = formState.isSubmitting || isPending;
  const rootErrorMessage = formState.errors.root?.server?.message;

  const closeModal = () => {
    setIsModalOpen(false);
    onReset();
    reset(defaultValues);
  };

  const handleSubmit = async (data: AdminConsolationPrizeFormState) => {
    try {
      await onSubmit(data, formState.dirtyFields);
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
      {renderTrigger({
        isPending,
        openModal: () => {
          reset(defaultValues);
          setIsModalOpen(true);
        }
      })}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        ariaLabel={modalAriaLabel}
        hasOverlay
        className="admin-consolation-prize-form-modal-trigger__modal"
      >
        <AdminModalForm<AdminConsolationPrizeFormState>
          form={form}
          title={title}
          eyebrow="Consolation prize"
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel={closeAriaLabel}
        >
          <AdminConsolationPrizeFormFields
            disabled={isFormPending}
            prizeOptions={prizeOptions}
            descriptionLabelAction={descriptionLabelAction?.({ disabled: isFormPending })}
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
