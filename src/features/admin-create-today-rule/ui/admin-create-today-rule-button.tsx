import {
  AdminRuleFormModalTrigger,
  getAdminRuleFormDefaultValues,
  mapAdminRuleFormToCreatePayload,
  useCreateTodayRule
} from "@/entities/rules";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminCreateTodayRuleButton() {
  const createTodayRule = useCreateTodayRule();

  return (
    <AdminRuleFormModalTrigger
      submitLabel="Create"
      title="Add Rule for Today"
      onReset={createTodayRule.reset}
      modalAriaLabel="Add rule for today"
      isPending={createTodayRule.isPending}
      failureMessage="Failed to create today's rule"
      closeAriaLabel="Close add rule for today modal"
      defaultValues={getAdminRuleFormDefaultValues()}
      onSubmit={(data) => {
        const payload = mapAdminRuleFormToCreatePayload(data);

        delete (payload as Partial<typeof payload>).gameDate;

        console.log("createTodayRule payload:", payload);

        return createTodayRule.mutateAsync(payload);
      }}
      renderTrigger={({ openModal }) => (
        <ButtonBase type="button" variant="warning" aria-haspopup="dialog" onClick={openModal}>
          Add Rule for Today
        </ButtonBase>
      )}
    />
  );
}
