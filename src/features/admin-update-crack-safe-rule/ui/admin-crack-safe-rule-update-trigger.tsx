import {
  AdminCrackSafeRuleFormModalTrigger,
  type CrackSafeRule,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToUpdatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useUpdateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { usePrizes } from "@/entities/prizes";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminCrackSafeRuleUpdateTriggerProps = {
  rule: CrackSafeRule;
};

export function AdminCrackSafeRuleUpdateTrigger({ rule }: AdminCrackSafeRuleUpdateTriggerProps) {
  const updateCrackSafeRule = useUpdateCrackSafeRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminCrackSafeRulePrizesToOptions(prizesQuery.data);
  const isPending = updateCrackSafeRule.isPending || prizesQuery.isLoading;

  return (
    <AdminCrackSafeRuleFormModalTrigger
      title="Edit Rule"
      submitLabel="Save"
      isPending={isPending}
      modalAriaLabel="Edit Crack Safe rule"
      onReset={updateCrackSafeRule.reset}
      prizeOptions={prizeOptions}
      closeAriaLabel="Close edit Crack Safe rule modal"
      failureMessage="Failed to update Crack Safe rule"
      defaultValues={getAdminCrackSafeRuleFormDefaultValues(rule)}
      onSubmit={(data) => {
        const payload = mapAdminCrackSafeRuleFormToUpdatePayload(data, rule);
        const variables = {
          payload,
          startDate: rule.startDate
        };

        return updateCrackSafeRule.mutateAsync(variables);
      }}
      renderTrigger={({ isPending, openModal }) => (
        <ButtonLoading
          height={36}
          type="button"
          onClick={openModal}
          disabled={isPending || prizesQuery.isError}
          isLoading={isPending}
        >
          Edit
        </ButtonLoading>
      )}
    />
  );
}
