import { type z } from "zod";

import {
  type luckyMeadowRuleDtoSchema,
  type luckyMeadowRulePrizeDtoSchema,
} from "./lucky-meadow-rules-response-schema";

export type LuckyMeadowCellOutcomeDto = "empty" | "jackpot" | "semi_jackpot" | "trap";
export type LuckyMeadowPrizeDto = "jackpot" | "semi_jackpot";
export type LuckyMeadowSnapshotStatusDto = "active" | "finished" | "refund_pending" | "refunded";
export type LuckyMeadowUnavailableReasonDto = "daily_limit_reached";
export type LuckyMeadowOpenedCellDto = {
  outcome: LuckyMeadowCellOutcomeDto;
  position: number;
};
export type LuckyMeadowStateResponseDto = {
  game: {
    endDate: string;
    snapshotId: string;
    startDate: string;
    status: LuckyMeadowSnapshotStatusDto;
} | null;
  mySnapshot: {
    id: string;
    openedCells: LuckyMeadowOpenedCellDto[];
    status: LuckyMeadowSnapshotStatusDto;
} | null;
  unavailableReason?: LuckyMeadowUnavailableReasonDto;
};
export type StartLuckyMeadowSnapshotResponseDto = {
  id: string;
  resumed: boolean;
};
export type OpenLuckyMeadowCellPayload = {
  position: number;
};

export type OpenLuckyMeadowCellResponseDto = {
  jackpotCount?: number;
  outcome: LuckyMeadowCellOutcomeDto;
  position: number;
  prize?: LuckyMeadowPrizeDto;
  prizeStatus?: "jackpot_unavailable";
  semiJackpotCount?: number;
  status: "active" | "finished";

export type LuckyMeadowRulePrizeDto = z.output<typeof luckyMeadowRulePrizeDtoSchema>;
export type LuckyMeadowRuleDto = z.output<typeof luckyMeadowRuleDtoSchema>;
export type CreateLuckyMeadowRulePayload = {
  endDate: string;
  jackpotPrize: LuckyMeadowRulePrizeDto;
  semiJackpotPrize?: LuckyMeadowRulePrizeDto;
  startDate: string;
};
export type UpdateLuckyMeadowRulePayload = Partial<CreateLuckyMeadowRulePayload>;
export type UpdateLuckyMeadowRuleVariables = {
  payload: UpdateLuckyMeadowRulePayload;
  startDate: string;
};
