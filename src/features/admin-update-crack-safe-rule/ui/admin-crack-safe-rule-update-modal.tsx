import {
  AdminCrackSafeRuleForm,
  type CrackSafeRule,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToUpdatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useUpdateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { usePrizes } from "@/entities/prizes";
import { Modal } from "@/shared/ui/modal";

import "./admin-crack-safe-rule-update-modal.scss";

type AdminCrackSafeRuleUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  rule?: CrackSafeRule;
};

export function AdminCrackSafeRuleUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  rule
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
        prizeOptions={prizeOptions}
        submitLabel="Save"
        title="Edit Rule"
      />
    </Modal>
  );
}
