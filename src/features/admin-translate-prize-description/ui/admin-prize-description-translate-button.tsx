import { useFormContext } from "react-hook-form";

import { type AdminPrizeFormState, adminPrizeRequiredMetadataLanguageKeys } from "@/entities/prizes";
import { useAdminTranslateText } from "@/shared/lib/ai-translation";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminPrizeDescriptionTranslateButtonProps = {
  disabled: boolean;
};

export function AdminPrizeDescriptionTranslateButton({
  disabled
}: AdminPrizeDescriptionTranslateButtonProps) {
  const translateText = useAdminTranslateText();
  const { clearErrors, getValues, setError, setValue } = useFormContext<AdminPrizeFormState>();

  const handleClick = async () => {
    const description = getValues("description").trim();

    if (!description) {
      setError("description", {
        type: "manual",
        message: "Enter description before translation"
      });

      return;
    }

    clearErrors("description");

    try {
      const translations = await translateText.mutateAsync({
        text: description,
        targetLanguages: [...adminPrizeRequiredMetadataLanguageKeys],
        sourceLanguage: "en",
        context: "Promo-code prize descriptions for a giveaway."
      });

      adminPrizeRequiredMetadataLanguageKeys.forEach((key) => {
        setValue(`metadataLanguages.${key}`, translations[key], {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
      });
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : "Failed to translate prize description"
      });
    }
  };

  return (
    <ButtonLoading
      height={28}
      type="button"
      onClick={handleClick}
      isLoading={translateText.isPending}
      disabled={disabled || translateText.isPending}
    >
      Translate
    </ButtonLoading>
  );
}
