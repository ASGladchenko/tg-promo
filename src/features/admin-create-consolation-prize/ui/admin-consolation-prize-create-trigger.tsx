import {
  AdminConsolationPrizeFormModalTrigger,
  type AdminConsolationPrizeFormModalTriggerProps,
  getAdminConsolationPrizeFormDefaultValues,
  mapAdminConsolationPrizeFormToCreatePayload,
  useCreateConsolationPrize
} from "@/entities/consolation-prizes";
import { usePrizes } from "@/entities/prizes";
import { ButtonBase } from "@/shared/ui/button-base";

type AdminConsolationPrizeCreateTriggerProps = Pick<
  AdminConsolationPrizeFormModalTriggerProps,
  "descriptionLabelAction"
>;

export function AdminConsolationPrizeCreateTrigger({
  descriptionLabelAction
}: AdminConsolationPrizeCreateTriggerProps) {
  const createConsolationPrize = useCreateConsolationPrize();
  const prizesQuery = usePrizes();
  const prizeOptions = prizesQuery.data?.map(({ id, name }) => ({ id, name })) ?? [];
  const isPending = createConsolationPrize.isPending || prizesQuery.isLoading;

  return (
    <AdminConsolationPrizeFormModalTrigger
      submitLabel="Create"
      isPending={isPending}
      prizeOptions={prizeOptions}
      title="Add Consolation Prize"
      modalAriaLabel="Add consolation prize"
      onReset={createConsolationPrize.reset}
      descriptionLabelAction={descriptionLabelAction}
      closeAriaLabel="Close add consolation prize modal"
      failureMessage="Failed to create consolation prize"
      defaultValues={getAdminConsolationPrizeFormDefaultValues()}
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
