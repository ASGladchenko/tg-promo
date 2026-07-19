import {
  AdminPrizeFormModalTrigger,
  type AdminPrizeFormModalTriggerProps,
  getAdminPrizeFormDefaultValues,
  mapAdminPrizeFormToPayload,
  useCreatePrize
} from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

type AdminPrizeCreateTriggerProps = Pick<AdminPrizeFormModalTriggerProps, "descriptionLabelAction">;

export function AdminPrizeCreateTrigger({ descriptionLabelAction }: AdminPrizeCreateTriggerProps) {
  const createPrize = useCreatePrize();

  return (
    <AdminPrizeFormModalTrigger
      title="Add Prize"
      submitLabel="Create"
      modalAriaLabel="Add prize"
      isPending={createPrize.isPending}
      closeAriaLabel="Close add prize modal"
      failureMessage="Failed to create prize"
      descriptionLabelAction={descriptionLabelAction}
      defaultValues={getAdminPrizeFormDefaultValues()}
      onReset={createPrize.reset}
      onSubmit={(data) => createPrize.mutateAsync(mapAdminPrizeFormToPayload(data))}
      renderTrigger={({ openModal }) => (
        <ButtonBase type="button" aria-haspopup="dialog" onClick={openModal}>
          Add Prize
        </ButtonBase>
      )}
    />
  );
}
