import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToUpdatePayload,
  type Rule,
  useUpdateRule
} from "@/entities/rules";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminRuleUpdateTriggerProps = {
  rule: Rule;
};

export function AdminRuleUpdateTrigger({ rule }: AdminRuleUpdateTriggerProps) {
  const updateRule = useUpdateRule();

  return (
    <AdminRuleFormModalTrigger
      title="Edit Rule"
      submitLabel="Save"
      modalAriaLabel="Edit rule"
      onReset={updateRule.reset}
      isPending={updateRule.isPending}
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
          disabled={isPending}
          isLoading={isPending}
        >
          Edit
        </ButtonLoading>
      )}
    />
  );
}
