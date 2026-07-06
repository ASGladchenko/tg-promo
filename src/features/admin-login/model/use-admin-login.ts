import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setMeQueryData } from "@/entities/me";

import { loginAdmin } from "../api/login";
import { type LoginFormState } from "./admin-login-schema";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginFormState) => loginAdmin(payload),
    onSuccess: (dto) => {
      setMeQueryData(queryClient, dto);
    }
  });
}
