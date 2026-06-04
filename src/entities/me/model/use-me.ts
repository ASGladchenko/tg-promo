import { useQuery } from "@tanstack/react-query";
import { authMe } from "../api/me-api";

type UseMeOptions = {
  enabled?: boolean;
};

export function useMe(initData?: string, options: UseMeOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["me"],
    queryFn: ({ signal }) => authMe({ initData, signal }),
    enabled,
  });
}
