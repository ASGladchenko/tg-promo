import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { removeMeQueryData } from "@/entities/me";
import { APP_ROUTES } from "@/shared/config";

import { logoutAdmin } from "../api/logout";

export function useAdminLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutAdmin(),
    onSuccess: () => {
      removeMeQueryData(queryClient);
      void navigate(APP_ROUTES.adminLogin, { replace: true });
    }
  });
}
