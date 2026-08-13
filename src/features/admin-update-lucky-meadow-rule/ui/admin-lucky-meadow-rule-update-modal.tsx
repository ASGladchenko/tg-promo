import { type ReactNode, useState } from "react";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import {
  AdminLuckyMeadowRuleForm,
  getAdminLuckyMeadowRuleFormDefaultValues,
  mapAdminLuckyMeadowRuleFormToPayload,
  type LuckyMeadowRule,
  useUpdateLuckyMeadowRule
} from "@/entities/lucky-meadow";
import { usePrizes } from "@/entities/prizes";
import { Modal } from "@/shared/ui/modal";

import { AdminLuckyMeadowRulePeriodCalendar } from "./admin-lucky-meadow-rule-period-calendar";

import "./admin-lucky-meadow-rule-update-modal.scss";

type AdminLuckyMeadowRuleUpdateModalProps = {
  getGameName: (gameId: GameScheduleId) => string;
  isOpen: boolean;
  onClose: () => void;
  renderScheduledGameDay: (game: ScheduledGame) => ReactNode;
  rule?: LuckyMeadowRule;
  scheduledGames: readonly ScheduledGame[];
};

export function AdminLuckyMeadowRuleUpdateModal({
  getGameName,
  isOpen,
  onClose,
  renderScheduledGameDay,
  rule,
  scheduledGames
}: AdminLuckyMeadowRuleUpdateModalProps) {
  const updateLuckyMeadowRule = useUpdateLuckyMeadowRule();
  const [hasPeriodConflicts, setHasPeriodConflicts] = useState(false);
  const prizesQuery = usePrizes();

  const closeModal = () => {
    updateLuckyMeadowRule.reset();
    onClose();
  };

  if (rule === undefined) {
    return null;
  }

  return (
    <Modal
      ariaLabel="Edit Lucky Meadow rule"
      className="admin-lucky-meadow-rule-update-modal__modal"
      hasOverlay
      isOpen={isOpen}
      onClose={closeModal}
    >
      <AdminLuckyMeadowRuleForm
        closeAriaLabel="Close edit Lucky Meadow rule modal"
        defaultValues={getAdminLuckyMeadowRuleFormDefaultValues(rule)}
        failureMessage="Failed to update Lucky Meadow rule"
        isPending={updateLuckyMeadowRule.isPending || prizesQuery.isLoading}
        isSubmitDisabled={hasPeriodConflicts}
        onClose={closeModal}
        onReset={updateLuckyMeadowRule.reset}
        onSubmit={(data) => updateLuckyMeadowRule.mutateAsync(mapAdminLuckyMeadowRuleFormToPayload(data))}
        onSuccess={closeModal}
        periodContent={
          <AdminLuckyMeadowRulePeriodCalendar
            currentScheduleId={rule.scheduleId}
            disabled={updateLuckyMeadowRule.isPending}
            getGameName={getGameName}
            onPeriodConflictsChange={setHasPeriodConflicts}
            renderScheduledGameDay={renderScheduledGameDay}
            scheduledGames={scheduledGames}
          />
        }
        prizeOptions={prizesQuery.data ?? []}
        submitLabel="Save"
        title="Edit Rule"
      />
    </Modal>
  );
}
