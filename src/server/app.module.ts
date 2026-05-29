import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { HelloService } from "../backend/hello.service";

@Module({
  controllers: [AppController],
  providers: [HelloService]
})
export class AppModule {}
