import {
  AdminLuckyMeadowRuleForm,
  getAdminLuckyMeadowRuleFormDefaultValues,
  mapAdminLuckyMeadowRuleFormToPayload,
  useCreateLuckyMeadowRule,
  type AdminLuckyMeadowRuleFormInput
} from "@/entities/lucky-meadow";
import { usePrizes } from "@/entities/prizes";

type AdminLuckyMeadowRuleCreateFormProps = {
  onClose: () => void;
  onSuccess: () => void;
  period?: {
    endDate: string;
    label: string;
    startDate: string;
  };
};

export function AdminLuckyMeadowRuleCreateForm({
  onClose,
  onSuccess,
  period
}: AdminLuckyMeadowRuleCreateFormProps) {
  const createLuckyMeadowRule = useCreateLuckyMeadowRule();
  const prizesQuery = usePrizes();
  const defaultValues: AdminLuckyMeadowRuleFormInput = getAdminLuckyMeadowRuleFormDefaultValues();

  if (period) {
    defaultValues.startDate = period.startDate;
    defaultValues.endDate = period.endDate;
  }
  const prizeOptions = prizesQuery.data ?? [];

  return (
    <AdminLuckyMeadowRuleForm
      closeAriaLabel="Close add Lucky Meadow rule modal"
      defaultValues={defaultValues}
      failureMessage="Failed to create Lucky Meadow rule"
      isPending={createLuckyMeadowRule.isPending || prizesQuery.isLoading}
      onClose={onClose}
      onReset={createLuckyMeadowRule.reset}
      onSubmit={(data) => createLuckyMeadowRule.mutateAsync(mapAdminLuckyMeadowRuleFormToPayload(data))}
      onSuccess={onSuccess}
      periodLabel={period?.label}
      prizeOptions={prizeOptions}
      submitLabel="Create"
      title="Add Rule"
    />
  );
}
