import {
  AdminConsolationPrizeFormModalTrigger,
  type AdminConsolationPrizeFormModalTriggerProps,
  type ConsolationPrize,
  getAdminConsolationPrizeFormDefaultValues,
  mapAdminConsolationPrizeFormToUpdatePayload,
  useUpdateConsolationPrize
} from "@/entities/consolation-prizes";
import { usePrizes } from "@/entities/prizes";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminConsolationPrizeUpdateTriggerProps = Pick<
  AdminConsolationPrizeFormModalTriggerProps,
  "descriptionLabelAction"
> & { consolationPrize: ConsolationPrize };

export function AdminConsolationPrizeUpdateTrigger({
  descriptionLabelAction,
  consolationPrize
}: AdminConsolationPrizeUpdateTriggerProps) {
  const updateConsolationPrize = useUpdateConsolationPrize();
  const prizesQuery = usePrizes();
  const prizeOptions = prizesQuery.data?.map(({ id, name }) => ({ id, name })) ?? [];
  const isPending = updateConsolationPrize.isPending || prizesQuery.isLoading;

  return (
    <AdminConsolationPrizeFormModalTrigger
      submitLabel="Save"
      isPending={isPending}
      title="Edit Consolation Prize"
      modalAriaLabel="Edit consolation prize"
      descriptionLabelAction={descriptionLabelAction}
      closeAriaLabel="Close edit consolation prize modal"
      failureMessage="Failed to update consolation prize"
      defaultValues={getAdminConsolationPrizeFormDefaultValues(consolationPrize)}
      prizeOptions={prizeOptions}
      onReset={updateConsolationPrize.reset}
      onSubmit={(data, dirtyFields) =>
        updateConsolationPrize.mutateAsync({
          id: consolationPrize.id,
          payload: mapAdminConsolationPrizeFormToUpdatePayload(data, dirtyFields)
        })
      }
      renderTrigger={({ openModal }) => (
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
