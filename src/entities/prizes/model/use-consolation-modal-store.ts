import { create } from "zustand";

import { UserPrize } from "./types";

export const useConsolationModalStore = create<{
  isOpen: boolean;
  prize: UserPrize | null;
  open: (prize: UserPrize) => void;
  close: () => void;
}>((set) => ({
  isOpen: false,
  prize: null,
  open: (prize) => set({ isOpen: true, prize }),
  close: () => set({ isOpen: false, prize: null })
}));
