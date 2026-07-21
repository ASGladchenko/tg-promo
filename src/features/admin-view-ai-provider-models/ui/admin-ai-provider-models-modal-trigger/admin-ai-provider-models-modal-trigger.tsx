import { useId, useState } from "react";

import clsx from "clsx";

import { useAiProviderModels, useUpdateAiProviderModel } from "@/entities/ai-providers";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminModalFormRootError } from "@/shared/ui/admin-modal-form";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import "./admin-ai-provider-models-modal-trigger.scss";

type AdminAiProviderModelsModalTriggerProps = {
  code: string;
  name: string;
  selectedModel: string | null;
};

const highlightedModels = [
  "models/gemini-3-flash-preview",
  "models/gemini-3.5-flash",
  "models/gemini-3.1-flash-lite",
  "models/gemini-flash-latest",
  "models/gemini-flash-lite-latest",
  "gpt-oss:120b",
  "gpt-oss:20b",
  "nemotron-3-super",
  "nemotron-3-nano:30b",
  "gemma4:31b"
];

export function AdminAiProviderModelsModalTrigger({
  code,
  name,
  selectedModel
}: AdminAiProviderModelsModalTriggerProps) {
  const titleId = useId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modelsQuery = useAiProviderModels(code, { enabled: isModalOpen });
  const updateModel = useUpdateAiProviderModel();

  const errorMessage = getErrorMessage(modelsQuery.error, "Unknown AI provider models loading error");
  const updateErrorMessage = getErrorMessage(updateModel.error, "Unknown AI provider model update error");

  const isUpdatePending = updateModel.isPending;

  const closeModal = () => {
    setIsModalOpen(false);
    updateModel.reset();
  };

  const selectModel = (model: string) => {
    updateModel.mutate(
      {
        code,
        payload: {
          model
        }
      },
      {
        onSuccess: closeModal
      }
    );
  };

  let modalBody = null;

  if (modelsQuery.isLoading) {
    modalBody = (
      <p className="models-modal__state" aria-live="polite">
        Loading models...
      </p>
    );
  }

  if (modelsQuery.isError) {
    modalBody = <AdminModalFormRootError message={`Failed to load models. ${errorMessage}`} />;
  }

  if (modelsQuery.data?.length === 0) {
    modalBody = <p className="models-modal__state">No models found</p>;
  }

  if (modelsQuery.data && modelsQuery.data.length > 0) {
    const models = [...modelsQuery.data].sort((firstModel, secondModel) =>
      firstModel.localeCompare(secondModel)
    );

    modalBody = (
      <ul className="models-modal__list">
        {models.map((model) => (
          <li key={model}>
            <ButtonLoading
              height={36}
              type="button"
              onClick={() => selectModel(model)}
              disabled={isUpdatePending || selectedModel === model}
              isLoading={isUpdatePending && updateModel.variables?.payload.model === model}
              className={clsx("models-modal__button", {
                "models-modal__button--highlighted": highlightedModels.includes(model)
              })}
            >
              {model}
            </ButtonLoading>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <ButtonBase
        height={36}
        type="button"
        aria-haspopup="dialog"
        className="models-trigger__button"
        onClick={() => setIsModalOpen(true)}
        variant={selectedModel ? "success" : "default"}
        appearance={selectedModel ? "outline" : "solid"}
      >
        <span className="models-trigger__label">{selectedModel ?? "Models"}</span>
      </ButtonBase>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        ariaLabel={`${name} models`}
        hasOverlay
        className="models-modal"
      >
        <section className="admin-modal-form admin-hover-scrollbar-container" aria-labelledby={titleId}>
          <div className="admin-modal-form__header">
            <div>
              <p className="admin-modal-form__eyebrow">{name}</p>
              <h2 id={titleId} className="admin-modal-form__title">
                Available models
              </h2>
            </div>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Close models modal"
              className="admin-modal-form__close"
            >
              <span className="admin-modal-form__close-icon" aria-hidden="true" />
            </button>
          </div>

          <div className="admin-modal-form__content admin-hover-scrollbar">
            <AdminModalFormRootError
              message={updateModel.isError ? `Failed to update model. ${updateErrorMessage}` : undefined}
            />

            {modalBody}
          </div>
        </section>
      </Modal>
    </>
  );
}
