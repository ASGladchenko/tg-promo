import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authenticateDevViewer } from "../api/authenticate-dev-viewer";
import { setAuthenticatedViewerQueryData } from "./set-authenticated-viewer-query-data";

type UseAuthenticateDevViewerOptions = {
  enabled?: boolean;
};

const authenticateDevViewerQueryKey = ["authenticate-dev-viewer"] as const;

export function useAuthenticateDevViewer({ enabled = true }: UseAuthenticateDevViewerOptions = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: authenticateDevViewerQueryKey,
    queryFn: async ({ signal }) => {
      const dto = await authenticateDevViewer(signal);

      return setAuthenticatedViewerQueryData(queryClient, dto);
    },
    enabled: enabled && import.meta.env.DEV
  });
}
