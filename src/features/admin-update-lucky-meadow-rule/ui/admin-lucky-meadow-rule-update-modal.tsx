import {
  AdminLuckyMeadowRuleForm,
  getAdminLuckyMeadowRuleFormDefaultValues,
  mapAdminLuckyMeadowRuleFormToPayload,
  type LuckyMeadowRule,
  useUpdateLuckyMeadowRule
} from "@/entities/lucky-meadow";
import { usePrizes } from "@/entities/prizes";
import { Modal } from "@/shared/ui/modal";

import "./admin-lucky-meadow-rule-update-modal.scss";

type AdminLuckyMeadowRuleUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rule?: LuckyMeadowRule;
};

export function AdminLuckyMeadowRuleUpdateModal({
  isOpen,
  onClose,
  rule
}: AdminLuckyMeadowRuleUpdateModalProps) {
  const updateLuckyMeadowRule = useUpdateLuckyMeadowRule();
  const prizesQuery = usePrizes();

  if (rule === undefined) {
    return null;
  }

  const closeModal = () => {
    updateLuckyMeadowRule.reset();
    onClose();
  };

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
        onSubmit={(data) => updateLuckyMeadowRule.mutateAsync(mapAdminLuckyMeadowRuleFormToPayload(data))}
        onSuccess={closeModal}
        prizeOptions={prizesQuery.data ?? []}
        submitLabel="Save"
        title="Edit Rule"
      />
    </Modal>
  );
}
