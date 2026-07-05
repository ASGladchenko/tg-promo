import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToCreatePayload,
  useCreateRule
} from "@/entities/rules";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminRuleCreateTrigger() {
  const createRule = useCreateRule();

  return (
    <AdminRuleFormModalTrigger
      title="Add Rule"
      submitLabel="Create"
      modalAriaLabel="Add rule"
      onReset={createRule.reset}
      isPending={createRule.isPending}
      closeAriaLabel="Close add rule modal"
      failureMessage="Failed to create rule"
      defaultValues={getAdminRuleFormDefaultValues()}
      onSubmit={(data) => {
        const payload = mapAdminRuleFormToCreatePayload(data);

        return createRule.mutateAsync(payload);
      }}
      renderTrigger={({ openModal }) => (
        <ButtonBase type="button" aria-haspopup="dialog" onClick={openModal}>
          Add Rule
        </ButtonBase>
      )}
    />
  );
}
