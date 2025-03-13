import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";

import { MinioModule } from "../minio/minio.module";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";

@Module({
  imports: [MinioModule, PrismaModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
