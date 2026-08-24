import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startLuckyMeadowSnapshot } from "../api/start-lucky-meadow-snapshot";
import { luckyMeadowStateQueryKey } from "./lucky-meadow-query";

export function useStartLuckyMeadowSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startLuckyMeadowSnapshot(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: luckyMeadowStateQueryKey });
    }
  });
}
