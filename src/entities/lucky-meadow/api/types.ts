import { type z } from "zod";

import {
  type luckyMeadowRuleDtoSchema,
  type luckyMeadowRulePrizeDtoSchema
} from "./lucky-meadow-rules-response-schema";

export type LuckyMeadowCellOutcomeDto = "empty" | "jackpot" | "semi_jackpot" | "trap";
export type LuckyMeadowPrizeDto = "jackpot" | "semi_jackpot";
export type LuckyMeadowPrizeStatusDto =
  | "jackpot_unavailable"
  | "semi_declined"
  | "semi_fallback_awarded"
  | "semi_unavailable";
export type LuckyMeadowActionStatusDto = "active" | "finished" | "semi_choice_required";
export type LuckyMeadowSemiChoiceActionDto = "claim" | "continue";
export type LuckyMeadowSnapshotStatusDto = "active" | "finished" | "refund_pending" | "refunded";
export type LuckyMeadowUnavailableReasonDto = "daily_limit_reached" | "jackpot_win";
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
    semiChoiceRequired: boolean;
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
  fallbackAttemptsGranted?: number;
  jackpotCount?: number;
  outcome: LuckyMeadowCellOutcomeDto;
  position: number;
  prize?: LuckyMeadowPrizeDto;
  prizeInfo?: unknown;
  prizeStatus?: LuckyMeadowPrizeStatusDto;
  semiJackpotCount?: number;
  status: LuckyMeadowActionStatusDto;
};
export type ResolveLuckyMeadowSemiChoicePayload = {
  action: LuckyMeadowSemiChoiceActionDto;
};
export type ResolveLuckyMeadowSemiChoiceResponseDto = {
  fallbackAttemptsGranted?: number;
  jackpotCount?: number;
  outcome?: LuckyMeadowCellOutcomeDto;
  position?: number;
  prize?: LuckyMeadowPrizeDto;
  prizeInfo?: unknown;
  prizeStatus?: LuckyMeadowPrizeStatusDto;
  semiJackpotCount?: number;
  status: Exclude<LuckyMeadowActionStatusDto, "semi_choice_required">;
};

export type LuckyMeadowRulePrizeDto = z.output<typeof luckyMeadowRulePrizeDtoSchema>;
export type LuckyMeadowRuleDto = z.output<typeof luckyMeadowRuleDtoSchema>;
export type CreateLuckyMeadowRulePayload = {
  endDate: string;
  jackpotPrize: LuckyMeadowRulePrizeDto;
  semiFallbackAttempts: number;
  semiJackpotPrize?: LuckyMeadowRulePrizeDto;
  startDate: string;
  trapCount?: number;
};
export type UpdateLuckyMeadowRulePayload = Partial<CreateLuckyMeadowRulePayload>;
export type UpdateLuckyMeadowRuleVariables = {
  payload: UpdateLuckyMeadowRulePayload;
  startDate: string;
};
