import { useState } from "react";

import { Modal } from "@/shared/ui/modal";

import { AdminCrackSafeRuleForm } from "./admin-crack-safe-rule-form";
import { AdminCrackSafeRuleFormModalTriggerProps } from "./types";

import "./admin-crack-safe-rule-form-modal-trigger.scss";

export function AdminCrackSafeRuleFormModalTrigger({
  title,
  onOpen,
  onReset,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
  periodLabel,
  prizeOptions,
  defaultValues,
  renderTrigger,
  failureMessage,
  closeAriaLabel,
  modalAriaLabel,
  canClearSemiJackpotPrize = true
}: AdminCrackSafeRuleFormModalTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    onOpen?.();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onCancel?.();
  };

  const closeAfterSuccess = () => {
    setIsModalOpen(false);
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
        <AdminCrackSafeRuleForm
          canClearSemiJackpotPrize={canClearSemiJackpotPrize}
          closeAriaLabel={closeAriaLabel}
          defaultValues={defaultValues}
          failureMessage={failureMessage}
          isPending={isPending}
          onClose={closeModal}
          onReset={onReset}
          onSubmit={onSubmit}
          onSuccess={closeAfterSuccess}
          periodLabel={periodLabel}
          prizeOptions={prizeOptions}
          submitLabel={submitLabel}
          title={title}
        />
      </Modal>
    </>
  );
}
