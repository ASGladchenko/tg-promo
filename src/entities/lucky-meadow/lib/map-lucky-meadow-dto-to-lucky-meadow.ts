import {
  type LuckyMeadowCellOutcomeDto,
  type LuckyMeadowPrizeDto,
  type LuckyMeadowSnapshotStatusDto,
  type LuckyMeadowStateResponseDto,
  type LuckyMeadowUnavailableReasonDto,
  type OpenLuckyMeadowCellResponseDto
} from "../api/types";
import {
  type LuckyMeadowCellOutcome,
  type LuckyMeadowOpenCellResult,
  type LuckyMeadowOpenedCells,
  type LuckyMeadowPrize,
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

const statusMap: Record<LuckyMeadowSnapshotStatusDto, LuckyMeadowSnapshotStatus> = {
  active: "active",
  finished: "finished",
  refund_pending: "refundPending",
  refunded: "refunded"
};

const unavailableReasonMap: Record<LuckyMeadowUnavailableReasonDto, LuckyMeadowUnavailableReason> = {
  daily_limit_reached: "dailyLimitReached"
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
          status: statusMap[dto.mySnapshot.status]
        }
      : null,
    unavailableReason: dto.unavailableReason ? unavailableReasonMap[dto.unavailableReason] : undefined
  };
}

export function mapOpenLuckyMeadowCellDtoToOpenLuckyMeadowCellResult(
  dto: OpenLuckyMeadowCellResponseDto
): LuckyMeadowOpenCellResult {
  return {
    jackpotCount: dto.jackpotCount,
    luckyCount: dto.semiJackpotCount,
    outcome: outcomeMap[dto.outcome],
    position: dto.position,
    prize: dto.prize ? prizeMap[dto.prize] : undefined,
    prizeStatus: dto.prizeStatus === "jackpot_unavailable" ? "jackpotUnavailable" : undefined,
    status: dto.status
  };
}
