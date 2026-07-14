import {
  AdminConsolationPrizeFormModalTrigger,
  getAdminConsolationPrizeFormDefaultValues,
  mapAdminConsolationPrizeFormToCreatePayload,
  useCreateConsolationPrize
} from "@/entities/consolation-prizes";
import { usePrizes } from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminConsolationPrizeCreateTrigger() {
  const createConsolationPrize = useCreateConsolationPrize();
  const prizesQuery = usePrizes();
  const prizeOptions = prizesQuery.data?.map(({ id, name }) => ({ id, name })) ?? [];
  const isPending = createConsolationPrize.isPending || prizesQuery.isLoading;

  return (
    <AdminConsolationPrizeFormModalTrigger
      title="Add Consolation Prize"
      submitLabel="Create"
      modalAriaLabel="Add consolation prize"
      closeAriaLabel="Close add consolation prize modal"
      defaultValues={getAdminConsolationPrizeFormDefaultValues()}
      failureMessage="Failed to create consolation prize"
      isPending={isPending}
      prizeOptions={prizeOptions}
      onReset={createConsolationPrize.reset}
      onSubmit={(data) =>
        createConsolationPrize.mutateAsync(mapAdminConsolationPrizeFormToCreatePayload(data))
      }
      renderTrigger={({ openModal }) => (
        <ButtonBase
          type="button"
          aria-haspopup="dialog"
          onClick={openModal}
          disabled={isPending || prizesQuery.isError}
        >
          Add Consolation Prize
        </ButtonBase>
      )}
    />
  );
}
