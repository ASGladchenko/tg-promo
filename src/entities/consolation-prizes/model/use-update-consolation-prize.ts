import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateConsolationPrize } from "../api/update-consolation-prize";
import { type UpdateConsolationPrizeVariables } from "../api/types";
import { consolationPrizesQueryKey } from "./consolation-prizes-query";

export function useUpdateConsolationPrize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateConsolationPrizeVariables) => updateConsolationPrize(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: consolationPrizesQueryKey })
  });
}
