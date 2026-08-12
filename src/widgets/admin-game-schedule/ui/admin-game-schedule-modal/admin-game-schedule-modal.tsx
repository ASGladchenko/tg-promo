import { useEffect, useState } from "react";

import { AdminCrackSafeRuleCreateForm } from "@/features/admin-create-crack-safe-rule";
import { Modal } from "@/shared/ui/modal";

import { AdminScheduleGameId } from "../../model/admin-schedule-game";
import { ScheduleGamePicker } from "../schedule-game-picker/schedule-game-picker";

import "./admin-game-schedule-modal.scss";

type ScheduleModalView = "game-picker" | AdminScheduleGameId;

type AdminGameScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  period?: {
    endDate: string;
    label: string;
    startDate: string;
  };
};

export function AdminGameScheduleModal({ isOpen, onClose, period }: AdminGameScheduleModalProps) {
  const [modalView, setModalView] = useState<ScheduleModalView>("game-picker");

  useEffect(() => {
    if (!isOpen) {
      setModalView("game-picker");
    }
  }, [isOpen]);

  const returnToGamePicker = () => {
    setModalView("game-picker");
  };

  const handleModalClose = () => {
    if (modalView !== "game-picker") {
      returnToGamePicker();

      return;
    }

    onClose();
  };

  let ariaLabel = "Schedule period";
  let content = (
    <ScheduleGamePicker periodLabel={period?.label} onClose={onClose} onGameClick={setModalView} />
  );

  if (modalView === AdminScheduleGameId.CrackSafe) {
    ariaLabel = "Add Crack Safe rule";
    content = (
      <AdminCrackSafeRuleCreateForm
        onClose={returnToGamePicker}
        onSuccess={onClose}
        period={period}
        shouldShowPeriodFields={false}
      />
    );
  }

  return (
    <Modal
      hasOverlay
      ariaLabel={ariaLabel}
      isOpen={isOpen}
      onClose={handleModalClose}
      className="admin-game-schedule-modal__modal"
    >
      {content}
    </Modal>
  );
}
