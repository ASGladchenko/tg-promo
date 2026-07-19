import {
  AdminPrizeFormModalTrigger,
  type AdminPrizeFormModalTriggerProps,
  getAdminPrizeFormDefaultValues,
  mapAdminPrizeFormToPayload,
  type Prize,
  useUpdatePrize
} from "@/entities/prizes";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminPrizeUpdateTriggerProps = Pick<AdminPrizeFormModalTriggerProps, "descriptionLabelAction"> & {
  prize: Prize;
};

export function AdminPrizeUpdateTrigger({ descriptionLabelAction, prize }: AdminPrizeUpdateTriggerProps) {
  const updatePrize = useUpdatePrize();

  return (
    <AdminPrizeFormModalTrigger
      title="Edit Prize"
      submitLabel="Save"
      modalAriaLabel="Edit prize"
      onReset={updatePrize.reset}
      isPending={updatePrize.isPending}
      closeAriaLabel="Close edit prize modal"
      descriptionLabelAction={descriptionLabelAction}
      failureMessage="Failed to update prize"
      defaultValues={getAdminPrizeFormDefaultValues(prize)}
      onSubmit={(data) =>
        updatePrize.mutateAsync({
          id: prize.id,
          payload: mapAdminPrizeFormToPayload(data)
        })
      }
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
