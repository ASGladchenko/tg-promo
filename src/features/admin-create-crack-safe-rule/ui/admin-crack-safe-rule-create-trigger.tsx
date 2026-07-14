import {
  AdminCrackSafeRuleFormModalTrigger,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToCreatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useCreateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { usePrizes } from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminCrackSafeRuleCreateTrigger() {
  const createCrackSafeRule = useCreateCrackSafeRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminCrackSafeRulePrizesToOptions(prizesQuery.data);

  const isPending = createCrackSafeRule.isPending || prizesQuery.isLoading;

  return (
    <AdminCrackSafeRuleFormModalTrigger
      title="Add Rule"
      submitLabel="Create"
      isPending={isPending}
      modalAriaLabel="Add Crack Safe rule"
      onReset={createCrackSafeRule.reset}
      prizeOptions={prizeOptions}
      closeAriaLabel="Close add Crack Safe rule modal"
      failureMessage="Failed to create Crack Safe rule"
      defaultValues={getAdminCrackSafeRuleFormDefaultValues()}
      onSubmit={(data) => {
        const payload = mapAdminCrackSafeRuleFormToCreatePayload(data);

        return createCrackSafeRule.mutateAsync(payload);
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
