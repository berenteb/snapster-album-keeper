import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AlbumModule } from "./album/album.module";
import { AuthModule } from "./auth/auth.module";
import environment from "./config/environment";
import { FileModule } from "./file/file.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    FileModule,
    AuthModule,
    AlbumModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
