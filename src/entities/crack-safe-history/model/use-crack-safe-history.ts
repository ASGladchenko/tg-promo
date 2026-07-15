import { useQuery } from "@tanstack/react-query";

import { getCrackSafeHistoryDto } from "../api/get-crack-safe-history";
import { crackSafeHistoryQueryKey } from "./crack-safe-history-query";

export function useCrackSafeHistory() {
  return useQuery({
    queryKey: crackSafeHistoryQueryKey,
    queryFn: ({ signal }) => getCrackSafeHistoryDto(signal)
  });
}
