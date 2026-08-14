import { type ReactNode } from "react";

import { GameScheduleId } from "@/entities/game-schedule";
import {
  AdminLuckyMeadowRuleForm,
  getAdminLuckyMeadowRuleFormDefaultValues,
  mapAdminLuckyMeadowRuleFormToPayload,
  type LuckyMeadowRule,
  useUpdateLuckyMeadowRule
} from "@/entities/lucky-meadow";
import { usePrizes } from "@/entities/prizes";
import { Modal } from "@/shared/ui/modal";

import { RulePeriodEditor } from "./rule-period-editor";

import "./admin-lucky-meadow-rule-update-modal.scss";

type AdminLuckyMeadowRuleUpdateModalProps = {
  getGameName: (gameId: GameScheduleId) => string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  renderScheduledGameDay: (gameId: GameScheduleId) => ReactNode;
  rule?: LuckyMeadowRule;
};

export function AdminLuckyMeadowRuleUpdateModal({
  getGameName,
  isOpen,
  onClose,
  onSuccess,
  renderScheduledGameDay,
  rule
}: AdminLuckyMeadowRuleUpdateModalProps) {
  const updateLuckyMeadowRule = useUpdateLuckyMeadowRule();
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
        onClose={closeModal}
        onReset={updateLuckyMeadowRule.reset}
        onSubmit={(data) =>
          updateLuckyMeadowRule.mutateAsync({
            payload: mapAdminLuckyMeadowRuleFormToPayload(data),
            startDate: rule.startDate
          })
        }
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
        periodContent={
          <RulePeriodEditor
            currentStartDate={rule.startDate}
            disabled={updateLuckyMeadowRule.isPending}
            getGameName={getGameName}
            renderScheduledGameDay={renderScheduledGameDay}
          />
        }
        prizeOptions={prizesQuery.data ?? []}
        submitLabel="Save"
        title="Edit Rule"
      />
    </Modal>
  );
}
