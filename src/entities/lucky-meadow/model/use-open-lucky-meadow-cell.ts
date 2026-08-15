import { useMutation } from "@tanstack/react-query";

import { openLuckyMeadowCell } from "../api/open-lucky-meadow-cell";

type OpenLuckyMeadowCellVariables = {
  position: number;
  userSnapshotId: string;
};

export function useOpenLuckyMeadowCell() {
  return useMutation({
    mutationFn: ({ position, userSnapshotId }: OpenLuckyMeadowCellVariables) =>
      openLuckyMeadowCell(userSnapshotId, { position })
  });
}
