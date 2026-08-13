import { type ReactNode } from "react";

import {
  AdminCrackSafeRuleForm,
  type CrackSafeRule,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToUpdatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useUpdateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { usePrizes } from "@/entities/prizes";
import { Modal } from "@/shared/ui/modal";

import { RulePeriodEditor } from "./rule-period-editor";
import "./admin-crack-safe-rule-update-modal.scss";

type AdminCrackSafeRuleUpdateModalProps = {
  getGameName: (gameId: GameScheduleId) => string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  rule?: CrackSafeRule;
  scheduledGames: readonly ScheduledGame[];
};

export function AdminCrackSafeRuleUpdateModal({
  getGameName,
  isOpen,
  onClose,
  onSuccess,
  renderScheduledGameDay,
  rule,
  scheduledGames
}: AdminCrackSafeRuleUpdateModalProps) {
  const updateCrackSafeRule = useUpdateCrackSafeRule();
  const prizesQuery = usePrizes();

  if (rule === undefined) {
    return null;
  }

  const prizeOptions = mapAdminCrackSafeRulePrizesToOptions(prizesQuery.data);
  const isPending = updateCrackSafeRule.isPending || prizesQuery.isLoading;

  const closeModal = () => {
    updateCrackSafeRule.reset();
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      ariaLabel="Edit Crack Safe rule"
      className="admin-crack-safe-rule-update-modal__modal"
      hasOverlay
      isOpen={isOpen}
      onClose={closeModal}
    >
      <AdminCrackSafeRuleForm
        closeAriaLabel="Close edit Crack Safe rule modal"
        defaultValues={getAdminCrackSafeRuleFormDefaultValues(rule)}
        failureMessage="Failed to update Crack Safe rule"
        isPending={isPending}
        onClose={closeModal}
        onReset={updateCrackSafeRule.reset}
        onSubmit={(data) => {
          const payload = mapAdminCrackSafeRuleFormToUpdatePayload(data, rule);

          return updateCrackSafeRule.mutateAsync({ payload, startDate: rule.startDate });
        }}
        onSuccess={handleSuccess}
        periodContent={
          <RulePeriodEditor
            currentScheduleId={rule.scheduleId}
            disabled={isPending}
            getGameName={getGameName}
            renderScheduledGameDay={renderScheduledGameDay}
            scheduledGames={scheduledGames}
          />
        }
        prizeOptions={prizeOptions}
        shouldShowPeriodFields={false}
        submitLabel="Save"
        title="Edit Rule"
      />
    </Modal>
  );
}
