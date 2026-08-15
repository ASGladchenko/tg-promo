import { create } from "zustand";

import { type LuckyMeadowCellOutcome, type LuckyMeadowOpenedCells } from "./types";

type LuckyMeadowStoreState = {
  cancelOpeningCell: (cellIndex: number) => void;
  finishGame: () => void;
  isGameActive: boolean;
  openCell: (cellIndex: number, outcome: LuckyMeadowCellOutcome) => boolean;
  openingCellIndex: number | null;
  openedCells: LuckyMeadowOpenedCells;
  resetGame: () => void;
  setGameState: (isGameActive: boolean, openedCells: LuckyMeadowOpenedCells) => void;
  startOpeningCell: (cellIndex: number) => boolean;
  startGame: () => void;
};

export const useLuckyMeadowStore = create<LuckyMeadowStoreState>((set, get) => ({
  isGameActive: false,
  openingCellIndex: null,
  openedCells: {},
  setGameState: (isGameActive, openedCells) => {
    set({
      isGameActive,
      openingCellIndex: null,
      openedCells
    });
  },
  startGame: () => {
    set({
      isGameActive: true,
      openingCellIndex: null,
      openedCells: {}
    });
  },
  finishGame: () => {
    set({
      isGameActive: false,
      openingCellIndex: null
    });
  },
  resetGame: () => {
    set({
      isGameActive: false,
      openingCellIndex: null,
      openedCells: {}
    });
  },
  startOpeningCell: (cellIndex) => {
    const state = get();

    if (!state.isGameActive || state.openingCellIndex !== null || state.openedCells[cellIndex]) {
      return false;
    }

    set({ openingCellIndex: cellIndex });

    return true;
  },
  cancelOpeningCell: (cellIndex) => {
    if (get().openingCellIndex !== cellIndex) {
      return;
    }

    set({ openingCellIndex: null });
  },
  openCell: (cellIndex, outcome) => {
    const state = get();

    if (!state.isGameActive || state.openingCellIndex !== cellIndex || state.openedCells[cellIndex]) {
      return false;
    }

    set({
      openingCellIndex: null,
      openedCells: {
        ...state.openedCells,
        [cellIndex]: outcome
      }
    });

    return true;
  }
}));
