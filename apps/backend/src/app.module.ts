import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import environment from "./config/environment";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
