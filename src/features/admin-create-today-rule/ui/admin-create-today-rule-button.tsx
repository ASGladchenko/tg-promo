import { usePrizes } from "@/entities/prizes";
import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToCreatePayload,
  mapAdminRulePrizesToOptions,
  useCreateTodayRule
} from "@/entities/rules";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminCreateTodayRuleButton() {
  const createTodayRule = useCreateTodayRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminRulePrizesToOptions(prizesQuery.data);

  const isPending = createTodayRule.isPending || prizesQuery.isLoading;

  return (
    <AdminRuleFormModalTrigger
      submitLabel="Create"
      isPending={isPending}
      title="Add Rule for Today"
      prizeOptions={prizeOptions}
      onReset={createTodayRule.reset}
      modalAriaLabel="Add rule for today"
      failureMessage="Failed to create today's rule"
      closeAriaLabel="Close add rule for today modal"
      defaultValues={getAdminRuleFormDefaultValues()}
      onSubmit={(data) => {
        const payload = mapAdminRuleFormToCreatePayload(data);

        delete (payload as Partial<typeof payload>).gameDate;

        return createTodayRule.mutateAsync(payload);
      }}
      renderTrigger={({ isPending: isTriggerPending, openModal }) => (
        <ButtonBase
          type="button"
          variant="warning"
          onClick={openModal}
          aria-haspopup="dialog"
          disabled={isTriggerPending || prizesQuery.isError}
        >
          Add Rule for Today
        </ButtonBase>
      )}
    />
  );
}
