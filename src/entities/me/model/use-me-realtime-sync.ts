import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { CLIENT_EVENT_TYPES, realtimeClient } from "@/shared/lib/realtime";
import { notify } from "@/shared/lib/toast";

import { type MeQueryPatch, patchMeQueryData } from "./me-query";

const nullableStringFields = ["email", "imgUrl", "login", "name", "phone", "provider", "surname"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMeRealtimePatch(value: unknown): MeQueryPatch | null {
  if (!isRecord(value)) {
    return null;
  }

  const patch: MeQueryPatch = {};

  if ("isChannelSubscribed" in value) {
    if (typeof value.isChannelSubscribed !== "boolean" && value.isChannelSubscribed !== null) {
      return null;
    }

    patch.isChannelSubscribed = value.isChannelSubscribed;
  }

  for (const field of nullableStringFields) {
    if (!(field in value)) {
      continue;
    }

    const fieldValue = value[field];

    if (typeof fieldValue !== "string" && fieldValue !== null) {
      return null;
    }

    patch[field] = fieldValue;
  }

  if ("roles" in value) {
    if (!Array.isArray(value.roles) || !value.roles.every((role) => typeof role === "string")) {
      return null;
    }

    patch.roles = [...value.roles];
  }

  return Object.keys(patch).length > 0 ? patch : null;
}

function getNotificationMessage(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const message = value.trim();

  return message || null;
}

export function useMeRealtimeSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    return realtimeClient.subscribe(CLIENT_EVENT_TYPES.userUpdated, (message) => {
      const patch = parseMeRealtimePatch(message.data);

      if (!patch) {
        console.error("Invalid user realtime message", message);
        return;
      }

      const me = patchMeQueryData(queryClient, patch);

      if (!me) {
        console.log("Skipped user realtime message because me cache is empty", message);
        return;
      }

      const notificationMessage = getNotificationMessage(message.message);

      if (notificationMessage) {
        notify.success(notificationMessage);
      }
    });
  }, [queryClient]);
}
