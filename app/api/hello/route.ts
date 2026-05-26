import "reflect-metadata";
import { validate } from "@tma.js/init-data-node";
import { NestFactory } from "@nestjs/core";
import { NextResponse } from "next/server";
import { AppModule } from "@/src/backend/app.module";
import { HelloService } from "@/src/backend/hello.service";

export const runtime = "nodejs";

const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";

let appContextPromise: ReturnType<typeof NestFactory.createApplicationContext> | null = null;

function getAppContext() {
  appContextPromise ??= NestFactory.createApplicationContext(AppModule, {
    logger: false
  });

  return appContextPromise;
}

function validateTelegramInitData(rawInitData: string): boolean {
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

export async function GET(request: Request) {
  const rawInitData = request.headers.get(TELEGRAM_INIT_DATA_HEADER);

  let telegramVerified = false;

  if (rawInitData) {
    try {
      telegramVerified = validateTelegramInitData(rawInitData);
    } catch (error) {
      if (error instanceof Error && error.message === "TELEGRAM_BOT_TOKEN is not configured") {
        return NextResponse.json(
          {
            error: "Server is missing TELEGRAM_BOT_TOKEN for Telegram verification."
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Invalid Telegram init data."
        },
        { status: 401 }
      );
    }
  }

  const app = await getAppContext();
  const helloService = app.get(HelloService);

  return NextResponse.json({
    ...helloService.getHello("/api/hello"),
    telegramVerified
  });
}
