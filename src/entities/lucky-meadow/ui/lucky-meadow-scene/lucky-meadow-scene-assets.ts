import close1Image from "@/shared/images/lucky-meadow/lucky-meadow-close-1.webp";
import close2Image from "@/shared/images/lucky-meadow/lucky-meadow-close-2.webp";
import close3Image from "@/shared/images/lucky-meadow/lucky-meadow-close-3.webp";
import close4Image from "@/shared/images/lucky-meadow/lucky-meadow-close-4.webp";
import close5Image from "@/shared/images/lucky-meadow/lucky-meadow-close-5.webp";
import bgImage from "@/shared/images/lucky-meadow/lucky-meadow-bg.webp";
import openEmptyImage from "@/shared/images/lucky-meadow/lucky-meadow-open-empty.webp";
import openJackpotImage from "@/shared/images/lucky-meadow/lucky-meadow-open-jackpot.webp";
import openLuckyImage from "@/shared/images/lucky-meadow/lucky-meadow-open-lucky.webp";
import openSkullImage from "@/shared/images/lucky-meadow/lucky-meadow-open-skull.webp";

import type { LuckyMeadowCellOutcome } from "../../model/lucky-meadow-store";

export const luckyMeadowBgImage = bgImage;

export const luckyMeadowClosedCellImages = [
  close1Image,
  close2Image,
  close3Image,
  close4Image,
  close5Image
] as const;

export const luckyMeadowOpenedCellImages: Record<LuckyMeadowCellOutcome, string> = {
  empty: openEmptyImage,
  jackpot: openJackpotImage,
  lucky: openLuckyImage,
  skull: openSkullImage
};
