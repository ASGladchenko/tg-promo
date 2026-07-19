import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useUpdateAiProviderApiKey } from "@/entities/ai-providers";
import { AdminModalForm, AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { InputField } from "@/shared/ui/input-field";
import { Modal } from "@/shared/ui/modal";

import "./admin-ai-provider-api-key-modal-trigger.scss";

type ApiKeyFormState = z.output<typeof apiKeyFormSchema>;
type AdminAiProviderApiKeyModalTriggerProps = {
  code: string;
  hasApiKey: boolean;
  name: string;
};

const apiKeyFormSchema = z.object({
  apiKey: z.string().trim().min(1, "API key is required")
});

export function AdminAiProviderApiKeyModalTrigger({
  code,
  name,
  hasApiKey
}: AdminAiProviderApiKeyModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateApiKey = useUpdateAiProviderApiKey();

  const form = useForm<ApiKeyFormState>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      apiKey: ""
    }
  });

  const {
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = form;

  const isFormPending = isSubmitting || updateApiKey.isPending;
  const rootErrorMessage =
    typeof errors.root?.server?.message === "string" ? errors.root.server.message : undefined;

  const closeModal = () => {
    setIsModalOpen(false);
    updateApiKey.reset();
    reset({ apiKey: "" });
  };

  const handleSubmit = async (data: ApiKeyFormState) => {
    try {
      await updateApiKey.mutateAsync({
        code,
        payload: data
      });
      closeModal();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : "Failed to update AI provider API key"
      });
    }
  };

  return (
    <>
      <ButtonBase
        height={36}
        type="button"
        appearance="outline"
        disabled={updateApiKey.isPending}
        className="api-key-trigger__button"
        onClick={() => setIsModalOpen(true)}
        variant={hasApiKey ? "success" : "danger"}
      >
        {hasApiKey ? "Set" : "Not set"}
      </ButtonBase>

      <Modal
        hasOverlay
        isOpen={isModalOpen}
        onClose={closeModal}
        className="api-key-modal"
        ariaLabel={`Update ${name} API key`}
      >
        <AdminModalForm<ApiKeyFormState>
          form={form}
          eyebrow={name}
          onClose={closeModal}
          title="Update API key"
          onSubmit={handleSubmit}
          isCloseDisabled={isFormPending}
          closeAriaLabel="Close API key modal"
        >
          <InputField<ApiKeyFormState>
            name="apiKey"
            type="password"
            label="API key"
            autoComplete="off"
            disabled={isFormPending}
            placeholder="Enter API key"
          />

          <AdminModalFormRootError message={rootErrorMessage} />

          <div className="admin-modal-form__actions">
            <ButtonBase type="button" onClick={closeModal} disabled={isFormPending} variant="danger">
              Cancel
            </ButtonBase>

            <ButtonLoading type="submit" variant="primary" disabled={isFormPending} isLoading={isFormPending}>
              <span>Save</span>
            </ButtonLoading>
          </div>
        </AdminModalForm>
      </Modal>
    </>
  );
}
