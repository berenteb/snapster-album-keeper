import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import environment from "./config/environment";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    FileModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
