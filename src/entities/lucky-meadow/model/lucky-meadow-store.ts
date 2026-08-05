import { create } from "zustand";

export type LuckyMeadowCellOutcome = "empty" | "jackpot" | "lucky" | "skull";

export type LuckyMeadowOpenedCells = Partial<Record<number, LuckyMeadowCellOutcome>>;

type LuckyMeadowState = {
  finishGame: () => void;
  isGameActive: boolean;
  openCell: (cellIndex: number, outcome: LuckyMeadowCellOutcome) => boolean;
  openingCellIndex: number | null;
  openedCells: LuckyMeadowOpenedCells;
  resetGame: () => void;
  startOpeningCell: (cellIndex: number) => boolean;
  startGame: () => void;
};

export const useLuckyMeadowStore = create<LuckyMeadowState>((set, get) => ({
  isGameActive: false,
  openingCellIndex: null,
  openedCells: {},
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
