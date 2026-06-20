import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authenticateViewer } from "../api/authenticate-viewer";
import { setAuthenticatedViewerQueryData } from "./set-authenticated-viewer-query-data";

type UseAuthenticateViewerOptions = {
  enabled?: boolean;
};

const authenticateViewerQueryKey = ["authenticate-viewer"] as const;

export function useAuthenticateViewer(
  initData: string | undefined,
  { enabled = true }: UseAuthenticateViewerOptions = {}
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: authenticateViewerQueryKey,
    queryFn: async ({ signal }) => {
      if (!initData) {
        throw new Error("Telegram initData is required");
      }

      const dto = await authenticateViewer({ initData }, signal);

      return setAuthenticatedViewerQueryData(queryClient, dto);
    },
    enabled: enabled && Boolean(initData)
  });
}
