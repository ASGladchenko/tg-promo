import {
  AdminConsolationPrizeFormModalTrigger,
  type ConsolationPrize,
  getAdminConsolationPrizeFormDefaultValues,
  mapAdminConsolationPrizeFormToUpdatePayload,
  useUpdateConsolationPrize
} from "@/entities/consolation-prizes";
import { usePrizes } from "@/entities/prizes";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminConsolationPrizeUpdateTriggerProps = { consolationPrize: ConsolationPrize };

export function AdminConsolationPrizeUpdateTrigger({
  consolationPrize
}: AdminConsolationPrizeUpdateTriggerProps) {
  const updateConsolationPrize = useUpdateConsolationPrize();
  const prizesQuery = usePrizes();
  const prizeOptions = prizesQuery.data?.map(({ id, name }) => ({ id, name })) ?? [];
  const isPending = updateConsolationPrize.isPending || prizesQuery.isLoading;

  return (
    <AdminConsolationPrizeFormModalTrigger
      title="Edit Consolation Prize"
      submitLabel="Save"
      modalAriaLabel="Edit consolation prize"
      closeAriaLabel="Close edit consolation prize modal"
      failureMessage="Failed to update consolation prize"
      defaultValues={getAdminConsolationPrizeFormDefaultValues(consolationPrize)}
      isPending={isPending}
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
