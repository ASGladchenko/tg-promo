import { type ReactNode, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminPrizeFormSchema, type AdminPrizeFormState } from "../model/admin-prize-form-schema";
import { AdminPrizeFormFields } from "./admin-prize-form-fields";

import "./admin-prize-form-modal-trigger.scss";

type AdminPrizeFormModalTriggerRenderProps = {
  isPending: boolean;
  openModal: () => void;
};
type AdminPrizeFormModalTriggerProps = {
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

          {rootErrorMessage ? (
            <p className="admin-prize-form-modal-trigger__root-error" role="alert">
              {rootErrorMessage}
            </p>
          ) : null}

          <div className="admin-prize-form-modal-trigger__actions">
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
