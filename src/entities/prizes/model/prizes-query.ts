import { type QueryClient } from "@tanstack/react-query";

import { userPrizeDtoSchema } from "../api/prizes-response-schema";
import { type MyPrizesResponseDto, type UserPrizeDto } from "../api/types";
import { mapUserPrizesDtoToUserPrizes } from "../lib/map-user-prizes-dto-to-user-prizes";
import { type UserPrize } from "./types";

export const prizesQueryKey = ["prizes"] as const;
export const myPrizesQueryKey = ["prizes", "me"] as const;
export const awardedUserPrizeQueryKey = ["prizes", "me", "awarded"] as const;

function mapUserPrizeDtoToUserPrize(dto: UserPrizeDto): UserPrize {
  return mapUserPrizesDtoToUserPrizes([dto])[0];
}

function upsertUserPrizeDto(dto: UserPrizeDto, prizes: MyPrizesResponseDto = []): MyPrizesResponseDto {
  const nextPrizes = prizes.filter((prize) => prize.id !== dto.id);

  return [dto, ...nextPrizes];
}

export function applyAwardedUserPrizeQueryData(queryClient: QueryClient, value: unknown): UserPrize | null {
  const parsedPrize = userPrizeDtoSchema.safeParse(value);

  if (!parsedPrize.success) {
    return null;
  }

  const prize = parsedPrize.data;
  const currentPrizes = queryClient.getQueryData<MyPrizesResponseDto>(myPrizesQueryKey);

  queryClient.setQueryData(myPrizesQueryKey, upsertUserPrizeDto(prize, currentPrizes));
  queryClient.setQueryData(awardedUserPrizeQueryKey, prize);

  return mapUserPrizeDtoToUserPrize(prize);
}

export function clearAwardedUserPrizeQueryData(queryClient: QueryClient): void {
  queryClient.setQueryData(awardedUserPrizeQueryKey, null);
}
