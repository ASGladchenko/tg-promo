import { useFormContext } from "react-hook-form";

import {
  type AdminConsolationPrizeFormState,
  adminConsolationPrizeRequiredMetadataLanguageKeys
} from "@/entities/consolation-prizes";
import { useAdminTranslateText } from "@/shared/lib/ai-translation";
import { ButtonLoading } from "@/shared/ui/button-loading";

type AdminConsolationPrizeDescriptionTranslateButtonProps = {
  disabled: boolean;
};

export function AdminConsolationPrizeDescriptionTranslateButton({
  disabled
}: AdminConsolationPrizeDescriptionTranslateButtonProps) {
  const translateText = useAdminTranslateText();
  const { clearErrors, getValues, setError, setValue } =
    useFormContext<AdminConsolationPrizeFormState>();

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
        targetLanguages: [...adminConsolationPrizeRequiredMetadataLanguageKeys],
        sourceLanguage: "en",
        context: "Consolation prize descriptions for promo-code giveaway rewards."
      });

      adminConsolationPrizeRequiredMetadataLanguageKeys.forEach((key) => {
        setValue(`metadataLanguages.${key}`, translations[key], {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
      });
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: error instanceof Error ? error.message : "Failed to translate consolation prize description"
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
