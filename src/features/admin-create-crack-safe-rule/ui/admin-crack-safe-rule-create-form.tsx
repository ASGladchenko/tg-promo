import {
  AdminCrackSafeRuleForm,
  getAdminCrackSafeRuleFormDefaultValues,
  mapAdminCrackSafeRuleFormToCreatePayload,
  mapAdminCrackSafeRulePrizesToOptions,
  useCreateCrackSafeRule
} from "@/entities/crack-safe-rules";
import { usePrizes } from "@/entities/prizes";

type AdminCrackSafeRuleCreateFormProps = {
  onClose: () => void;
  onSuccess: () => void;
  period?: {
    endDate: string;
    label: string;
    startDate: string;
  };
  shouldShowPeriodFields?: boolean;
};

export function AdminCrackSafeRuleCreateForm({
  onClose,
  onSuccess,
  period,
  shouldShowPeriodFields = true
}: AdminCrackSafeRuleCreateFormProps) {
  const createCrackSafeRule = useCreateCrackSafeRule();
  const prizesQuery = usePrizes();

  const prizeOptions = mapAdminCrackSafeRulePrizesToOptions(prizesQuery.data);
  const defaultValues = getAdminCrackSafeRuleFormDefaultValues();

  if (period) {
    defaultValues.startDate = period.startDate;
    defaultValues.endDate = period.endDate;
  }

  return (
    <AdminCrackSafeRuleForm
      closeAriaLabel="Close add Crack Safe rule modal"
      defaultValues={defaultValues}
      failureMessage="Failed to create Crack Safe rule"
      isPending={createCrackSafeRule.isPending || prizesQuery.isLoading}
      onClose={onClose}
      onReset={createCrackSafeRule.reset}
      onSubmit={(data) => createCrackSafeRule.mutateAsync(mapAdminCrackSafeRuleFormToCreatePayload(data))}
      onSuccess={onSuccess}
      periodLabel={period?.label}
      prizeOptions={prizeOptions}
      shouldShowPeriodFields={shouldShowPeriodFields}
      submitLabel="Create"
      title="Add Rule"
    />
  );
}
