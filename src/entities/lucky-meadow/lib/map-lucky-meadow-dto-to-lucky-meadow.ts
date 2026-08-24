import {
  type LuckyMeadowCellOutcomeDto,
  type LuckyMeadowActionStatusDto,
  type LuckyMeadowPrizeDto,
  type LuckyMeadowPrizeStatusDto,
  type LuckyMeadowSnapshotStatusDto,
  type LuckyMeadowStateResponseDto,
  type LuckyMeadowUnavailableReasonDto,
  type OpenLuckyMeadowCellResponseDto,
  type ResolveLuckyMeadowSemiChoiceResponseDto
} from "../api/types";
import {
  type LuckyMeadowCellOutcome,
  type LuckyMeadowActionStatus,
  type LuckyMeadowGameResult,
  type LuckyMeadowOpenCellResult,
  type LuckyMeadowOpenedCells,
  type LuckyMeadowPrize,
  type LuckyMeadowPrizeStatus,
  type LuckyMeadowSemiChoiceResult,
  type LuckyMeadowSnapshotStatus,
  type LuckyMeadowState,
  type LuckyMeadowUnavailableReason
} from "../model/types";

const outcomeMap: Record<LuckyMeadowCellOutcomeDto, LuckyMeadowCellOutcome> = {
  empty: "empty",
  jackpot: "jackpot",
  semi_jackpot: "lucky",
  trap: "skull"
};

const prizeMap: Record<LuckyMeadowPrizeDto, LuckyMeadowPrize> = {
  jackpot: "jackpot",
  semi_jackpot: "lucky"
};

const prizeStatusMap: Record<LuckyMeadowPrizeStatusDto, LuckyMeadowPrizeStatus> = {
  jackpot_unavailable: "jackpotUnavailable",
  semi_declined: "semiDeclined",
  semi_fallback_awarded: "semiFallbackAwarded",
  semi_unavailable: "semiUnavailable"
};

const actionStatusMap: Record<LuckyMeadowActionStatusDto, LuckyMeadowActionStatus> = {
  active: "active",
  finished: "finished",
  semi_choice_required: "semiChoiceRequired"
};

const statusMap: Record<LuckyMeadowSnapshotStatusDto, LuckyMeadowSnapshotStatus> = {
  active: "active",
  finished: "finished",
  refund_pending: "refundPending",
  refunded: "refunded"
};

const unavailableReasonMap: Record<LuckyMeadowUnavailableReasonDto, LuckyMeadowUnavailableReason> = {
  daily_limit_reached: "dailyLimitReached",
  jackpot_win: "jackpotWin"
};

function mapOpenedCells(dto: LuckyMeadowStateResponseDto["mySnapshot"]): LuckyMeadowOpenedCells {
  if (!dto) {
    return {};
  }

  return dto.openedCells.reduce<LuckyMeadowOpenedCells>((openedCells, cell) => {
    openedCells[cell.position] = outcomeMap[cell.outcome];
    return openedCells;
  }, {});
}

export function mapLuckyMeadowStateDtoToLuckyMeadowState(dto: LuckyMeadowStateResponseDto): LuckyMeadowState {
  return {
    game: dto.game
      ? {
          endDate: dto.game.endDate,
          snapshotId: dto.game.snapshotId,
          startDate: dto.game.startDate,
          status: statusMap[dto.game.status]
        }
      : null,
    mySnapshot: dto.mySnapshot
      ? {
          id: dto.mySnapshot.id,
          openedCells: mapOpenedCells(dto.mySnapshot),
          semiChoiceRequired: dto.mySnapshot.semiChoiceRequired,
          status: statusMap[dto.mySnapshot.status]
        }
      : null,
    unavailableReason: dto.unavailableReason ? unavailableReasonMap[dto.unavailableReason] : undefined
  };
}

function mapLuckyMeadowGameResultDto(
  dto: OpenLuckyMeadowCellResponseDto | ResolveLuckyMeadowSemiChoiceResponseDto
): LuckyMeadowGameResult {
  return {
    fallbackAttemptsGranted: dto.fallbackAttemptsGranted,
    jackpotCount: dto.jackpotCount,
    luckyCount: dto.semiJackpotCount,
    outcome: dto.outcome ? outcomeMap[dto.outcome] : undefined,
    position: dto.position,
    prize: dto.prize ? prizeMap[dto.prize] : undefined,
    prizeInfo: dto.prizeInfo,
    prizeStatus: dto.prizeStatus ? prizeStatusMap[dto.prizeStatus] : undefined,
    status: actionStatusMap[dto.status]
  };
}

export function mapOpenLuckyMeadowCellDtoToOpenLuckyMeadowCellResult(
  dto: OpenLuckyMeadowCellResponseDto
): LuckyMeadowOpenCellResult {
  return {
    ...mapLuckyMeadowGameResultDto(dto),
    outcome: outcomeMap[dto.outcome],
    position: dto.position,
  };
}

export function mapResolveLuckyMeadowSemiChoiceDtoToLuckyMeadowSemiChoiceResult(
  dto: ResolveLuckyMeadowSemiChoiceResponseDto
): LuckyMeadowSemiChoiceResult {
  return mapLuckyMeadowGameResultDto(dto);
}
