import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res
} from "@nestjs/common";
import { parse, validate } from "@tma.js/init-data-node";
import type { Request, Response } from "express";
import { HelloService } from "../backend/hello.service";
import {
  clearSessionCookie,
  createSessionToken,
  readSessionFromRequest,
  setSessionCookie,
  type SessionUser
} from "../backend/auth/session";
import { verifyTelegramWidgetPayload, type TelegramWidgetPayload } from "../backend/auth/telegram-login";

const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";
const SUBSCRIBED_STATUSES = new Set(["creator", "administrator", "member"]);

type TelegramChatMemberResponse = {
  ok: boolean;
  description?: string;
  result?: {
    status?: string;
  };
};

@Controller("api")
export class AppController {
  constructor(private readonly helloService: HelloService) {}

  @Get("hello")
  getHello(@Headers(TELEGRAM_INIT_DATA_HEADER) rawInitData?: string) {
    let telegramVerified = false;

    if (rawInitData) {
      try {
        telegramVerified = this.validateTelegramInitData(rawInitData);
      } catch (error) {
        if (error instanceof Error && error.message === "TELEGRAM_BOT_TOKEN is not configured") {
          throw new HttpException(
            {
              error: "Server is missing TELEGRAM_BOT_TOKEN for Telegram verification."
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }

        throw new HttpException(
          {
            error: "Invalid Telegram init data."
          },
          HttpStatus.UNAUTHORIZED
        );
      }
    }

    return {
      ...this.helloService.getHello("/api/hello"),
      telegramVerified
    };
  }

  @Post("auth/miniapp")
  miniAppLogin(
    @Headers(TELEGRAM_INIT_DATA_HEADER) rawInitData: string | undefined,
    @Res({ passthrough: true }) response: Response
  ) {
    if (!rawInitData) {
      throw new HttpException({ error: "Missing Telegram init data." }, HttpStatus.BAD_REQUEST);
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new HttpException(
        { error: "Server is missing TELEGRAM_BOT_TOKEN." },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      validate(rawInitData, botToken, { expiresIn: 3600 });
    } catch {
      throw new HttpException({ error: "Invalid Telegram init data." }, HttpStatus.UNAUTHORIZED);
    }

    const initData = parse(rawInitData);
    if (!initData.user?.id || !initData.user.first_name) {
      throw new HttpException({ error: "Telegram user is missing in init data." }, HttpStatus.BAD_REQUEST);
    }

    const user: SessionUser = {
      id: initData.user.id,
      firstName: initData.user.first_name,
      lastName: initData.user.last_name,
      username: initData.user.username,
      photoUrl: initData.user.photo_url
    };

    const token = createSessionToken(user, "miniapp");
    setSessionCookie(response, token);

    return {
      ok: true,
      user,
      source: "miniapp"
    };
  }

  @Get("auth/session")
  getSession(@Req() request: Request) {
    const session = readSessionFromRequest(request);

    if (!session) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: session.user,
      source: session.source
    };
  }

  @Delete("auth/session")
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    clearSessionCookie(response);
    return { ok: true };
  }

  @Post("auth/telegram-widget")
  telegramWidgetLogin(
    @Body() payload: TelegramWidgetPayload,
    @Res({ passthrough: true }) response: Response
  ) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new HttpException(
        { error: "Server is missing TELEGRAM_BOT_TOKEN." },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!payload || typeof payload !== "object") {
      throw new HttpException({ error: "Invalid JSON payload." }, HttpStatus.BAD_REQUEST);
    }

    const maxAgeSeconds = Number(process.env.TELEGRAM_WIDGET_MAX_AGE_SECONDS ?? "300");
    const result = verifyTelegramWidgetPayload(
      payload,
      botToken,
      Number.isFinite(maxAgeSeconds) ? maxAgeSeconds : 300
    );

    if (!result.isValid || !result.user) {
      throw new HttpException(
        {
          error: result.reason ?? "Telegram widget auth failed."
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = createSessionToken(result.user, "widget");
    setSessionCookie(response, token);

    return {
      ok: true,
      user: result.user,
      source: "widget"
    };
  }

  @Get("channel-membership")
  async channelMembership(
    @Headers(TELEGRAM_INIT_DATA_HEADER) rawInitData: string | undefined,
    @Req() request: Request
  ) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken) {
      throw new HttpException(
        { error: "Server is missing TELEGRAM_BOT_TOKEN." },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!chatId) {
      throw new HttpException(
        { error: "Server is missing TELEGRAM_CHANNEL_ID." },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    let userId: number | undefined;

    if (rawInitData) {
      try {
        validate(rawInitData, botToken, { expiresIn: 3600 });
        const initData = parse(rawInitData);
        userId = initData.user?.id;
      } catch {
        throw new HttpException({ error: "Invalid Telegram init data." }, HttpStatus.UNAUTHORIZED);
      }
    } else {
      const session = readSessionFromRequest(request);
      userId = session?.user.id;
    }

    if (!userId) {
      throw new HttpException({ error: "Missing authorized Telegram user." }, HttpStatus.UNAUTHORIZED);
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(chatId)}&user_id=${userId}`;

    let telegramResponse: globalThis.Response;
    try {
      telegramResponse = await fetch(telegramApiUrl, { cache: "no-store" });
    } catch {
      throw new HttpException({ error: "Failed to contact Telegram API." }, HttpStatus.BAD_GATEWAY);
    }

    if (!telegramResponse.ok) {
      throw new HttpException({ error: "Telegram API request failed." }, HttpStatus.BAD_GATEWAY);
    }

    const payload = (await telegramResponse.json()) as TelegramChatMemberResponse;
    if (!payload.ok) {
      throw new HttpException(
        {
          error: payload.description ?? "Telegram API returned an error."
        },
        HttpStatus.BAD_GATEWAY
      );
    }

    const status = payload.result?.status ?? "unknown";
    return {
      subscribed: SUBSCRIBED_STATUSES.has(status),
      status
    };
  }

  private validateTelegramInitData(rawInitData: string): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("TELEGRAM_BOT_TOKEN is not configured");
      }
      return false;
    }

    validate(rawInitData, botToken, {
      expiresIn: 3600
    });

    return true;
  }
}
