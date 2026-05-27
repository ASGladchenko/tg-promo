import { parse, validate } from "@tma.js/init-data-node";
import { NextResponse } from "next/server";
import { readSessionFromRequest } from "@/src/backend/auth/session";

export const runtime = "nodejs";

const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";
const SUBSCRIBED_STATUSES = new Set(["creator", "administrator", "member"]);

type TelegramChatMemberResponse = {
  ok: boolean;
  description?: string;
  result?: {
    status?: string;
  };
};

export async function GET(request: Request) {
  const rawInitData = request.headers.get(TELEGRAM_INIT_DATA_HEADER);

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken) {
    return NextResponse.json({ error: "Server is missing TELEGRAM_BOT_TOKEN." }, { status: 500 });
  }
  if (!chatId) {
    return NextResponse.json({ error: "Server is missing TELEGRAM_CHANNEL_ID." }, { status: 500 });
  }

  let userId: number | undefined;

  if (rawInitData) {
    try {
      validate(rawInitData, botToken, { expiresIn: 3600 });
      const initData = parse(rawInitData);
      userId = initData.user?.id;
    } catch {
      return NextResponse.json({ error: "Invalid Telegram init data." }, { status: 401 });
    }
  } else {
    const session = readSessionFromRequest(request);
    userId = session?.user.id;
  }

  if (!userId) {
    return NextResponse.json({ error: "Missing authorized Telegram user." }, { status: 401 });
  }

  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${userId}`;

  try {
    const telegramResponse = await fetch(telegramApiUrl, { cache: "no-store" });
    if (!telegramResponse.ok) {
      return NextResponse.json({ error: "Telegram API request failed." }, { status: 502 });
    }

    const payload = (await telegramResponse.json()) as TelegramChatMemberResponse;
    if (!payload.ok) {
      return NextResponse.json(
        {
          error: payload.description ?? "Telegram API returned an error."
        },
        { status: 502 }
      );
    }

    const status = payload.result?.status ?? "unknown";
    return NextResponse.json({
      subscribed: SUBSCRIBED_STATUSES.has(status),
      status
    });
  } catch {
    return NextResponse.json({ error: "Failed to contact Telegram API." }, { status: 502 });
  }
}
