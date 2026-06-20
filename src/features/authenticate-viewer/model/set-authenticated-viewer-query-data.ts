import { type QueryClient } from "@tanstack/react-query";

import { setAttemptsWalletQueryData } from "@/entities/attempts";
import { setMeQueryData, type Me } from "@/entities/me";

import { type AuthenticateViewerResponseDto } from "../api/authenticate-viewer";

export function setAuthenticatedViewerQueryData(
  queryClient: QueryClient,
  dto: AuthenticateViewerResponseDto
): Me {
  setAttemptsWalletQueryData(queryClient, dto.wallet);

  return setMeQueryData(queryClient, dto);
}
