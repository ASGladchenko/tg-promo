import { usePrizes } from "@/entities/prizes";
import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToUpdatePayload,
  mapAdminRulePrizesToOptions,
  type Rule,
  useUpdateRule
} from "@/entities/rules";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminRuleUpdateTriggerProps = {
  rule: Rule;
};

export function AdminRuleUpdateTrigger({ rule }: AdminRuleUpdateTriggerProps) {
  const updateRule = useUpdateRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminRulePrizesToOptions(prizesQuery.data);
  const isPending = updateRule.isPending || prizesQuery.isLoading;

  return (
    <AdminRuleFormModalTrigger
      title="Edit Rule"
      submitLabel="Save"
      isPending={isPending}
      modalAriaLabel="Edit rule"
      onReset={updateRule.reset}
      prizeOptions={prizeOptions}
      closeAriaLabel="Close edit rule modal"
      failureMessage="Failed to update rule"
      defaultValues={getAdminRuleFormDefaultValues(rule)}
      onSubmit={(data) => {
        const payload = mapAdminRuleFormToUpdatePayload(data, rule);
        const variables = {
          date: rule.gameDate,
          payload
        };

        return updateRule.mutateAsync(variables);
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
