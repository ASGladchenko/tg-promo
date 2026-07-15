import { type CrackSafeSnapshotCode } from "@/entities/crack-safe-snapshots";

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

function splitCodesByPromoCodes(codes: string[], promoCodesCount: number) {
  let offset = 0;
  const baseSize = Math.floor(codes.length / promoCodesCount);
  const extraCodesCount = codes.length % promoCodesCount;

  return Array.from({ length: promoCodesCount }, (_, index) => {
    const size = baseSize + (index < extraCodesCount ? 1 : 0);
    const chunk = codes.slice(offset, offset + size);

    offset += size;

    return chunk;
  });
}

export function getAdminCrackSafeSnapshotSemiCodes(
  codes: CrackSafeSnapshotCode[] | undefined,
  semiPromoCodes: string[]
) {
  const jackpotCodes = codes ?? [];

  if (!jackpotCodes.length || semiPromoCodes.length % jackpotCodes.length !== 0) {
    return [];
  }

  const promoCodesPerJackpot = semiPromoCodes.length / jackpotCodes.length;

  return jackpotCodes.flatMap((jackpotCode, jackpotCodeIndex) => {
    const permutations = getCodePermutations(jackpotCode.code);
    const jackpotPromoCodes = semiPromoCodes.slice(
      jackpotCodeIndex * promoCodesPerJackpot,
      (jackpotCodeIndex + 1) * promoCodesPerJackpot
    );
    const codeChunks = splitCodesByPromoCodes(permutations, jackpotPromoCodes.length);

    return jackpotPromoCodes.map((promoCode, index) => ({
      codes: codeChunks[index] ?? [],
      promoCode
    }));
  });
}
