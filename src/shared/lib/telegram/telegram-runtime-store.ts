import { create } from "zustand";

export type TelegramRuntimeStatus = "initializing" | "telegram" | "browser";

type TelegramRuntimeState = {
  initData?: string;
  status: TelegramRuntimeStatus;
  setBrowserRuntime: () => void;
  setTelegramRuntime: (initData: string) => void;
};

export const useTelegramRuntimeStore = create<TelegramRuntimeState>((set) => ({
  initData: undefined,
  status: "initializing",
  setBrowserRuntime: () => {
    set({
      initData: undefined,
      status: "browser",
    });
  },
  setTelegramRuntime: (initData) => {
    set({
      initData,
      status: "telegram",
    });
  },
}));
