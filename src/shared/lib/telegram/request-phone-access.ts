import { requestPhoneAccess, type PhoneRequestedStatus } from "@tma.js/sdk-react";

export function isTelegramPhoneAccessAvailable(): boolean {
  try {
    return requestPhoneAccess.isAvailable();
  } catch {
    return false;
  }
}

export async function requestTelegramPhoneAccess(): Promise<PhoneRequestedStatus> {
  if (!isTelegramPhoneAccessAvailable()) {
    throw new Error("Telegram phone access request is unavailable");
  }

  return requestPhoneAccess();
}
