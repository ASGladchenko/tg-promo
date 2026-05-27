import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type TelegramWidgetPayload = {
  id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
};

export type NormalizedTelegramUser = {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
};

function safeEqualHex(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, "hex");
  const bBuffer = Buffer.from(b, "hex");
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

export function verifyTelegramWidgetPayload(
  payload: TelegramWidgetPayload,
  botToken: string,
  maxAgeSeconds: number = 300
): { isValid: boolean; user?: NormalizedTelegramUser; reason?: string } {
  const authDate = Number(payload.auth_date);
  const userId = Number(payload.id);

  if (!Number.isFinite(authDate) || !Number.isFinite(userId) || !payload.first_name || !payload.hash) {
    return { isValid: false, reason: "Invalid widget payload format." };
  }

  const now = Math.floor(Date.now() / 1000);
  if (authDate > now + 60) {
    return { isValid: false, reason: "Auth date is in the future." };
  }
  if (now - authDate > maxAgeSeconds) {
    return { isValid: false, reason: "Widget auth data is expired." };
  }

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "hash" || value === undefined || value === null || value === "") {
      continue;
    }
    fields[key] = String(value);
  }

  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");

  const secret = createHash("sha256").update(botToken).digest();
  const expectedHash = createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (!safeEqualHex(payload.hash, expectedHash)) {
    return { isValid: false, reason: "Widget hash mismatch." };
  }

  return {
    isValid: true,
    user: {
      id: userId,
      firstName: payload.first_name,
      lastName: payload.last_name,
      username: payload.username,
      photoUrl: payload.photo_url
    }
  };
}
