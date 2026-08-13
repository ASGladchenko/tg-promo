import { useEffect, useState } from "react";

import { GameScheduleId } from "@/entities/game-schedule";
import { AdminCrackSafeRuleCreateForm } from "@/features/admin-create-crack-safe-rule";
import { AdminLuckyMeadowRuleCreateForm } from "@/features/admin-create-lucky-meadow-rule";
import { Modal } from "@/shared/ui/modal";

import { getScheduleGameTitle } from "../../model/schedule-game-metadata";
import { type AdminSchedulePeriod, type AdminSchedulePeriodConflict } from "../../model/types";
import { ScheduleGamePicker } from "../schedule-game-picker/schedule-game-picker";
import { SchedulePeriodConflict } from "../schedule-period-conflict/schedule-period-conflict";

import "./admin-game-schedule-modal.scss";

type ScheduleModalView = "game-picker" | GameScheduleId;
type AdminGameScheduleModalProps = {
  availablePeriods?: AdminSchedulePeriod[];
  conflicts?: AdminSchedulePeriodConflict[];
  isOpen: boolean;
  onClose: () => void;
  onPeriodSelect: (period: AdminSchedulePeriod) => void;
  onRulesChange: () => void;
  period?: AdminSchedulePeriod;
};

export function AdminGameScheduleModal({
  availablePeriods = [],
  conflicts = [],
  isOpen,
  onClose,
  onPeriodSelect,
  onRulesChange,
  period
}: AdminGameScheduleModalProps) {
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

  const hasConflicts = conflicts.length > 0;
  let ariaLabel = hasConflicts ? "Schedule conflict" : "Schedule period";

  let content =
    hasConflicts && period ? (
      <SchedulePeriodConflict
        availablePeriods={availablePeriods}
        conflicts={conflicts}
        onClose={onClose}
        onPeriodSelect={onPeriodSelect}
        period={period}
      />
    ) : (
      <ScheduleGamePicker periodLabel={period?.label} onClose={onClose} onGameClick={setModalView} />
    );

  if (modalView !== "game-picker") {
    ariaLabel = `Add ${getScheduleGameTitle(modalView)} rule`;
  }

  if (modalView === GameScheduleId.CrackSafe) {
    content = (
      <AdminCrackSafeRuleCreateForm
        onClose={returnToGamePicker}
        onSuccess={() => {
          onRulesChange();
          onClose();
        }}
        period={period}
      />
    );
  }

  if (modalView === GameScheduleId.LuckyMeadow) {
    content = (
      <AdminLuckyMeadowRuleCreateForm
        onClose={returnToGamePicker}
        onSuccess={() => {
          onRulesChange();
          onClose();
        }}
        period={period}
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
