import { useEffect } from "react";

import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { createRoot, type Root } from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import {
  applyAwardedUserPrizeQueryData,
  AwardedUserPrizeModal,
  clearAwardedUserPrizeQueryData,
  type UserPrize
} from "@/entities/prizes";
import { i18n } from "@/shared/lib/i18n";
import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";

type ModalRoot = {
  element: HTMLDivElement;
  root: Root;
};

let modalRoot: ModalRoot | null = null;

function createModalRoot(): ModalRoot {
  const element = document.createElement("div");
  document.body.append(element);

  return {
    element,
    root: createRoot(element)
  };
}

function closeModal(queryClient: QueryClient) {
  clearAwardedUserPrizeQueryData(queryClient);
  modalRoot?.root.unmount();
  modalRoot?.element.remove();
  modalRoot = null;
}

function openModal(queryClient: QueryClient, prize: UserPrize) {
  closeModal(queryClient);

  modalRoot = createModalRoot();
  modalRoot.root.render(
    <I18nextProvider i18n={i18n}>
      <AwardedUserPrizeModal isOpen prize={prize} onClose={() => closeModal(queryClient)} />
    </I18nextProvider>
  );
}

export function useConsolationPrizeAwardedRealtimePopup(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = realtimeClient.subscribe(CLIENT_EVENT_TYPES.consolationPrizeAwarded, (message) => {
      const prize = applyAwardedUserPrizeQueryData(queryClient, message.data);

      if (!prize) {
        console.error("Invalid consolation prize realtime message", message);
        return;
      }

      openModal(queryClient, prize);
    });

    return () => {
      unsubscribe();
      closeModal(queryClient);
    };
  }, [queryClient]);
}
