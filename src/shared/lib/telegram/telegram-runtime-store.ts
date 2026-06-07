import { create } from "zustand";

export type TelegramRuntimeStatus = "initializing" | "telegram" | "browser";
type TelegramRuntimeState = {
  initData?: string;
  setBrowserRuntime: () => void;
  setTelegramRuntime: (initData: string) => void;
  status: TelegramRuntimeStatus;
};

export const useTelegramRuntimeStore = create<TelegramRuntimeState>((set) => ({
  initData: undefined,
  status: "initializing",
  setBrowserRuntime: () => {
    set({
      initData: undefined,
      status: "browser"
    });
  },
  setTelegramRuntime: (initData) => {
    set({
      initData,
      status: "telegram"
    });
  }
}));
