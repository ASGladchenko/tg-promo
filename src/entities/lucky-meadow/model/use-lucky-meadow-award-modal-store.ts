import { create } from "zustand";

import { type LuckyMeadowAwardPrize } from "./types";

export const useLuckyMeadowAwardModalStore = create<{
  close: () => void;
  isOpen: boolean;
  open: (prize: LuckyMeadowAwardPrize) => void;
  prize: LuckyMeadowAwardPrize | null;
}>((set) => ({
  close: () => set({ isOpen: false, prize: null }),
  isOpen: false,
  open: (prize) => set({ isOpen: true, prize }),
  prize: null
}));
