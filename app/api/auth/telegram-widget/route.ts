import { NextResponse } from "next/server";
import {
  verifyTelegramWidgetPayload,
  type TelegramWidgetPayload
} from "@/src/backend/auth/telegram-login";
import { createSessionToken, setSessionCookie } from "@/src/backend/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "Server is missing TELEGRAM_BOT_TOKEN." }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as TelegramWidgetPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const maxAgeSeconds = Number(process.env.TELEGRAM_WIDGET_MAX_AGE_SECONDS ?? "300");
  const result = verifyTelegramWidgetPayload(payload, botToken, Number.isFinite(maxAgeSeconds) ? maxAgeSeconds : 300);

  if (!result.isValid || !result.user) {
    return NextResponse.json(
      {
        error: result.reason ?? "Telegram widget auth failed."
      },
      { status: 401 }
    );
  }

  const token = createSessionToken(result.user, "widget");
  const response = NextResponse.json({
    ok: true,
    user: result.user,
    source: "widget"
  });
  setSessionCookie(response, token);
  return response;
}
