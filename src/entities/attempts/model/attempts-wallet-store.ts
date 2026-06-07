import { create } from "zustand";

type AttemptsWalletState = {
  closeWallet: () => void;
  isWalletOpen: boolean;
  openWallet: () => void;
};

export const useAttemptsWalletStore = create<AttemptsWalletState>((set) => ({
  isWalletOpen: false,
  openWallet: () => set({ isWalletOpen: true }),
  closeWallet: () => set({ isWalletOpen: false })
}));
