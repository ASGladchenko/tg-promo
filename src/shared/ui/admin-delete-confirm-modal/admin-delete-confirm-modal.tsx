import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import "./admin-delete-confirm-modal.scss";

type AdminDeleteConfirmModalProps = {
  description: string;
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminDeleteConfirmModal({
  description,
  isOpen,
  isPending,
  onCancel,
  onConfirm
}: AdminDeleteConfirmModalProps) {
  const closeModal = () => {
    if (!isPending) {
      onCancel();
    }
  };

  return (
    <Modal
      ariaLabel="Delete rule confirmation"
      className="delete-confirm"
      hasOverlay
      isOpen={isOpen}
      onClose={closeModal}
    >
      <div className="delete-confirm__content">
        <div className="delete-confirm__header">
          <p className="delete-confirm__eyebrow">Confirm action</p>
          <h2 className="delete-confirm__title">Delete Rule</h2>
        </div>

        <p className="delete-confirm__description">{description}</p>

        <div className="delete-confirm__actions">
          <ButtonBase type="button" disabled={isPending} onClick={onCancel} variant="dark">
            Cancel
          </ButtonBase>

          <ButtonLoading
            type="button"
            disabled={isPending}
            isLoading={isPending}
            onClick={onConfirm}
            variant="danger"
          >
            <span>Delete</span>
          </ButtonLoading>
        </div>
      </div>
    </Modal>
  );
}
