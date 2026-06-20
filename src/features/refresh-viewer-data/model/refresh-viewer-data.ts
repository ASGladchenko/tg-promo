import { useCallback } from "react";

import { type QueryClient, useQueryClient } from "@tanstack/react-query";

import { setAttemptsWalletQueryData, type AttemptsWallet } from "@/entities/attempts";
import { setMeQueryData, type Me } from "@/entities/me";

import { getViewerData } from "../api/get-viewer-data";

export type RefreshedViewerData = {
  me: Me;
  wallet: AttemptsWallet;
};

export async function refreshViewerData(
  queryClient: QueryClient,
  signal?: AbortSignal
): Promise<RefreshedViewerData> {
  const dto = await getViewerData(signal);

  return {
    me: setMeQueryData(queryClient, dto),
    wallet: setAttemptsWalletQueryData(queryClient, dto.wallet)
  };
}

export function useRefreshViewerData() {
  const queryClient = useQueryClient();

  return useCallback((signal?: AbortSignal) => refreshViewerData(queryClient, signal), [queryClient]);
}
