import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { NextResponse } from "next/server";
import { AppModule } from "@/src/backend/app.module";
import { HelloService } from "@/src/backend/hello.service";

export const runtime = "nodejs";

let appContextPromise: ReturnType<typeof NestFactory.createApplicationContext> | null = null;

function getAppContext() {
  appContextPromise ??= NestFactory.createApplicationContext(AppModule, {
    logger: false
  });

  return appContextPromise;
}

export async function GET() {
  const app = await getAppContext();
  const helloService = app.get(HelloService);

  return NextResponse.json(helloService.getHello("/api/hello"));
}
