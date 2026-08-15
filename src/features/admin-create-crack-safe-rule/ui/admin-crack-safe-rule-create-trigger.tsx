import { type ReactNode, useState } from "react";

import { ButtonBase } from "@/shared/ui/button-base";
import { Modal } from "@/shared/ui/modal";

import { AdminCrackSafeRuleCreateForm } from "./admin-crack-safe-rule-create-form";

import "./admin-crack-safe-rule-create-trigger.scss";

type AdminCrackSafeRuleCreateTriggerProps = {
  onCancel?: () => void;
  onOpen?: () => void;
  period?: {
    endDate: string;
    label: string;
    startDate: string;
  };
  renderTrigger?: (props: { isPending: boolean; openModal: () => void }) => ReactNode;
};

export function AdminCrackSafeRuleCreateTrigger({
  onCancel,
  onOpen,
  period,
  renderTrigger
}: AdminCrackSafeRuleCreateTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    onCancel?.();
  };

  const closeAfterSuccess = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    onOpen?.();
    setIsModalOpen(true);
  };

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ isPending: false, openModal })
      ) : (
        <ButtonBase type="button" onClick={openModal} aria-haspopup="dialog">
          Add Rule
        </ButtonBase>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        ariaLabel="Add Crack Safe rule"
        hasOverlay
        className="admin-crack-safe-rule-create-trigger__modal"
      >
        <AdminCrackSafeRuleCreateForm onClose={closeModal} onSuccess={closeAfterSuccess} period={period} />
      </Modal>
    </>
  );
}
