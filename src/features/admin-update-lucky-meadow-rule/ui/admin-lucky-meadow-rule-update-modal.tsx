import { type ReactNode, useState } from "react";

import { GameScheduleId } from "@/entities/game-schedule";
import {
  AdminLuckyMeadowRuleForm,
  getAdminLuckyMeadowRuleFormDefaultValues,
  mapAdminLuckyMeadowRuleFormToPayload,
  type LuckyMeadowRule,
  useDeleteLuckyMeadowRule,
  useUpdateLuckyMeadowRule
} from "@/entities/lucky-meadow";
import { usePrizes } from "@/entities/prizes";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminDeleteConfirmModal } from "@/shared/ui/admin-delete-confirm-modal";
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
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteLuckyMeadowRule = useDeleteLuckyMeadowRule();
  const updateLuckyMeadowRule = useUpdateLuckyMeadowRule();
  const prizesQuery = usePrizes();

  const resetState = () => {
    deleteLuckyMeadowRule.reset();
    updateLuckyMeadowRule.reset();
    setDeleteErrorMessage(undefined);
  };

  const closeModal = () => {
    if (isDeleteConfirmOpen) {
      return;
    }

    resetState();
    onClose();
  };

  if (rule === undefined) {
    return null;
  }

  const isPending =
    deleteLuckyMeadowRule.isPending || updateLuckyMeadowRule.isPending || prizesQuery.isLoading;
  const gameName = getGameName(GameScheduleId.LuckyMeadow);
  const periodLabel = `${rule.startDate} - ${rule.endDate}`;

  const openDeleteConfirm = () => {
    deleteLuckyMeadowRule.reset();
    setDeleteErrorMessage(undefined);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    if (!deleteLuckyMeadowRule.isPending) {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteErrorMessage(undefined);

    try {
      await deleteLuckyMeadowRule.mutateAsync(rule.startDate);
      setIsDeleteConfirmOpen(false);
      resetState();
      onSuccess?.();
      onClose();
    } catch (error) {
      setIsDeleteConfirmOpen(false);
      setDeleteErrorMessage(getErrorMessage(error, "Failed to delete Lucky Meadow rule"));
    }
  };

  return (
    <>
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
          deleteAction={{
            isPending: deleteLuckyMeadowRule.isPending,
            label: "Delete",
            onClick: openDeleteConfirm
          }}
          errorMessage={deleteErrorMessage}
          failureMessage="Failed to update Lucky Meadow rule"
          isPending={isPending}
          onClose={closeModal}
          onReset={resetState}
          onSubmit={(data) => {
            setDeleteErrorMessage(undefined);

            return updateLuckyMeadowRule.mutateAsync({
              payload: mapAdminLuckyMeadowRuleFormToPayload(data),
              startDate: rule.startDate
            });
          }}
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
          periodContent={
            <RulePeriodEditor
              currentStartDate={rule.startDate}
              disabled={isPending}
              getGameName={getGameName}
              renderScheduledGameDay={renderScheduledGameDay}
            />
          }
          prizeOptions={prizesQuery.data ?? []}
          submitLabel="Save"
          title="Edit Rule"
        />
      </Modal>

      <AdminDeleteConfirmModal
        description={`Delete ${gameName} rule for ${periodLabel}? This action cannot be undone.`}
        isOpen={isDeleteConfirmOpen}
        isPending={deleteLuckyMeadowRule.isPending}
        onCancel={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
