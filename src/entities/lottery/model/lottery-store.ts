import { create } from "zustand";

type SetCodeDigitOptions = {
  hideSelectedDigitsFromOtherColumns?: boolean;
};
type LotteryState = {
  activeCodeIndex: number | null;
  closeCodePicker: () => void;
  codeDigits: string[];
  hasSubmitAttempt: boolean;
  isCodeLocked: boolean;
  isCodePickerOpen: boolean;
  lockCode: () => boolean;
  openCodePicker: (index?: number) => boolean;
  resetCode: () => void;
  setCodeDigit: (index: number, digit: string, options?: SetCodeDigitOptions) => boolean;
  spinWheel: () => void;
  submitCode: () => boolean;
  wheelRotation: number;
};

const CODE_LENGTH = 3;

const FULL_TURN_DEGREES = 360;

const MIN_STEP_PERCENT = 0.06;

const MAX_STEP_PERCENT = 0.2;

function createEmptyCodeDigits() {
  return Array.from({ length: CODE_LENGTH }, () => "");
}

function randomWheelDelta() {
  const stepPercent = MIN_STEP_PERCENT + Math.random() * (MAX_STEP_PERCENT - MIN_STEP_PERCENT);
  const direction = Math.random() < 0.5 ? -1 : 1;
  return FULL_TURN_DEGREES * stepPercent * direction;
}

export const useLotteryStore = create<LotteryState>((set, get) => ({
  codeDigits: createEmptyCodeDigits(),
  activeCodeIndex: null,
  isCodePickerOpen: false,
  hasSubmitAttempt: false,
  isCodeLocked: false,
  wheelRotation: 0,
  openCodePicker: (index = 0) => {
    if (get().isCodeLocked) {
      return false;
    }

    set({
      activeCodeIndex: Math.min(Math.max(index, 0), CODE_LENGTH - 1),
      isCodePickerOpen: true
    });

    return true;
  },
  closeCodePicker: () => {
    set({
      activeCodeIndex: null,
      isCodePickerOpen: false
    });
  },
  setCodeDigit: (index, digit, options = {}) => {
    const state = get();

    if (state.isCodeLocked || state.codeDigits[index] === digit) {
      return false;
    }

    const hasDigitInOtherColumn = state.codeDigits.some(
      (currentDigit, currentIndex) => currentIndex !== index && currentDigit === digit
    );

    if (options.hideSelectedDigitsFromOtherColumns && digit && hasDigitInOtherColumn) {
      return false;
    }

    const nextCodeDigits = [...state.codeDigits];
    nextCodeDigits[index] = digit;

    set({
      activeCodeIndex: index,
      codeDigits: nextCodeDigits,
      hasSubmitAttempt: false,
      wheelRotation: state.wheelRotation + randomWheelDelta()
    });

    return true;
  },
  submitCode: () => {
    const state = get();

    if (state.codeDigits.some((digit) => !digit)) {
      set({ hasSubmitAttempt: true });
      return false;
    }

    set({
      activeCodeIndex: null,
      isCodePickerOpen: false
    });

    return true;
  },
  lockCode: () => {
    const state = get();

    if (state.isCodeLocked) {
      return false;
    }

    if (state.codeDigits.some((digit) => !digit)) {
      set({ hasSubmitAttempt: true });
      return false;
    }

    set({
      activeCodeIndex: null,
      isCodeLocked: true,
      isCodePickerOpen: false
    });

    return true;
  },
  resetCode: () => {
    set({
      activeCodeIndex: null,
      codeDigits: createEmptyCodeDigits(),
      hasSubmitAttempt: false,
      isCodeLocked: false,
      isCodePickerOpen: false,
      wheelRotation: 0
    });
  },
  spinWheel: () => {
    set((state) => ({
      wheelRotation: state.wheelRotation + randomWheelDelta()
    }));
  }
}));
