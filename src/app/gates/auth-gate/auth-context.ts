import { createContext, useContext } from "react";
import { type Me } from "@/entities/me";

type AuthContextValue = {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  me?: Me;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside AuthGate");
  }

  return auth;
}
