import {
  AdminPrizeFormModalTrigger,
  getAdminPrizeFormDefaultValues,
  mapAdminPrizeFormToPayload,
  useCreatePrize
} from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminPrizeCreateTrigger() {
  const createPrize = useCreatePrize();

  return (
    <AdminPrizeFormModalTrigger
      title="Add Prize"
      submitLabel="Create"
      modalAriaLabel="Add prize"
      closeAriaLabel="Close add prize modal"
      defaultValues={getAdminPrizeFormDefaultValues()}
      failureMessage="Failed to create prize"
      isPending={createPrize.isPending}
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
