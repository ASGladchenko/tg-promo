import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createConsolationPrize } from "../api/create-consolation-prize";
import { type CreateConsolationPrizePayload } from "../api/types";
import { consolationPrizesQueryKey } from "./consolation-prizes-query";

export function useCreateConsolationPrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConsolationPrizePayload) => createConsolationPrize(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: consolationPrizesQueryKey })
  });
}
