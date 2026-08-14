import { type ReactNode, useState } from "react";

import {
  AdminCrackSafeRuleForm,
  type CrackSafeRule,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToUpdatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useDeleteCrackSafeRule,
  useUpdateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { GameScheduleId } from "@/entities/game-schedule";
import { usePrizes } from "@/entities/prizes";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminDeleteConfirmModal } from "@/shared/ui/admin-delete-confirm-modal";
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
};

export function AdminCrackSafeRuleUpdateModal({
  getGameName,
  isOpen,
  onClose,
  onSuccess,
  renderScheduledGameDay,
  rule
}: AdminCrackSafeRuleUpdateModalProps) {
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteCrackSafeRule = useDeleteCrackSafeRule();
  const updateCrackSafeRule = useUpdateCrackSafeRule();
  const prizesQuery = usePrizes();

  if (rule === undefined) {
    return null;
  }

  const prizeOptions = mapAdminCrackSafeRulePrizesToOptions(prizesQuery.data);
  const isPending = deleteCrackSafeRule.isPending || updateCrackSafeRule.isPending || prizesQuery.isLoading;
  const gameName = getGameName(GameScheduleId.CrackSafe);
  const periodLabel = `${rule.startDate} - ${rule.endDate}`;

  const resetState = () => {
    deleteCrackSafeRule.reset();
    updateCrackSafeRule.reset();
    setDeleteErrorMessage(undefined);
  };

  const closeModal = () => {
    if (isDeleteConfirmOpen) {
      return;
    }

    resetState();
    onClose();
  };

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const openDeleteConfirm = () => {
    deleteCrackSafeRule.reset();
    setDeleteErrorMessage(undefined);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    if (!deleteCrackSafeRule.isPending) {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteErrorMessage(undefined);

    try {
      await deleteCrackSafeRule.mutateAsync(rule.startDate);
      setIsDeleteConfirmOpen(false);
      resetState();
      handleSuccess();
    } catch (error) {
      setIsDeleteConfirmOpen(false);
      setDeleteErrorMessage(getErrorMessage(error, "Failed to delete Crack Safe rule"));
    }
  };

  return (
    <>
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
          deleteAction={{
            isPending: deleteCrackSafeRule.isPending,
            label: "Delete",
            onClick: openDeleteConfirm
          }}
          errorMessage={deleteErrorMessage}
          failureMessage="Failed to update Crack Safe rule"
          isPending={isPending}
          onClose={closeModal}
          onReset={resetState}
          onSubmit={(data) => {
            const payload = mapAdminCrackSafeRuleFormToUpdatePayload(data, rule);
            setDeleteErrorMessage(undefined);

            return updateCrackSafeRule.mutateAsync({ payload, startDate: rule.startDate });
          }}
          onSuccess={handleSuccess}
          periodContent={
            <RulePeriodEditor
              currentStartDate={rule.startDate}
              disabled={isPending}
              getGameName={getGameName}
              renderScheduledGameDay={renderScheduledGameDay}
            />
          }
          prizeOptions={prizeOptions}
          submitLabel="Save"
          title="Edit Rule"
        />
      </Modal>

      <AdminDeleteConfirmModal
        description={`Delete ${gameName} rule for ${periodLabel}? This action cannot be undone.`}
        isOpen={isDeleteConfirmOpen}
        isPending={deleteCrackSafeRule.isPending}
        onCancel={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
