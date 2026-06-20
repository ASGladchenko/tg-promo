import { useCallback, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  isTelegramPhoneAccessAvailable,
  requestTelegramPhoneAccess,
  triggerErrorHapticFeedback,
  triggerRigidHapticFeedback
} from "@/shared/lib/telegram";

type TelegramContactRequestResult = "cancelled" | "error" | "sent" | "unsupported";

export function useRequestTelegramContact() {
  const { t } = useTranslation();
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const isRequestingRef = useRef(false);

  const requestContact = useCallback(async () => {
    if (isRequestingRef.current) {
      return undefined;
    }

    if (!isTelegramPhoneAccessAvailable()) {
      setStatusMessage(t("attempts.contact.unsupported"));
      triggerErrorHapticFeedback();
      return "unsupported" satisfies TelegramContactRequestResult;
    }

    isRequestingRef.current = true;
    setIsRequesting(true);
    setStatusMessage("");

    try {
      const status = await requestTelegramPhoneAccess();

      if (status === "sent") {
        setStatusMessage(t("attempts.contact.sent"));
        triggerRigidHapticFeedback();
        return "sent" satisfies TelegramContactRequestResult;
      } else {
        setStatusMessage(t("attempts.contact.cancelled"));
        return "cancelled" satisfies TelegramContactRequestResult;
      }
    } catch {
      setStatusMessage(t("attempts.contact.error"));
      triggerErrorHapticFeedback();
      return "error" satisfies TelegramContactRequestResult;
    } finally {
      isRequestingRef.current = false;
      setIsRequesting(false);
    }
  }, [t]);

  const clearStatusMessage = useCallback(() => {
    setStatusMessage("");
  }, []);

  return {
    clearStatusMessage,
    isRequesting,
    requestContact,
    statusMessage
  };
}
