import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { adminAiProviderFormSchema } from "../../model/admin-ai-provider-form-schema";
import { type AdminAiProviderFormState } from "../../model/types";
import { AdminAiProviderFormFields } from "../admin-ai-provider-form-fields";

import "./admin-ai-provider-form-modal-trigger.scss";

type AdminAiProviderFormModalTriggerProps = {
  closeAriaLabel: string;
  defaultValues: AdminAiProviderFormState;
  failureMessage: string;
  isPending: boolean;
  modalAriaLabel: string;
  onReset: () => void;
  onSubmit: (data: AdminAiProviderFormState) => Promise<void>;
  renderTrigger: (props: { isPending: boolean; openModal: () => void }) => React.ReactNode;
  submitLabel: string;
  title: string;
};

export function AdminAiProviderFormModalTrigger({
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
}: AdminAiProviderFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<AdminAiProviderFormState>({
    resolver: zodResolver(adminAiProviderFormSchema),
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

  const handleSubmit = async (data: AdminAiProviderFormState) => {
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
        className="provider-form"
      >
        <AdminModalForm<AdminAiProviderFormState>
          form={form}
          title={title}
          eyebrow="AI provider"
          onClose={closeModal}
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel={closeAriaLabel}
        >
          <AdminAiProviderFormFields disabled={isFormPending} />

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
