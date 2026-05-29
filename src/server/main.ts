import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function readAllowedOrigins() {
  const rawValue = process.env.FRONTEND_ORIGIN ?? "";
  return rawValue
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const allowedOrigins = readAllowedOrigins();

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

void bootstrap();
