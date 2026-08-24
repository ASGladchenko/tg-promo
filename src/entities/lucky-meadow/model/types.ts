import { type LuckyMeadowRuleDto } from "../api/types";

export type LuckyMeadowCellOutcome = "empty" | "jackpot" | "lucky" | "skull";
export type LuckyMeadowOpenedCells = Partial<Record<number, LuckyMeadowCellOutcome>>;
export type LuckyMeadowSnapshotStatus = "active" | "finished" | "refundPending" | "refunded";
export type LuckyMeadowPrize = "jackpot" | "lucky";
export type LuckyMeadowPrizeStatus =
  | "jackpotUnavailable"
  | "semiDeclined"
  | "semiFallbackAwarded"
  | "semiUnavailable";
export type LuckyMeadowActionStatus = "active" | "finished" | "semiChoiceRequired";
export type LuckyMeadowSemiChoiceAction = "claim" | "continue";
export type LuckyMeadowUnavailableReason = "dailyLimitReached" | "jackpotWin";
export type LuckyMeadowAwardPrize = {
  outcome: LuckyMeadowPrize;
  prizeData: Record<string, unknown>;
  promoCode: string | null;
};
export type LuckyMeadowGame = {
  endDate: string;
  snapshotId: string;
  startDate: string;
  status: LuckyMeadowSnapshotStatus;
};
export type LuckyMeadowUserSnapshot = {
  id: string;
  openedCells: LuckyMeadowOpenedCells;
  semiChoiceRequired: boolean;
  status: LuckyMeadowSnapshotStatus;
};
export type LuckyMeadowState = {
  game: LuckyMeadowGame | null;
  mySnapshot: LuckyMeadowUserSnapshot | null;
  unavailableReason?: LuckyMeadowUnavailableReason;
};
export type LuckyMeadowStartResult = {
  id: string;
  resumed: boolean;
};
export type LuckyMeadowGameResult = {
  fallbackAttemptsGranted?: number;
  jackpotCount?: number;
  luckyCount?: number;
  outcome?: LuckyMeadowCellOutcome;
  position?: number;
  prize?: LuckyMeadowPrize;
  prizeInfo?: unknown;
  prizeStatus?: LuckyMeadowPrizeStatus;
  status: LuckyMeadowActionStatus;
};
export type LuckyMeadowOpenCellResult = LuckyMeadowGameResult & {
  outcome: LuckyMeadowCellOutcome;
  position: number;
};
export type LuckyMeadowSemiChoiceResult = LuckyMeadowGameResult;
export type LuckyMeadowRule = LuckyMeadowRuleDto;
