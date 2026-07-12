import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useCopy } from "@/shared/lib/browser";

type MyPrizeCopyButtonProps = {
  promoCode: string;
};

export function MyPrizeCopyButton({ promoCode }: MyPrizeCopyButtonProps) {
  const { t } = useTranslation();
  const { isCopied, onCopy } = useCopy(promoCode);

  return (
    <button
      className={clsx("my-prizes-modal__copy", {
        "my-prizes-modal__copy--copied": isCopied
      })}
      type="button"
      aria-label={t("myPrizes.copyAriaLabel", { promoCode })}
      onClick={onCopy}
    >
      {isCopied ? t("myPrizes.copied") : t("myPrizes.copy")}
    </button>
  );
}
