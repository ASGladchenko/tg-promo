import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPrize } from "../api/create-prize";
import { type CreatePrizePayload } from "../api/types";
import { prizesQueryKey } from "./prizes-query";

export function useCreatePrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrizePayload) => createPrize(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: prizesQueryKey });
    }
  });
}
