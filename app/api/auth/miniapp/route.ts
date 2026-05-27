import { parse, validate } from "@tma.js/init-data-node";
import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie, type SessionUser } from "@/src/backend/auth/session";

export const runtime = "nodejs";

const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";

export async function POST(request: Request) {
  const rawInitData = request.headers.get(TELEGRAM_INIT_DATA_HEADER);
  if (!rawInitData) {
    return NextResponse.json({ error: "Missing Telegram init data." }, { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "Server is missing TELEGRAM_BOT_TOKEN." }, { status: 500 });
  }

  try {
    validate(rawInitData, botToken, { expiresIn: 3600 });
  } catch {
    return NextResponse.json({ error: "Invalid Telegram init data." }, { status: 401 });
  }

  const initData = parse(rawInitData);
  if (!initData.user?.id || !initData.user.first_name) {
    return NextResponse.json({ error: "Telegram user is missing in init data." }, { status: 400 });
  }

  const user: SessionUser = {
    id: initData.user.id,
    firstName: initData.user.first_name,
    lastName: initData.user.last_name,
    username: initData.user.username,
    photoUrl: initData.user.photo_url
  };

  const token = createSessionToken(user, "miniapp");
  const response = NextResponse.json({
    ok: true,
    user,
    source: "miniapp"
  });
  setSessionCookie(response, token);
  return response;
}
