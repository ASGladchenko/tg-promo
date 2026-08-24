import { useMutation } from "@tanstack/react-query";

import { resolveLuckyMeadowSemiChoice } from "../api/resolve-lucky-meadow-semi-choice";
import { type LuckyMeadowSemiChoiceAction } from "./types";

type ResolveLuckyMeadowSemiChoiceVariables = {
  action: LuckyMeadowSemiChoiceAction;
  userSnapshotId: string;
};

export function useResolveLuckyMeadowSemiChoice() {
  return useMutation({
    mutationFn: ({ action, userSnapshotId }: ResolveLuckyMeadowSemiChoiceVariables) =>
      resolveLuckyMeadowSemiChoice(userSnapshotId, { action })
  });
}
