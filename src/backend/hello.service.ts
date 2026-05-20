import { Injectable } from "@nestjs/common";

@Injectable()
export class HelloService {
  getHello(path: string) {
    return {
      message: "Привет от Nest backend!",
      path,
      time: new Date().toISOString()
    };
  }
}
