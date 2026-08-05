import type { LuckyMeadowCellOutcome } from "./lucky-meadow-store";

const MOCK_OPEN_CELL_DELAY_MS = 300;

const mockCellOutcomes: LuckyMeadowCellOutcome[] = ["empty", "skull", "lucky", "jackpot"];

export function mockOpenLuckyMeadowCell(): Promise<LuckyMeadowCellOutcome> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(mockCellOutcomes[Math.floor(Math.random() * mockCellOutcomes.length)] ?? "empty");
    }, MOCK_OPEN_CELL_DELAY_MS);
  });
}
