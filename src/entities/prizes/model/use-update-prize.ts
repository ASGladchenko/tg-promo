import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePrize } from "../api/update-prize";
import { type UpdatePrizeVariables } from "../api/types";
import { prizesQueryKey } from "./prizes-query";

export function useUpdatePrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePrizeVariables) => updatePrize(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: prizesQueryKey });
    }
  });
}
