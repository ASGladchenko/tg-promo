import {
  AdminAiProviderFormModalTrigger,
  getAdminAiProviderFormDefaultValues,
  mapAdminAiProviderFormToCreatePayload,
  useCreateAiProvider
} from "@/entities/ai-providers";
import { ButtonBase } from "@/shared/ui/button-base";

export function AdminAiProviderCreateTrigger() {
  const createAiProvider = useCreateAiProvider();

  return (
    <AdminAiProviderFormModalTrigger
      title="Add Provider"
      submitLabel="Create"
      modalAriaLabel="Add AI provider"
      onReset={createAiProvider.reset}
      isPending={createAiProvider.isPending}
      closeAriaLabel="Close add AI provider modal"
      failureMessage="Failed to create AI provider"
      defaultValues={getAdminAiProviderFormDefaultValues()}
      onSubmit={(data) => createAiProvider.mutateAsync(mapAdminAiProviderFormToCreatePayload(data))}
      renderTrigger={({ isPending, openModal }) => (
        <ButtonBase type="button" aria-haspopup="dialog" onClick={openModal} disabled={isPending}>
          Add Provider
        </ButtonBase>
      )}
    />
  );
}
