import { type z } from "zod";

import {
  crackSafeSnapshotCodeDtoSchema,
  crackSafeSnapshotCodesResponseDtoSchema
} from "./crack-safe-snapshot-codes-response-schema";
import {
  crackSafeSnapshotDtoSchema,
  crackSafeSnapshotPrizeDtoSchema,
  crackSafeSnapshotsResponseDtoSchema
} from "./crack-safe-snapshots-response-schema";

export type CrackSafeSnapshotCodeDto = z.output<typeof crackSafeSnapshotCodeDtoSchema>;
export type CrackSafeSnapshotCodesResponseDto = z.output<typeof crackSafeSnapshotCodesResponseDtoSchema>;
export type CrackSafeSnapshotPrizeDto = z.output<typeof crackSafeSnapshotPrizeDtoSchema>;
export type CrackSafeSnapshotDto = z.output<typeof crackSafeSnapshotDtoSchema>;
export type CrackSafeSnapshotsResponseDto = z.output<typeof crackSafeSnapshotsResponseDtoSchema>;
