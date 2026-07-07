import { usePrizes } from "@/entities/prizes";
import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToCreatePayload,
  mapAdminRulePrizesToOptions,
  useCreateRule
} from "@/entities/rules";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminRuleCreateTrigger() {
  const createRule = useCreateRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminRulePrizesToOptions(prizesQuery.data);

  const isPending = createRule.isPending || prizesQuery.isLoading;

  return (
    <AdminRuleFormModalTrigger
      title="Add Rule"
      submitLabel="Create"
      isPending={isPending}
      modalAriaLabel="Add rule"
      onReset={createRule.reset}
      prizeOptions={prizeOptions}
      closeAriaLabel="Close add rule modal"
      failureMessage="Failed to create rule"
      defaultValues={getAdminRuleFormDefaultValues()}
      onSubmit={(data) => {
        const payload = mapAdminRuleFormToCreatePayload(data);

        return createRule.mutateAsync(payload);
      }}
      renderTrigger={({ isPending: isTriggerPending, openModal }) => (
        <ButtonBase
          type="button"
          aria-haspopup="dialog"
          onClick={openModal}
          disabled={isTriggerPending || prizesQuery.isError}
        >
          Add Rule
        </ButtonBase>
      )}
    />
  );
}
