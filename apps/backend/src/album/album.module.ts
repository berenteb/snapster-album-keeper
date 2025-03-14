import { Module } from "@nestjs/common";

import { FileModule } from "../file/file.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
