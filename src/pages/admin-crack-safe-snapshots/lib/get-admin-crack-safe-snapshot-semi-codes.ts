import { type CrackSafeHistoryItem } from "@/entities/crack-safe-history";
import { type CrackSafeSnapshot, type CrackSafeSnapshotCode } from "@/entities/crack-safe-snapshots";

import { isAdminCrackSafeSnapshotFinished } from "./get-admin-crack-safe-snapshot-status";

function getCodePermutations(code: string) {
  const result = new Set<string>();

  const build = (prefix: string, rest: string) => {
    if (!rest) {
      result.add(prefix);
      return;
    }

    [...rest].forEach((digit, index) => {
      build(prefix + digit, `${rest.slice(0, index)}${rest.slice(index + 1)}`);
    });
  };

  build("", code);
  result.delete(code);

  return [...result];
}

function isString(value: string | undefined): value is string {
  return typeof value === "string";
}

function splitCodesByGroups(codes: string[], groupsCount: number) {
  if (!groupsCount) {
    return [];
  }

  let offset = 0;
  const baseSize = Math.floor(codes.length / groupsCount);
  const extraCodesCount = codes.length % groupsCount;

  return Array.from({ length: groupsCount }, (_, index) => {
    const size = baseSize + (index < extraCodesCount ? 1 : 0);
    const chunk = codes.slice(offset, offset + size);

    offset += size;

    return chunk;
  });
}

export function getAdminCrackSafeSnapshotSemiCodes(
  snapshot: CrackSafeSnapshot,
  codes: CrackSafeSnapshotCode[] | undefined,
  history: CrackSafeHistoryItem[] | undefined
) {
  const jackpotCodes = codes ?? [];
  const jackpotCodesBySequence = new Map(jackpotCodes.map((code) => [code.sequence, code]));
  const jackpotPromoCodes = snapshot.jackpotPrize?.promoCodes ?? [];
  const semiPromoCodes = snapshot.semiJackpotPrize?.promoCodes ?? [];
  const isFinished = isAdminCrackSafeSnapshotFinished(snapshot.status);
  const semiWins = (history ?? []).filter(
    (item) => item.gameDate === snapshot.gameDate && item.outcome === "semi_jackpot"
  );
  const groupsCount = Math.max(jackpotCodes.length, jackpotPromoCodes.length);
  const semiPromoCodeGroups = splitCodesByGroups(semiPromoCodes, groupsCount);

  return Array.from({ length: groupsCount }, (_, index) => {
    const sequence = index + 1;
    const jackpotCode = jackpotCodesBySequence.get(sequence);
    const semiWinningCodes = jackpotCode ? getCodePermutations(jackpotCode.code) : [];
    const semiWinningCodeSet = new Set(semiWinningCodes);
    const issuedSemiWins = semiWins.filter((item) => semiWinningCodeSet.has(item.enteredCode));
    const groupSemiPromoCodes = semiPromoCodeGroups[index] ?? [];
    const issuedPromoCodes = issuedSemiWins.map((item) => item.prize?.prizeData.promoCode).filter(isString);
    const expiredSemiPromoCodeSet = new Set(jackpotCode?.expiredSemiJackpotCodes ?? []);

    if (isFinished) {
      groupSemiPromoCodes.forEach((promoCode) => {
        if (!issuedPromoCodes.includes(promoCode)) {
          expiredSemiPromoCodeSet.add(promoCode);
        }
      });
    }

    return {
      expiredSemiPromoCodes: [...expiredSemiPromoCodeSet],
      id: jackpotCode?.id ?? `pending-jackpot-${sequence}`,
      issuedSemiCount: issuedSemiWins.length,
      jackpotCode,
      jackpotPromoCode: jackpotPromoCodes[index] ?? null,
      sequence,
      semiPromoCodes: groupSemiPromoCodes,
      semiCodes: semiWinningCodes.map((code) => {
        const issued = issuedSemiWins.filter((item) => item.enteredCode === code);

        return {
          code,
          issuedPromoCodes: issued.map((item) => item.prize?.prizeData.promoCode).filter(isString),
          winsCount: issued.length
        };
      })
    };
  });
}

export function getAdminCrackSafeSnapshotUnmatchedSemiWins(
  snapshot: CrackSafeSnapshot,
  groups: ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>,
  history: CrackSafeHistoryItem[] | undefined
) {
  const knownSemiCodes = new Set(groups.flatMap((group) => group.semiCodes.map((semiCode) => semiCode.code)));

  return (history ?? []).filter(
    (item) =>
      item.gameDate === snapshot.gameDate &&
      item.outcome === "semi_jackpot" &&
      !knownSemiCodes.has(item.enteredCode)
  );
}

export type AdminCrackSafeSnapshotSemiCodeGroup = ReturnType<
  typeof getAdminCrackSafeSnapshotSemiCodes
>[number];

export type AdminCrackSafeSnapshotSemiWinningCode = AdminCrackSafeSnapshotSemiCodeGroup["semiCodes"][number];
