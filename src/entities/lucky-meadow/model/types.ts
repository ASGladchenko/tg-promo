import { type LuckyMeadowRuleDto } from "../api/types";

export type LuckyMeadowCellOutcome = "empty" | "jackpot" | "lucky" | "skull";
export type LuckyMeadowOpenedCells = Partial<Record<number, LuckyMeadowCellOutcome>>;
export type LuckyMeadowSnapshotStatus = "active" | "finished" | "refundPending" | "refunded";
export type LuckyMeadowPrize = "jackpot" | "lucky";
export type LuckyMeadowUnavailableReason = "dailyLimitReached";
export type LuckyMeadowGame = {
  endDate: string;
  snapshotId: string;
  startDate: string;
  status: LuckyMeadowSnapshotStatus;
};
export type LuckyMeadowUserSnapshot = {
  id: string;
  openedCells: LuckyMeadowOpenedCells;
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
export type LuckyMeadowOpenCellResult = {
  jackpotCount?: number;
  luckyCount?: number;
  outcome: LuckyMeadowCellOutcome;
  position: number;
  prize?: LuckyMeadowPrize;
  prizeStatus?: "jackpotUnavailable";
  status: "active" | "finished";
};
export type LuckyMeadowRule = LuckyMeadowRuleDto;
