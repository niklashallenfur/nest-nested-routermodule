import { Controller, Get, INestApplication, Module } from "@nestjs/common";
import { NestFactory, RouterModule } from "@nestjs/core";
import * as request from "supertest";

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return "hello";
  }
}

@Module({
  controllers: [AppController]
})
export class ControllerModule {
}

@Module({
  imports: [
    RouterModule.register([
      {
        path: "/parent-module",
        module: ControllerModule
      }
    ]),
    ControllerModule
  ]
})
export class ParentModule {
}

describe("ParentModule", () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(ParentModule);
    await app.init();
  });

  it("GET /parent-module", () => {
    return request(app.getHttpServer())
      .get("/parent-module")
      .expect(200)
      .expect("hello");
  });
});


@Module({
  imports: [
    RouterModule.register([
      {
        path: "/grand-parent-module",
        module: ParentModule
      }
    ]),
    ParentModule
  ]
})
export class GrandParentModule {
}

describe("GrandParentModule", () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(ParentModule);
    await app.init();
  });

  it("GET /parent-module", () => {
    return request(app.getHttpServer())
      .get("/parent-module")
      .expect(404);
  });

  it("GET /grand-parent-module/parent-module", () => {
    return request(app.getHttpServer())
      .get("/grand-parent-module/parent-module")
      .expect(200)
      .expect("hello");
  });
});
